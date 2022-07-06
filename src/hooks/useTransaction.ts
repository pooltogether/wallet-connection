import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { transactionsAtom } from '../atoms'

/**
 *
 * @param id
 * @returns
 */
export const useTransaction = (id: string) => {
  const [transactions] = useAtom(transactionsAtom)
  return useMemo(
    () => transactions.find((transaction) => transaction.id === id),
    [transactions, id]
  )
}
