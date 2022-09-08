import React from 'react'
import { shorten as shortenHash } from '@pooltogether/utilities'
import classNames from 'classnames'
import { CopyIcon, ExternalLink, LinkTheme } from '@pooltogether/react-components'
import { getBlockExplorerUrl } from '../utilities/getBlockExplorerUrl'

export const BlockExplorerLink: React.FC<{
  chainId: number
  address?: string
  txHash?: string
  children?: React.ReactNode
  className?: string
  shorten?: boolean
  noIcon?: boolean
  noText?: boolean
  underline?: boolean
  iconClassName?: string
  copyable?: boolean
  theme?: LinkTheme
}> = (props) => {
  const {
    address,
    txHash,
    children,
    className,
    shorten,
    noIcon,
    noText,
    underline,
    iconClassName,
    copyable,
    chainId,
    theme
  } = props

  let url
  if (txHash) {
    url = formatBlockExplorerTxUrl(txHash, chainId)
  } else if (address) {
    url = formatBlockExplorerAddressUrl(address, chainId)
  }

  const display = txHash || address

  const defaultText = (
    <div className='flex'>
      <span
        className={classNames('inline-block', {
          'sm:hidden': !shorten
        })}
      >
        {shortenHash({ hash: display, short: true })}
      </span>
      <span
        className={classNames('hidden', {
          'sm:inline-block': !shorten
        })}
      >
        {!noText && display}
      </span>
    </div>
  )

  return (
    <>
      <ExternalLink
        underline={underline}
        theme={theme}
        className={classNames(`inline-flex`, className)}
        href={url}
        noIcon={noIcon}
        iconClassName={iconClassName}
        title='View on Block Explorer'
      >
        {!noText && (children || defaultText)}
      </ExternalLink>
      {copyable && (
        <CopyIcon className={classNames(className, iconClassName, theme, 'ml-2')} text={display} />
      )}
    </>
  )
}

BlockExplorerLink.defaultProps = {
  noIcon: false,
  noText: false,
  underline: false,
  theme: LinkTheme.default,
  iconClassName: 'h-4 w-4 ml-1'
}

export const formatBlockExplorerTxUrl = (tx, networkId) => {
  try {
    const blockExplorerUrl = getBlockExplorerUrl(Number(networkId))
    return `${blockExplorerUrl}/tx/${tx}`
  } catch (e) {
    console.error('Chain Id not supported', { chainId: Number(networkId) })
    return null
  }
}

export const formatBlockExplorerAddressUrl = (address, networkId) => {
  try {
    const blockExplorerUrl = getBlockExplorerUrl(Number(networkId))
    return `${blockExplorerUrl}/address/${address}`
  } catch (e) {
    console.error('Chain Id not supported', { chainId: Number(networkId) })
    return null
  }
}
