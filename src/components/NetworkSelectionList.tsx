import { ThemedClipSpinner, NetworkIcon } from '@pooltogether/react-components'
import React, { useState } from 'react'
import classNames from 'classnames'
import { Chain, useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { useWalletChainId } from '../hooks/useWalletChainId'
import { getChainNameByChainId } from '../utilities/getChainNameByChainId'

export const NetworkSelectionList: React.FC<{
  chains: Chain[]
  onSwitch?: (chainId: number) => void
}> = (props) => {
  const { chains, onSwitch } = props
  const { connector } = useAccount()
  const { chain: activeChain } = useNetwork()
  const { switchNetwork: _switchNetwork } = useSwitchNetwork()
  const walletChainId = useWalletChainId()
  const [switchingToNetwork, setSwitchingToNetwork] = useState<number>()
  const [errorMessage, setErrorMessage] = useState<string>()

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
    onSwitch?.(chainId)
  }

  if (!connector) return null
  return (
    <>
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
      {errorMessage && <div className='text-pt-red-light pt-2 text-xxs'>{errorMessage}</div>}
    </>
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
