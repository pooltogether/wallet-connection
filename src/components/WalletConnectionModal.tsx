import { Modal } from '@pooltogether/react-components'

import React from 'react'
import { WalletConnectionList } from './WalletConnectionList'
import { i18nTranslate } from '../interfaces'
import classNames from 'classnames'

interface WalletConnectionModalProps {
  isOpen: boolean
  TosDisclaimer: React.ReactNode
  closeModal: () => void
  t?: i18nTranslate
}

export const WalletConnectionModal: React.FC<WalletConnectionModalProps> = (props) => {
  const { isOpen, TosDisclaimer, closeModal } = props

  return (
    <Modal
      label='wallet-connection-modal'
      isOpen={isOpen}
      closeModal={closeModal}
      widthClassName='w-screen xs:w-full'
      maxWidthClassName='max-w-md'
      roundedClassName='rounded-none xs:rounded-xl'
      title='Connect to a wallet'
    >
      <WalletConnectionModalContent TosDisclaimer={TosDisclaimer} onWalletConnected={closeModal} />
    </Modal>
  )
}

export const WalletConnectionModalContent = (props: {
  TosDisclaimer: React.ReactNode
  onWalletConnected: () => void
  className?: string
  t?: i18nTranslate
}) => {
  const { TosDisclaimer, onWalletConnected, className } = props
  return (
    <>
      <p className='mb-8'>{TosDisclaimer}</p>
      <WalletConnectionList
        className={classNames('mb-4', className)}
        onWalletConnected={onWalletConnected}
      />
      <a
        className='text-pt-teal transition hover:opacity-70 underline text-sm'
        href='https://docs.ethhub.io/using-ethereum/wallets/intro-to-ethereum-wallets/'
        target='_blank'
        rel='noreferrer'
      >
        {`What's a wallet?`}
      </a>
    </>
  )
}
