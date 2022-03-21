import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { useEnsAvatar } from 'wagmi'
import { renderIcon } from '@download/blockies'

const BLOCKIE_DIAMETER = 22

export const AccountAvatar: React.FC<{
  address: string
  className?: string
  sizeClassName?: string
}> = (props) => {
  const { address, className, sizeClassName } = props
  const [{ data: src }] = useEnsAvatar({ addressOrName: address })

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
  sizeClassName: 'w-5 h-5',
  className: 'rounded-full overflow-hidden'
}

const BlockieIdenticon = ({ address, diameter, alt, className }) => {
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
      {dataUrl && (
        <img
          className={className}
          src={dataUrl}
          height={diameter}
          width={diameter}
          alt={alt || ''}
        />
      )}
    </>
  )
}

BlockieIdenticon.defaultProps = {
  address: undefined,
  diameter: BLOCKIE_DIAMETER,
  alt: '',
  className: ''
}
