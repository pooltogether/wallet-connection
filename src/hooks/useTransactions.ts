import { useAtom } from 'jotai'
import { transactionsAtom } from '../atoms'

/**
 *
 * @param id
 * @returns
 */
export const useTransactions = (ids: string[]) => {
  const [transactions] = useAtom(transactionsAtom)
  return transactions.filter((transaction) => ids?.includes(transaction.id))
}
