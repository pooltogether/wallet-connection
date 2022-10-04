import { getReadProvider } from './getReadProvider'
import { BaseProvider } from '@ethersproject/providers'

/**
 * Creates a new JSON RPC provider for the given chainIds.
 * Optionally, can be passed RPC URLs to use instead of the public ones.
 * @param chainIds
 * @param rpcUrls
 * @returns
 */
export const getReadProviders = (
  chainIds: number[],
  rpcUrls?: { [chainId: number]: string | string[] }
): { [chainId: number]: BaseProvider } =>
  chainIds.reduce((readProviders, chainId) => {
    readProviders[chainId] = getReadProvider(chainId, rpcUrls?.[chainId])
    return readProviders
  }, {})
