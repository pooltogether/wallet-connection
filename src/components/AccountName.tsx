import React from 'react'
import { useEnsLookup } from 'wagmi'

export const AccountName: React.FC<{
  address: string
}> = (props) => {
  const { address } = props
  const [{ data: ensName }] = useEnsLookup({ address })
  return <>{ensName || address.slice(0, 6) + '...'}</>
}
