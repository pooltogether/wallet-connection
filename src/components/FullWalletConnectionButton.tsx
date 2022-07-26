import { Button, ButtonSize, ButtonTheme, ThemedClipSpinner } from '@pooltogether/react-components'
import React, { useState } from 'react'
import { useAtom } from 'jotai'

import { AccountModal } from './AccountModal'
import classNames from 'classnames'
import { Chain, useAccount, useConnect } from 'wagmi'
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
  const { data: account } = useAccount()
  const { activeConnector } = useConnect()
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isWalletConnectionModalOpen, setIsWalletConnectionModalOpen] = useAtom(
    isWalletConnectionModalOpenAtom
  )
  const pendingTransactions = useUsersPendingTransactions(account?.address)
  const connected = !!activeConnector

  let networkButton: React.ReactNode
  let button: React.ReactNode = (
    <Button
      className={classNames(buttonClassName)}
      onClick={() => setIsWalletConnectionModalOpen(true)}
      size={ButtonSize.sm}
      theme={theme}
    >
      Connect Wallet
    </Button>
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
  } else if (connected && !!account) {
    networkButton = <NetworkSelectionButton chains={chains} />
    button = (
      <button
        onClick={() => setIsAccountModalOpen(true)}
        className={classNames(
          buttonClassName,
          'flex text-gradient-magenta hover:text-inverse transition-colors font-semibold items-center space-x-2'
        )}
      >
        <AccountAvatar address={account.address} sizeClassName={iconSizeClassName} />
        <span>
          <AccountName address={account.address} />
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
  iconSizeClassName: 'w-5 h-5',
  pendingIconSizeClassName: 'w-4 h-4',
  theme: ButtonTheme.teal
}
