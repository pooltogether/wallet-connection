import { NETWORK } from '@pooltogether/utilities'
import { useQuery } from 'react-query'

import { RPC_API_KEYS } from '../constants'
import { getReadProvider } from '../utilities/getReadProvider'

/**
 * Fetches an ENS name for the provided address
 * @param address address to get ENS name for
 * @param chainId defaults to mainnet
 * @returns
 */
export const useEnsName = (address: string, chainId: number = NETWORK.mainnet) => {
  return useQuery(['useEnsName', address, chainId], () => getEnsName(address, chainId), {
    enabled: Boolean(address),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })
}

const getEnsName = async (address: string, chainId: number) => {
  try {
    const provider = getReadProvider(chainId, RPC_API_KEYS)
    const resolvedEnsName = await provider.lookupAddress(address)
    return resolvedEnsName
  } catch (e) {
    console.log(e)
    return undefined
  }
}
