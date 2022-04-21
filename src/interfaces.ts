import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { TransactionState, TransactionStatus } from './constants'

export type i18nTranslate = (i18nKey: string, data?: { [key: string]: string }) => string

export interface ProviderApiKeys {
  alchemy: string
  etherscan: string
  infura: string | { projectId: string; projectSecret: string }
}

export interface Transaction {
  id: string
  name: string
  chainId: number
  usersAddress: string
  status: TransactionStatus
  state: TransactionState
  response?: TransactionResponse
  receipt?: TransactionReceipt
  callbacks?: TransactionCallbacks
}

export interface TransactionCallbacks {
  refetch?: (id: string) => void
  onConfirmedByUser?: (id: string) => void
  onSuccess?: (id: string) => void
  onSentToWallet?: (id: string) => void
  onCancelled?: (id: string) => void
  onComplete?: (id: string) => void
  onError?: (id: string) => void
}

export interface SendTransactionOptions {
  name: string
  callTransaction: () => Promise<TransactionResponse>
  callbacks?: TransactionCallbacks
}
