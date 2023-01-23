import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { renderIcon } from '@download/blockies'
import { useEnsAvatar } from 'wagmi'
import { CHAIN_ID } from '../constants'

export const AccountAvatar: React.FC<{
  address: string
  className?: string
  sizeClassName?: string
  chainId?: number
}> = (props) => {
  const { address, className, sizeClassName, chainId } = props
  const { data: src } = useEnsAvatar({ address, chainId })

  if (src) {
    return <img src={src} className={classNames(className, sizeClassName)} />
  }
  return (
    <div className={classNames(className, sizeClassName)}>
      <BlockieIdenticon address={address} alt={`Ethereum address: ${address}`} />
    </div>
  )
}

AccountAvatar.defaultProps = {
  sizeClassName: 'w-7 h-7 sm:w-8 sm:h-8',
  className: 'rounded-full overflow-hidden',
  chainId: CHAIN_ID.mainnet
}

const BlockieIdenticon = ({ address, alt, className }) => {
  const [dataUrl, setDataUrl] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    renderIcon({ seed: address?.toLowerCase() }, canvas)
    const updatedDataUrl = canvas.toDataURL()

    if (updatedDataUrl !== dataUrl) {
      setDataUrl(updatedDataUrl)
    }
  }, [dataUrl, address])

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {dataUrl && <img className={className} src={dataUrl} alt={alt || ''} />}
    </>
  )
}

BlockieIdenticon.defaultProps = {
  address: undefined,
  alt: '',
  className: ''
}
