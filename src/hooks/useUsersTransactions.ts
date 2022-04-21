import { useAtom } from 'jotai'
import { transactionsAtom } from '../atoms'

/**
 *
 * @param usersAddress
 * @returns
 */
export const useUsersTransactions = (usersAddress: string) => {
  const [transactions] = useAtom(transactionsAtom)
  return transactions.filter(
    (transaction) => transaction.usersAddress === usersAddress && !!transaction.response?.hash
  )
}
