import { useMemo } from 'react'
import { getReadProviders } from '../utilities/getReadProviders'

/**
 * Memoizes the Fallback providers to maintain state in the future
 * @param chainId
 * @param _rpcUrl
 * @returns
 */
export const useReadProviders = (
  chainIds: number[],
  _rpcUrls?: { [chainId: number]: string | string[] }
) => {
  return useMemo(() => getReadProviders(chainIds, _rpcUrls), [chainIds, _rpcUrls])
}
