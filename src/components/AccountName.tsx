import React from 'react'
import { useEnsName } from '../hooks/useEnsName'

export const AccountName: React.FC<{
  address: string
}> = (props) => {
  const { address } = props
  const { data: ensName } = useEnsName(address)
  return <>{ensName || address?.slice(0, 6) + '...'}</>
}
