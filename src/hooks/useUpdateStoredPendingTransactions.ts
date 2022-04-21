import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { deleteTransactionsAtom, transactionsAtom, updateTransactionsAtom } from '../atoms'
import { RPC_API_KEYS, TransactionState, TransactionStatus } from '../constants'
import { getReadProvider } from '../utilities/getReadProvider'

/**
 * Only call this hook once at the root of the app.
 */
export const useUpdateStoredPendingTransactions = () => {
  const [_transactions] = useAtom(transactionsAtom)
  const updateTransaction = useUpdateAtom(updateTransactionsAtom)
  const deleteTransaction = useUpdateAtom(deleteTransactionsAtom)

  useEffect(() => {
    const pendingTransactions = _transactions.filter(
      (transaction) => transaction.state === TransactionState.pending
    )
    pendingTransactions.forEach(async (transaction) => {
      const hash = transaction.response?.hash
      const provider = getReadProvider(transaction.chainId, RPC_API_KEYS)
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
