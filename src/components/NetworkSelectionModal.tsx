import React from 'react'
import { BottomSheet } from '@pooltogether/react-components'
import { Chain } from 'wagmi'
import { i18nTranslate } from '@pooltogether/react-components/dist/types'
import { NetworkSelectionList } from './NetworkSelectionList'
import { NetworkSelectionCurrentlySelected } from './NetworkSelectionCurrentlySelected'

export const NetworkSelectionModal: React.FC<{
  chains: Chain[]
  isOpen: boolean
  closeModal: () => void
  t?: i18nTranslate
}> = (props) => {
  const { chains, isOpen, closeModal, t } = props

  return (
    <BottomSheet
      label='wallet-connection-modal'
      open={isOpen}
      onDismiss={closeModal}
      maxWidthClassName='xs:max-w-md'
    >
      <h6 className='text-center uppercase text-sm mb-3'>
        {t?.('chooseANetwork') || 'Choose a network'}
      </h6>
      <p className='max-w-xs mx-auto text-xs mb-8 text-center'>
        Select a network to switch to or change manually in your wallet.
      </p>
      <NetworkSelectionList chains={chains} onSwitch={closeModal} />
      <NetworkSelectionCurrentlySelected t={t} />
    </BottomSheet>
  )
}
