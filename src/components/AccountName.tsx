import React from 'react'
import { useEnsName } from 'wagmi'
import { CHAIN_ID } from '..'

export const AccountName: React.FC<{
  address: string
  chainId?: number
}> = (props) => {
  const { address, chainId } = props
  const { data: ensName } = useEnsName({ address, chainId })
  return <>{ensName || address?.slice(0, 6) + '...'}</>
}

AccountName.defaultProps = {
  chainId: CHAIN_ID.mainnet
}
