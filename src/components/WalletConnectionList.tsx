import { WalletIcon, ThemedClipSpinner } from '@pooltogether/react-components'
import React, { useState } from 'react'
import classNames from 'classnames'
import { Connector, useConnect } from 'wagmi'

export const WalletConnectionList = (props: {
  className?: string
  onWalletConnected: () => void
}) => {
  const { className, onWalletConnected } = props
  const { connectors, connect } = useConnect()
  const [pendingConnector, setPendingConnector] = useState<Connector>()
  const [errorMessage, setErrorMessage] = useState<string>()

  const connectWallet = async (connector: Connector) => {
    setPendingConnector(connector)
    try {
      connect({ connector })
      onWalletConnected?.()
    } catch (e) {
      console.error('Error connecting to wallet')
      setErrorMessage('Error connecting to wallet')
      return
    }
  }

  return (
    <>
      <ul className={classNames('space-y-2 mx-auto', className)}>
        {/* Hide the WalletConnect connector since it breaks the flow */}
        {connectors
          .filter((connector) => connector.id !== 'walletConnect')
          .map((connector) => (
            <FullWalletConnectionButton
              key={connector.id}
              connector={connector}
              connectWallet={() => connectWallet(connector)}
              disabled={!!pendingConnector}
              pending={pendingConnector === connector}
            />
          ))}
      </ul>
      {errorMessage && <div className='text-pt-red-light pt-2 text-xxs'>{errorMessage}</div>}
    </>
  )
}

interface FullWalletConnectionButtonProps {
  connector: Connector
  disabled: boolean
  pending: boolean
  connectWallet: () => void
}

const FullWalletConnectionButton: React.FC<FullWalletConnectionButtonProps> = (props) => {
  const { connector, connectWallet, disabled, pending } = props
  const { name, ready } = connector

  if (!ready) return null

  const isInjected = connector.id === 'injected'

  return (
    <li>
      <button
        onClick={connectWallet}
        className={classNames(
          'space-x-2 bg-pt-purple-lightest dark:bg-pt-purple-darkest rounded-lg p-4 flex items-center w-full transition-colors hover:border-highlight-1',
          'border',
          {
            'border-default': pending,
            'border-transparent': !pending
          }
        )}
        disabled={disabled}
      >
        <WalletIcon
          wallet={isInjected ? 'injected' : name.toLowerCase()}
          className='ml-4'
          sizeClassName='w-6 h-6'
        />
        <span className='capitalize leading-none tracking-wider font-bold text-lg'>
          {isInjected ? 'injected' : name}
        </span>
        {pending && <ThemedClipSpinner sizeClassName='w-5 h-5 ml-2' />}
      </button>
    </li>
  )
}
