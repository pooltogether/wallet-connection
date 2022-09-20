import { i18nTranslate } from '@pooltogether/react-components'
import React from 'react'
import { BlockExplorerLink } from './BlockExplorerLink'

export enum TransactionToastStatus {
  pendingUserConfirmation = 'pendingUserConfirmation',
  pending = 'pending',
  cancelled = 'cancelled',
  success = 'success',
  error = 'error'
}

export const TransactionToast: React.FC<{
  message: string
  chainId: number
  status: TransactionToastStatus
  hash?: string
  t?: i18nTranslate
}> = (props) => {
  const { message, status: _status, chainId, hash, t } = props

  const status = getStatus(_status, t)

  return (
    <div className='flex flex-col font-averta'>
      <div>{message}</div>
      <div className='flex space-x-1 opacity-80'>
        <div className='text-xxxs'>{status}</div>
        {hash && (
          <>
            <div className='text-xxxs'>|</div>
            <BlockExplorerLink className='text-xxxs' chainId={chainId} txHash={hash} shorten>
              {t?.('receipt') || 'Receipt'}
            </BlockExplorerLink>
          </>
        )}
      </div>
    </div>
  )
}

const getStatus = (status: TransactionToastStatus, t?: i18nTranslate) => {
  if (status === TransactionToastStatus.pendingUserConfirmation) {
    return t?.('pendingWalletConfirmation') || 'Pending wallet confirmation'
  } else if (status === TransactionToastStatus.pending) {
    return t?.('pendingBlockchainConfirmation') || 'Pending blockchain confirmation'
  } else if (status === TransactionToastStatus.cancelled) {
    return t?.('cancelled') || 'Cancelled'
  } else if (status === TransactionToastStatus.success) {
    return t?.('success') || 'Success'
  } else if (status === TransactionToastStatus.error) {
    return t?.('theWordError') || 'Error'
  }
}
