import { NETWORK } from '@pooltogether/utilities'
import { useQuery } from 'react-query'
import { BaseProvider } from '@ethersproject/providers'

import { getReadProvider } from '../utilities/getReadProvider'
import { RPC_API_KEYS } from '../constants'
import { useEnsName } from './useEnsName'

/**
 * Fetches an ENS avatar for the provided address
 * @param address address to get ENS name for
 * @param chainId defaults to mainnet
 * @returns
 */
export const useEnsAvatar = (address: string, chainId: number = NETWORK.mainnet) => {
  const { data: ensName } = useEnsName(address, chainId)
  return useQuery(['useEnsAvatar', ensName, chainId], () => getEnsAvatar(ensName, chainId), {
    enabled: Boolean(ensName),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })
}

const getEnsAvatar = async (name: string, chainId: number) => {
  try {
    const provider = getReadProvider(chainId, RPC_API_KEYS) as BaseProvider
    const resolvedEnsAvatar = await provider.getAvatar(name)
    return resolvedEnsAvatar
  } catch (e) {
    console.log(e)
    return undefined
  }
}
