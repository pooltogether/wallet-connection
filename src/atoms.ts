import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { TransactionState, TransactionStatus } from './constants'
import { Transaction } from './interfaces'

/**
 * Transaction we can do something with
 */
export const isWalletConnectionModalOpenAtom = atom<boolean>(false)

/**
 * Transaction we can do something with
 */
export const transactionsAtom = atomWithStorage<Transaction[]>('pooltogether-transactions', [])

/**
 * Write only.
 * Creates a transaction in the storage.
 * Limits transaction storage to 20 transactions across all addresses.
 */
export const createTransactionsAtom = atom<
  null,
  { id: string; name: string; chainId: number; usersAddress: string }
>(null, (get, set, _transaction) => {
  let transactions = [...get(transactionsAtom)]
  const transaction: Transaction = {
    ..._transaction,
    state: TransactionState.pending,
    status: TransactionStatus.pendingUserConfirmation
  }
  transactions.push(transaction)
  if (transactions.length > 20) {
    transactions = transactions.slice(transactions.length - 20)
  }
  set(transactionsAtom, transactions)
})

/**
 * Write only.
 * Updates a transactions state, status, response or receipt in the storage.
 */
export const updateTransactionsAtom = atom<
  null,
  {
    id: string
    state?: TransactionState
    status?: TransactionStatus
    response?: TransactionResponse
    receipt?: TransactionReceipt
  }
>(null, (get, set, transactionUpdate) => {
  const { id, state, status, response, receipt } = transactionUpdate
  const transactions = [...get(transactionsAtom)]
  const index = transactions.findIndex((transaction) => transaction.id === id)
  transactions[index] = {
    ...transactions[index],
    state: state || transactions[index].state,
    status: status || transactions[index].status,
    response: response || transactions[index].response,
    receipt: receipt || transactions[index].receipt
  }
  set(transactionsAtom, transactions)
})

/**
 * Write only.
 * Removes a transactions from the storage.
 */
export const deleteTransactionsAtom = atom<null, string>(null, (get, set, id) => {
  const transactions = [...get(transactionsAtom)]
  const index = transactions.findIndex((transaction) => transaction.id === id)
  transactions.splice(index, 1)
  set(transactionsAtom, transactions)
})
