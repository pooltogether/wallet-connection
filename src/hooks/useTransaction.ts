import { useAtom } from 'jotai'
import { transactionsAtom } from '../atoms'

/**
 *
 * @param id
 * @returns
 */
export const useTransaction = (id: string) => {
  const [transactions] = useAtom(transactionsAtom)
  return transactions.find((transaction) => transaction.id === id)
}
