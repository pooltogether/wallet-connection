import { useUpdateAtom } from 'jotai/utils'
import { createTransactionsAtom, updateTransactionsAtom } from '../atoms'
import { TransactionCallbacks } from '../interfaces'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { TransactionState, TransactionStatus } from '../constants'

/**
 * @param chainId
 * @param usersAddress
 * @returns
 */
export const useSendTransaction = (
  chainId: number,
  usersAddress: string,
  log?: (message: string) => void
) => {
  const createTransaction = useUpdateAtom(createTransactionsAtom)
  const updateTransaction = useUpdateAtom(updateTransactionsAtom)

  /**
   * Submits the transaction, updates state and executes callbacks.
   * @param id
   * @param transactionName
   * @param chainId
   * @param usersAddress
   * @param callTransaction
   * @param callbacks
   */
  const sendTransaction = async (
    id: string,
    transactionName: string,
    chainId: number,
    callTransaction: () => Promise<TransactionResponse>,
    callbacks?: TransactionCallbacks
  ) => {
    let response: TransactionResponse
    let receipt: TransactionReceipt

    try {
      callbacks?.onSent?.(id)
      const responsePromise = callTransaction()
      toast.promise(responsePromise, {
        pending: `${transactionName} confirmation is pending`
      })
      response = await responsePromise
      // Chain id may be set to 0 if EIP-155 is disabled and legacy signing is used
      // See https://docs.ethers.io/v5/api/utils/transactions/#Transaction
      if (response.chainId === 0) {
        response.chainId = chainId
      }
      // Transaction was confirmed in users wallet
      updateTransaction({ id, response, status: TransactionStatus.pendingBlockchainConfirmation })
      callbacks?.onConfirmed?.(id)

      const receiptPromise = response.wait()
      toast.promise(receiptPromise, {
        // TODO: We could make pending & succeded toasts include the tx hash & a link to etherscan.
        pending: `${transactionName} is pending`,
        success: `${transactionName} has completed`,
        error: `${transactionName} was rejected`
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
        toast.error(`${transactionName} confirmation was cancelled`)
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

  return (
    transactionName: string,
    callTransaction: () => Promise<TransactionResponse>,
    callbacks?: TransactionCallbacks
  ) => {
    const id: string = uuid()
    createTransaction({ id, transactionName, chainId, usersAddress })
    sendTransaction(id, transactionName, chainId, callTransaction, callbacks)
    return id
  }
}

const getErrorDetails = (errorMessage: string) => {
  if (errorMessage.includes('Ticket/twab-burn-lt-balance')) return 'Insufficient ticket balance'
  if (errorMessage.includes('TWABDelegator/lock-too-long')) return 'Lock is too long'
  return errorMessage
}
