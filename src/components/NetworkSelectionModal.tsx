import React from 'react'
import { BottomSheet } from '@pooltogether/react-components'
import classNames from 'classnames'

import { Chain, useNetwork } from 'wagmi'
import { getChainNameByChainId } from '../utilities/getChainNameByChainId'
import { i18nTranslate } from '@pooltogether/react-components/dist/types'
import { NetworkSelectionList } from './NetworkSelectionList'

interface NetworkSelectionModalProps {
  chains: Chain[]
  isOpen: boolean
  closeModal: () => void
  t?: i18nTranslate
}

export const NetworkSelectionModal: React.FC<NetworkSelectionModalProps> = (props) => {
  const { chains, isOpen, closeModal, t } = props
  const { activeChain } = useNetwork()

  return (
    <BottomSheet
      label='wallet-connection-modal'
      open={isOpen}
      onDismiss={closeModal}
      maxWidthClassName='max-w-md'
    >
      <h6 className='text-center uppercase text-sm mb-3'>
        {t?.('chooseANetwork') || 'Choose a network'}
      </h6>
      <p className='max-w-xs mx-auto text-xs mb-8 text-center'>
        Select a network to switch to or change manually in your wallet.
      </p>
      <NetworkSelectionList chains={chains} onSwitch={closeModal} />
      <div className='mt-2 flex flex-col space-y-2 text-center'>
        <p className='text-xxxs'>
          {t?.('currentlyConnectedTo') || 'Currently connected to'}
          <b className={classNames('ml-1', { 'text-pt-red-light': activeChain.unsupported })}>
            {activeChain.name || getChainNameByChainId(activeChain.id)}
          </b>
        </p>
      </div>
    </BottomSheet>
  )
}
