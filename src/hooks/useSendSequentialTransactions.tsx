import { SendTransactionOptions } from '../interfaces'
import { useSendTransaction } from './useSendTransaction'

/**
 * @param log optional error logger
 * @returns
 */
export const useSendSequentialTransactions = (
  transactionsList: SendTransactionOptions[],
  t?: (key: string) => string,
  log?: (message: string) => void
) => {
  const sendTransaction = useSendTransaction(t, log)

  const sendIndexedTransaction = (index: number) => {
    const options = { ...transactionsList[index] }
    options.name += ` (${index + 1}/${transactionsList.length})`
    const isLast = index === transactionsList.length - 1
    if (!options.callbacks) options.callbacks = {}
    if (!isLast) {
      const tempOnConfirmedByUser = options.callbacks?.onConfirmedByUser
      options.callbacks.onConfirmedByUser = (id: string) => {
        tempOnConfirmedByUser?.(id)
        sendIndexedTransaction(index + 1)
      }
    }
    sendTransaction(options)
  }

  return async () => sendIndexedTransaction(0)
}
