import { useUpdateAtom } from 'jotai/utils'
import { createTransactionsAtom, updateTransactionsAtom } from '../atoms'
import { SendTransactionOptions, TransactionCallbacks } from '../interfaces'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { TransactionState, TransactionStatus } from '../constants'
import { useUsersAddress } from './useUsersAddress'
import { useWalletChainId } from './useWalletChainId'

/**
 * @param log optional error logger
 * @returns
 */
export const useSendTransaction = (log?: (message: string) => void) => {
  const usersAddress = useUsersAddress()
  const chainId = useWalletChainId()
  const createTransaction = useUpdateAtom(createTransactionsAtom)
  const updateTransaction = useUpdateAtom(updateTransactionsAtom)

  /**
   * Submits the transaction, updates state and executes callbacks.
   * @param id
   * @param name
   * @param chainId
   * @param usersAddress
   * @param callTransaction
   * @param callbacks
   */
  const sendTransaction = async (
    id: string,
    name: string,
    chainId: number,
    callTransaction: () => Promise<TransactionResponse>,
    callbacks?: TransactionCallbacks
  ) => {
    let response: TransactionResponse
    let receipt: TransactionReceipt

    try {
      callbacks?.onSentToWallet?.(id)
      const responsePromise = callTransaction()
      toast.promise(responsePromise, {
        pending: `${name} confirmation is pending`
      })
      response = await responsePromise
      // Chain id may be set to 0 if EIP-155 is disabled and legacy signing is used
      // See https://docs.ethers.io/v5/api/utils/transactions/#Transaction
      if (response.chainId === 0) {
        response.chainId = chainId
      }
      // Transaction was confirmed in users wallet
      updateTransaction({ id, response, status: TransactionStatus.pendingBlockchainConfirmation })
      callbacks?.onConfirmedByUser?.(id)

      const receiptPromise = response.wait()
      toast.promise(receiptPromise, {
        // TODO: We could make pending & succeded toasts include the tx hash & a link to etherscan.
        pending: `${name} is pending`,
        success: `${name} has completed`,
        error: `${name} was rejected`
      })
      receipt = await receiptPromise

      // Transaction was confirmed on chain
      callbacks?.onComplete?.(id)
      const status =
        !!receipt.status && receipt.status === 1
          ? TransactionStatus.success
          : TransactionStatus.error
      updateTransaction({ id, receipt, status, state: TransactionState.complete })
      if (status === TransactionStatus.success) {
        callbacks?.onSuccess?.(id)
      } else {
        callbacks?.onError?.(id)
      }

      callbacks?.refetch?.(id)
    } catch (e) {
      console.error(e.message)
      if (e?.message?.match('User denied transaction signature')) {
        updateTransaction({
          id,
          status: TransactionStatus.cancelled,
          state: TransactionState.complete
        })
        toast.error(`${name} confirmation was cancelled`)
      } else if (e?.error?.message) {
        const errorDetails = getErrorDetails(e.error.message)

        updateTransaction({
          id,
          receipt,
          status: TransactionStatus.error,
          state: TransactionState.complete
        })
        const errorMessage = `Transaction failed - ${errorDetails}`
        toast.error(errorMessage)
        log?.(errorMessage)
      } else {
        updateTransaction({
          id,
          receipt,
          status: TransactionStatus.error,
          state: TransactionState.complete
        })
        const errorMessage = `Transaction failed - Unknown error`
        toast.error(errorMessage)
        log?.(errorMessage)
      }
    }
  }

  return (options: SendTransactionOptions) => {
    const { name, callTransaction, callbacks } = options
    const id: string = uuid()
    createTransaction({ id, name, chainId, usersAddress })
    sendTransaction(id, name, chainId, callTransaction, callbacks)
    return id
  }
}

const getErrorDetails = (errorMessage: string) => {
  if (errorMessage.includes('Ticket/twab-burn-lt-balance')) return 'Insufficient ticket balance'
  if (errorMessage.includes('TWABDelegator/lock-too-long')) return 'Lock is too long'
  return errorMessage
}
