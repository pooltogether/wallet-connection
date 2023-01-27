import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { deleteTransactionsAtom, transactionsAtom, updateTransactionsAtom } from '../atoms'
import { TransactionState, TransactionStatus } from '../constants'
import { getReadProvider } from '../utilities/getReadProvider'

/**
 * Only call this hook once at the root of the app.
 */
export const useUpdateStoredPendingTransactions = (_rpcUrls?: {
  [chainId: number]: string | string[]
}) => {
  const [_transactions] = useAtom(transactionsAtom)
  const updateTransaction = useSetAtom(updateTransactionsAtom)
  const deleteTransaction = useSetAtom(deleteTransactionsAtom)

  useEffect(() => {
    const pendingTransactions = _transactions.filter(
      (transaction) => transaction.state === TransactionState.pending
    )
    pendingTransactions.forEach(async (transaction) => {
      const hash = transaction.response?.hash
      const provider = getReadProvider(transaction.chainId, _rpcUrls?.[transaction.chainId])
      const id = transaction.id
      let receipt: TransactionReceipt
      let response: TransactionResponse
      try {
        // If the transaction was submitted, fetch it's current on chain status
        if (hash) {
          response = await provider.getTransaction(hash)
          await response.wait()
          receipt = await provider.getTransactionReceipt(hash)
          const status =
            !!receipt.status && receipt.status === 1
              ? TransactionStatus.success
              : TransactionStatus.error
          updateTransaction({
            id,
            response,
            receipt,
            status,
            state: TransactionState.complete
          })
        } else {
          // Otherwise it is a transaction that never made it to the transaction pool, so it's useless data
          deleteTransaction(id)
        }
      } catch (e) {
        updateTransaction({
          id,
          response,
          receipt,
          status: TransactionStatus.error,
          state: TransactionState.complete
        })
      }
    })
  }, [])
}
