import { NetworkIcon } from '@pooltogether/react-components'
import React, { useState } from 'react'

import classNames from 'classnames'
import { Chain, useAccount } from 'wagmi'
import { useWalletChainId } from '../hooks/useWalletChainId'
import { NetworkSelectionModal } from './NetworkSelectionModal'
import { i18nTranslate } from '../interfaces'
import { getChainNameByChainId } from '../utilities/getChainNameByChainId'
import { getChainColorByChainId } from '../utilities/getChainColorByChainId'

export interface NetworkSelectionProps {
  chains: Chain[]
  className?: string
  sizeClassName?: string
  t?: i18nTranslate
}

export const NetworkSelectionButton: React.FC<NetworkSelectionProps> = (props) => {
  const { chains, className, sizeClassName, t } = props
  const { connector } = useAccount()
  const chainId = useWalletChainId()
  const [isOpen, setIsOpen] = useState(false)

  if (!connector) return null

  return (
    <>
      <button
        className={classNames(className, 'flex space-x-2 items-center')}
        onClick={() => setIsOpen(true)}
      >
        <NetworkIcon chainId={chainId} sizeClassName={sizeClassName} />
        <span
          className={`hidden sm:block font-bold hover:opacity-70 transition`}
          style={{ color: getChainColorByChainId(chainId) }}
        >
          {getChainNameByChainId(chainId)}
        </span>
      </button>
      <NetworkSelectionModal
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
        chains={chains}
        t={t}
      />
    </>
  )
}
