import { useUpdateAtom } from 'jotai/utils'
import { createTransactionsAtom, updateTransactionsAtom } from '../atoms'
import { SendTransactionOptions, TransactionCallbacks } from '../interfaces'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { toast, ToastContentProps } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { TransactionState, TransactionStatus } from '../constants'
import { useUsersAddress } from './useUsersAddress'
import { useWalletChainId } from './useWalletChainId'
import { TransactionToast, TransactionToastStatus } from '@pooltogether/react-components'
import React from 'react'

/**
 * @param log optional error logger
 * @returns
 */
export const useSendTransaction = (
  t?: (key: string) => string,
  log?: (message: string) => void
) => {
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
        pending: {
          render: () => {
            return (
              <TransactionToast
                message={name}
                chainId={chainId}
                status={TransactionToastStatus.pendingUserConfirmation}
                t={t}
              />
            )
          }
        }
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
        pending: {
          render: () => {
            return (
              <TransactionToast
                message={name}
                chainId={chainId}
                status={TransactionToastStatus.pending}
                t={t}
              />
            )
          }
        },
        success: {
          render: (props: ToastContentProps<TransactionReceipt>) => {
            const { data } = props
            return (
              <TransactionToast
                message={name}
                chainId={chainId}
                status={TransactionToastStatus.success}
                hash={data.transactionHash}
                t={t}
              />
            )
          }
        },
        error: {
          render: (props: ToastContentProps<TransactionReceipt>) => {
            const { data } = props
            return (
              <TransactionToast
                message={name}
                chainId={chainId}
                status={TransactionToastStatus.error}
                hash={data.transactionHash}
                t={t}
              />
            )
          }
        }
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
      console.error(e, e.message)
      if (e?.message?.match('User denied transaction signature')) {
        console.log('Here A', id)
        updateTransaction({
          id,
          status: TransactionStatus.cancelled,
          state: TransactionState.complete
        })
        toast.error({
          render() {
            return (
              <TransactionToast
                message={name}
                chainId={chainId}
                status={TransactionToastStatus.cancelled}
                hash={receipt?.transactionHash}
                t={t}
              />
            )
          }
        })
      } else if (e?.error?.message) {
        console.log('Here B')
        const errorDetails = getErrorDetails(e.error.message)

        updateTransaction({
          id,
          receipt,
          status: TransactionStatus.error,
          state: TransactionState.complete
        })
        const errorMessage = `Transaction failed - ${errorDetails}`
        toast.error({
          render() {
            return (
              <TransactionToast
                message={errorMessage}
                chainId={chainId}
                status={TransactionToastStatus.cancelled}
                hash={receipt?.transactionHash}
                t={t}
              />
            )
          }
        })
        log?.(errorMessage)
      } else {
        console.log('Here C')
        updateTransaction({
          id,
          receipt,
          status: TransactionStatus.error,
          state: TransactionState.complete
        })
        const errorMessage = `Transaction failed - Unknown error`
        toast.error({
          render() {
            return (
              <TransactionToast
                message={errorMessage}
                chainId={chainId}
                status={TransactionToastStatus.cancelled}
                hash={receipt?.transactionHash}
                t={t}
              />
            )
          }
        })
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
