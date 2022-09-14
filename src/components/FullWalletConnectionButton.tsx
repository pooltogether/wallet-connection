import {
  SquareButton,
  SquareButtonSize,
  SquareButtonTheme,
  ThemedClipSpinner
} from '@pooltogether/react-components'
import React, { useState } from 'react'
import { useAtom } from 'jotai'
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
  theme?: SquareButtonTheme
  t?: i18nTranslate
  mainnetRpcUrl?: string | string[]
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
    TosDisclaimer,
    mainnetRpcUrl
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
    <SquareButton
      className={classNames(buttonClassName)}
      onClick={() => setIsWalletConnectionModalOpen(true)}
      size={SquareButtonSize.sm}
      theme={theme}
    >
      Connect Wallet
    </SquareButton>
  )
  if (pendingTransactions?.length > 0) {
    networkButton = <NetworkSelectionButton chains={chains} />
    button = (
      <button
        onClick={() => setIsAccountModalOpen(true)}
        className={classNames(
          buttonClassName,
          'flex text-pt-teal hover:text-inverse transition-colors font-semibold items-center space-x-2'
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
          'flex text-pt-teal hover:text-inverse transition-colors font-semibold items-center space-x-2'
        )}
      >
        <AccountAvatar address={address} sizeClassName={iconSizeClassName} />
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
        mainnetRpcUrl={mainnetRpcUrl}
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
  theme: SquareButtonTheme.teal
}
