import { Button, ButtonSize, ButtonTheme, ThemedClipSpinner } from '@pooltogether/react-components'
import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { AccountModal } from './AccountModal'
import classNames from 'classnames'
import { Chain, useAccount } from 'wagmi'
import { i18nTranslate } from '../interfaces'
import { useUsersPendingTransactions } from '../hooks/useUsersPendingTransactions'
import { AccountName } from './AccountName'
import { AccountAvatar } from './AccountAvatar'
import { NetworkSelectionButton } from './NetworkSelectionButton'
import { WalletConnectionModal } from './WalletConnectionModal'
import { isWalletConnectionModalOpenAtom } from '../atoms'

export interface FullWalletConnectionProps {
  chains: Chain[]
  className?: string
  buttonClassName?: string
  iconSizeClassName?: string
  pendingIconSizeClassName?: string
  TosDisclaimer: React.ReactNode
  theme?: ButtonTheme
  t?: i18nTranslate
}

/**
 * NOTE: Only render one per app.
 * @param props
 * @returns
 */
export const FullWalletConnectionButton: React.FC<FullWalletConnectionProps> = (props) => {
  const {
    chains,
    className,
    buttonClassName,
    iconSizeClassName,
    pendingIconSizeClassName,
    t,
    theme,
    TosDisclaimer
  } = props
  const { address, connector } = useAccount()
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isWalletConnectionModalOpen, setIsWalletConnectionModalOpen] = useAtom(
    isWalletConnectionModalOpenAtom
  )
  const pendingTransactions = useUsersPendingTransactions(address)
  const connected = !!connector

  let networkButton: React.ReactNode
  let button: React.ReactNode = (
    <ConnectButton.Custom>
      {({ openConnectModal, mounted }) => {
        const ready = mounted

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            })}
          >
            <Button
              className={classNames(buttonClassName)}
              onClick={openConnectModal}
              size={ButtonSize.sm}
              theme={theme}
            >
              {t?.('connectWallet') || 'Connect Wallet'}
            </Button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
  if (pendingTransactions?.length > 0) {
    networkButton = <NetworkSelectionButton chains={chains} />
    button = (
      <button
        onClick={() => setIsAccountModalOpen(true)}
        className={classNames(
          buttonClassName,
          'flex text-gradient-magenta hover:text-inverse transition-colors font-semibold items-center space-x-2'
        )}
      >
        <ThemedClipSpinner sizeClassName={pendingIconSizeClassName} />
        <span>{`${pendingTransactions.length} pending`}</span>
      </button>
    )
  } else if (connected && !!address) {
    networkButton = <NetworkSelectionButton chains={chains} sizeClassName={iconSizeClassName} />
    button = (
      <button
        onClick={() => setIsAccountModalOpen(true)}
        className={classNames(
          buttonClassName,
          'flex text-gradient-magenta hover:text-inverse transition-colors font-semibold items-center space-x-2'
        )}
      >
        <AccountAvatar
          address={address}
          sizeClassName={iconSizeClassName}
          className='shadow rounded-full overflow-hidden'
        />
        <span>
          <AccountName address={address} />
        </span>
      </button>
    )
  }

  return (
    <>
      <div className={className}>
        {networkButton}
        {button}
      </div>
      <AccountModal
        t={t}
        closeModal={() => setIsAccountModalOpen(false)}
        isOpen={isAccountModalOpen}
        TosDisclaimer={TosDisclaimer}
      />
      <WalletConnectionModal
        t={t}
        closeModal={() => setIsWalletConnectionModalOpen(false)}
        isOpen={isWalletConnectionModalOpen}
        TosDisclaimer={TosDisclaimer}
      />
    </>
  )
}

FullWalletConnectionButton.defaultProps = {
  className: 'flex space-x-4 items-center',
  iconSizeClassName: 'w-6 h-6',
  pendingIconSizeClassName: 'w-4 h-4',
  theme: ButtonTheme.teal
}
