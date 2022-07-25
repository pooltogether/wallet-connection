import { SendTransactionOptions } from '../interfaces'
import { useSendTransaction } from './useSendTransaction'

/**
 * @param log optional error logger
 * @returns
 */
export const useSendTransactions = (
  t?: (key: string) => string,
  log?: (message: string) => void
) => {
  const sendTransaction = useSendTransaction(t, log)

  return (optionsList: SendTransactionOptions[]) =>
    optionsList.map((options, index) => {
      options.name += ` (${index + 1}/${optionsList.length})`
      return sendTransaction(options)
    })
}
