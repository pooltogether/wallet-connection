import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { transactionsAtom, updateTransactionsAtom } from '../atoms'
import { TransactionState, TransactionStatus } from '../constants'
import { getReadProvider } from '../utilities/getReadProvider'

/**
 * Only call this hook once at the root of the app.
 */
export const useUpdateStoredPendingTransactions = () => {
  const [_transactions] = useAtom(transactionsAtom)
  const updateTransaction = useUpdateAtom(updateTransactionsAtom)

  useEffect(() => {
    const pendingTransactions = _transactions.filter(
      (transaction) => transaction.state === TransactionState.pending
    )
    pendingTransactions.forEach(async (transaction) => {
      const hash = transaction.response.hash
      const provider = getReadProvider(transaction.chainId)
      const id = transaction.id
      let receipt: TransactionReceipt
      let response: TransactionResponse
      try {
        response = await provider.getTransaction(hash)
        await response.wait()
        receipt = await provider.getTransactionReceipt(response.hash)
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
