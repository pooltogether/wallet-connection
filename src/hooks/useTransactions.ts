import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { transactionsAtom } from '../atoms'

/**
 *
 * @param id
 * @returns
 */
export const useTransactions = (ids: string[]) => {
  const [transactions] = useAtom(transactionsAtom)
  return useMemo(
    () => transactions.filter((transaction) => ids?.includes(transaction.id)),
    [transactions, ids]
  )
}
