import FeatherIcon from 'feather-icons-react'
import {
  SquareButton,
  BottomSheet,
  SquareButtonTheme,
  BlockExplorerLink,
  SquareButtonSize,
  ThemedClipSpinner,
  NetworkIcon,
  WalletIcon
} from '@pooltogether/react-components'

import React from 'react'
import { Connector, useNetwork } from 'wagmi'
import { i18nTranslate, Transaction } from '../interfaces'
import { getChainNameByChainId } from '../utilities/getChainNameByChainId'
import { useUsersTransactions } from '../hooks/useUsersTransactions'
import { TransactionState, TransactionStatus } from '../constants'
import { AccountAvatar } from './AccountAvatar'

interface AccountModalProps {
  isOpen: boolean
  TosDisclaimer: React.ReactNode
  account: {
    address: string
    connector: Connector
  }
  disconnect: () => void
  closeModal: () => void
  t?: i18nTranslate
}

export const AccountModal: React.FC<AccountModalProps> = (props) => {
  const { account, isOpen, disconnect, closeModal } = props
  const [{ data: network }] = useNetwork()
  const address = account?.address
  const connector = account?.connector
  const connectorName = connector?.name
  const chainId = network.chain?.id
  const transactions = useUsersTransactions(address)
  const filteredTransactions = transactions?.slice(transactions.length - 5).reverse()

  return (
    <BottomSheet
      label='account-modal'
      open={isOpen}
      onDismiss={closeModal}
      maxWidthClassName='max-w-md'
    >
      <h4 className='mb-2'>Account</h4>
      <div className='grid grid-cols-2'>
        <div className='flex flex-col space-y-1'>
          <div className='flex space-x-2 items-center font-bold'>
            <AccountAvatar address={address} />
            <BlockExplorerLink className='opacity-80' shorten address={address} chainId={chainId} />
          </div>
          <div className='space-x-2 opacity-80 flex items-center'>
            <WalletIcon wallet={connector.name.toLowerCase()} sizeClassName='w-5 h-5' />
            <span>{connectorName}</span>
          </div>
          <div className='space-x-2 opacity-80 flex items-center'>
            <NetworkIcon chainId={chainId} sizeClassName='w-5 h-5' />
            <span>{getChainNameByChainId(chainId)}</span>
            <span className='text-xxs opacity-80'>{`(${chainId})`}</span>
          </div>
        </div>
        <div className='flex flex-col justify-end'>
          <SquareButton
            className='w-32 ml-auto'
            size={SquareButtonSize.sm}
            onClick={() => {
              try {
                disconnect()
                closeModal()
              } catch (e) {
                console.error(e.message)
                window.location.reload()
              }
            }}
            theme={SquareButtonTheme.orangeOutline}
          >
            Disconnect
          </SquareButton>
        </div>
      </div>
      <hr />
      {/* TODO: Clear transactions button just in case */}
      <h5 className='mb-2'>Past Transactions</h5>
      <ul className='space-y-1'>
        {filteredTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
        {filteredTransactions.length === 0 && (
          <li>
            <span className='opacity-50'>No transactions yet</span>
          </li>
        )}
      </ul>
    </BottomSheet>
  )
}

const TransactionItem: React.FC<{ transaction: Transaction }> = (props) => {
  const { transaction } = props
  return (
    <li key={transaction.id} className='flex space-x-2 items-center'>
      <TransactionStatusIcon transaction={transaction} />
      <BlockExplorerLink chainId={transaction.chainId} txHash={transaction.response.hash}>
        {transaction.transactionName}
      </BlockExplorerLink>
    </li>
  )
}

const TransactionStatusIcon: React.FC<{
  transaction: Transaction
}> = (props) => {
  const { transaction } = props

  if (transaction.state === TransactionState.pending) {
    return <ThemedClipSpinner sizeClassName='w-4 h-4' />
  } else if (
    transaction.status === TransactionStatus.error ||
    transaction.status === TransactionStatus.cancelled
  ) {
    return <FeatherIcon icon='x-circle' className='text-pt-red-light w-4 h-4' />
  } else {
    return <FeatherIcon icon='check-circle' className='text-pt-teal w-4 h-4' />
  }
}
