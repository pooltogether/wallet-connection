import { useAtom } from 'jotai'
import { transactionsAtom } from '../atoms'
import { TransactionStatus } from '../constants'

/**
 * Returns transactions that have been submitted by the user to be mined that are still pending
 * @param usersAddress
 * @returns
 */
export const useUsersPendingTransactions = (usersAddress: string) => {
  const [transactions] = useAtom(transactionsAtom)
  return transactions.filter(
    (transaction) =>
      transaction.usersAddress === usersAddress &&
      transaction.status === TransactionStatus.pendingBlockchainConfirmation
  )
}
