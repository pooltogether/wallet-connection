import React, { useState } from 'react'
import { useWalletChainId } from '../hooks/useWalletChainId'
import { BottomSheet, NetworkIcon, ThemedClipSpinner } from '@pooltogether/react-components'
import classNames from 'classnames'

import { Chain, useConnect, useNetwork } from 'wagmi'
import { getChainNameByChainId } from '../utilities/getChainNameByChainId'
import { i18nTranslate } from '@pooltogether/react-components/dist/types'

interface NetworkSelectionModalProps {
  chains: Chain[]
  isOpen: boolean
  closeModal: () => void
  t?: i18nTranslate
}

export const NetworkSelectionModal: React.FC<NetworkSelectionModalProps> = (props) => {
  const { chains, isOpen, closeModal, t } = props
  const { activeChain, switchNetwork: _switchNetwork } = useNetwork()
  const walletChainId = useWalletChainId()
  const [switchingToNetwork, setSwitchingToNetwork] = useState<number>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const { activeConnector } = useConnect()

  const switchNetwork = async (chainId: number) => {
    setErrorMessage(undefined)
    if (walletChainId !== chainId) {
      try {
        setSwitchingToNetwork(chainId)
        await _switchNetwork(chainId)
      } catch (e) {
        console.error(e)
        setErrorMessage(`Error switching to ${getChainNameByChainId(chainId)}`)
      }
    }
    setSwitchingToNetwork(undefined)
    closeModal()
  }

  if (!activeConnector) return null

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
      <ul className='space-y-2 mx-auto max-w-sm'>
        {chains.map((chain) => (
          <NetworkSelectionButton
            key={chain.id}
            chain={chain}
            onClick={() => switchNetwork(chain.id)}
            pending={switchingToNetwork === chain.id}
            selected={activeChain.id === chain.id}
          />
        ))}
      </ul>
      <div className='mt-8 flex flex-col space-y-2 text-center'>
        {errorMessage && <p className='text-pt-red-light'>{errorMessage}</p>}
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

interface NetworkSelectionButtonProps {
  chain: Chain
  selected: boolean
  pending: boolean
  onClick: () => void
}

const NetworkSelectionButton: React.FC<NetworkSelectionButtonProps> = (props) => {
  const { chain, pending, selected, onClick } = props
  const { id, name } = chain

  return (
    <li>
      <button
        onClick={onClick}
        className={classNames(
          'bg-pt-purple-lighter dark:bg-pt-purple-darker rounded-lg p-4 flex items-center w-full transition-colors',
          'border',
          {
            'hover:border-highlight-1': !pending,
            'border-default': selected,
            'border-transparent': !selected
          }
        )}
        disabled={pending}
      >
        <NetworkIcon chainId={id} className='mx-1' sizeClassName='w-5 h-5' />
        <span className='capitalize leading-none tracking-wider font-bold text-lg'>{name}</span>
        {pending && <ThemedClipSpinner sizeClassName='w-5 h-5 ml-2' />}
      </button>
    </li>
  )
}
