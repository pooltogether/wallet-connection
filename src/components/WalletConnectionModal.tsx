import { BottomSheet } from '@pooltogether/react-components'

import React from 'react'
import { WalletConnectionList } from './WalletConnectionList'
import { i18nTranslate } from '../interfaces'

interface WalletConnectionModalProps {
  isOpen: boolean
  TosDisclaimer: React.ReactNode
  closeModal: () => void
  t?: i18nTranslate
}

export const WalletConnectionModal: React.FC<WalletConnectionModalProps> = (props) => {
  const { isOpen, TosDisclaimer, closeModal } = props

  return (
    <BottomSheet
      label='wallet-connection-modal'
      open={isOpen}
      onDismiss={closeModal}
      maxWidthClassName='max-w-md'
    >
      <h4 className='mb-4'>Connect to a wallet</h4>
      <p className='mb-8'>{TosDisclaimer}</p>
      <WalletConnectionList className='mb-4' closeModal={closeModal} />
      <a
        className='text-pt-teal transition hover:opacity-70 underline text-sm'
        href='https://docs.ethhub.io/using-ethereum/wallets/intro-to-ethereum-wallets/'
        target='_blank'
        rel='noreferrer'
      >
        {`What's a wallet?`}
      </a>
    </BottomSheet>
  )
}
