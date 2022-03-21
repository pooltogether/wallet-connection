import { useAtom } from 'jotai'
import { transactionsAtom } from '../atoms'
import { TransactionState } from '../constants'

/**
 *
 * @param usersAddress
 * @returns
 */
export const useUsersPendingTransactions = (usersAddress: string) => {
  const [transactions] = useAtom(transactionsAtom)
  return transactions.filter(
    (transaction) =>
      transaction.usersAddress === usersAddress && transaction.state === TransactionState.pending
  )
}
