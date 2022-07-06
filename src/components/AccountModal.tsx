import FeatherIcon from 'feather-icons-react'
import {
  Button,
  BottomSheet,
  ButtonTheme,
  BlockExplorerLink,
  ButtonSize,
  ThemedClipSpinner,
  NetworkIcon,
  WalletIcon
} from '@pooltogether/react-components'
import React from 'react'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import { i18nTranslate, Transaction } from '../interfaces'
import { getChainNameByChainId } from '../utilities/getChainNameByChainId'
import { useUsersTransactions } from '../hooks/useUsersTransactions'
import { TransactionState, TransactionStatus } from '../constants'
import { AccountAvatar } from './AccountAvatar'
import { useUpdateAtom } from 'jotai/utils'
import { transactionsAtom } from '../atoms'
import { AccountName } from './AccountName'

interface AccountModalProps {
  isOpen: boolean
  TosDisclaimer: React.ReactNode
  closeModal: () => void
  t?: i18nTranslate
}

export const AccountModal: React.FC<AccountModalProps> = (props) => {
  const { isOpen, closeModal } = props
  const { data: account } = useAccount()
  const { disconnect } = useDisconnect()
  const { activeChain } = useNetwork()
  const address = account?.address
  const connector = account?.connector
  const connectorName = connector?.name
  const chainId = activeChain?.id
  const transactions = useUsersTransactions(address)
  const filteredTransactions = transactions?.slice(transactions.length - 5).reverse()
  const setTransactions = useUpdateAtom(transactionsAtom)

  if (!account) {
    return (
      <BottomSheet
        label='account-modal'
        open={isOpen}
        onDismiss={closeModal}
        maxWidthClassName='max-w-md'
      >
        <div />
      </BottomSheet>
    )
  }

  return (
    <BottomSheet
      label='account-modal'
      open={isOpen}
      onDismiss={closeModal}
      maxWidthClassName='max-w-md'
    >
      <h4 className='mb-2'>Account</h4>
      <div className='grid grid-cols-2'>
        <div className='flex flex-col space-y-2'>
          <div className='flex space-x-2 items-center font-bold'>
            <AccountAvatar address={address} sizeClassName='w-8 h-8' />
            <BlockExplorerLink
              className='opacity-80'
              shorten
              address={address}
              chainId={chainId}
              copyable
            >
              <AccountName address={address} />
            </BlockExplorerLink>
          </div>
          <div className='space-x-2 opacity-80 flex items-center'>
            <WalletIcon
              wallet={connectorName?.toLowerCase()}
              sizeClassName='w-6 h-6'
              className='mx-1'
            />
            <span>{connectorName}</span>
          </div>
          <div className='space-x-2 opacity-80 flex items-center'>
            <NetworkIcon chainId={chainId} sizeClassName='w-6 h-6' className='mx-1' />
            <span>{getChainNameByChainId(chainId)}</span>
            <span className='text-xxs opacity-80'>{`(${chainId})`}</span>
          </div>
        </div>
        <div className='flex flex-col justify-end'>
          <Button
            className='w-32 ml-auto'
            size={ButtonSize.sm}
            onClick={() => {
              try {
                closeModal()
                disconnect()
              } catch (e) {
                console.error(e.message)
                window.location.reload()
              }
            }}
            theme={ButtonTheme.orangeOutline}
          >
            Disconnect
          </Button>
        </div>
      </div>
      <hr />
      {/* TODO: Clear transactions button just in case */}
      <div className='flex justify-between items-center'>
        <h5 className='mb-2'>Past Transactions</h5>
        {filteredTransactions.length > 0 && (
          <button onClick={() => setTransactions([])} className='opacity-50 text-xxs leading-none'>
            Clear transactions
          </button>
        )}
      </div>
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
      {!!transaction.response ? (
        <BlockExplorerLink chainId={transaction.chainId} txHash={transaction.response.hash}>
          {transaction.name}
        </BlockExplorerLink>
      ) : (
        <span>{transaction.name}</span>
      )}
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
