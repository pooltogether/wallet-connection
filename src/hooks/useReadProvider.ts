import { useMemo } from 'react'
import { getReadProvider } from '../utilities/getReadProvider'

/**
 * Memoizes the Fallback provider to maintain state in the future
 * @param chainId
 * @param _rpcUrl
 * @returns
 */
export const useReadProvider = (chainId: number, _rpcUrl?: string | string[]) => {
  return useMemo(() => getReadProvider(chainId, _rpcUrl), [chainId, _rpcUrl])
}
