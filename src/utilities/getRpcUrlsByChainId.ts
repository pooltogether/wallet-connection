import { getRpcUrls } from './getRpcUrls'

/**
 * Returns multiple RPC URLS using configured API keys if possible.
 * @param chainIds
 * @returns
 */
export const getRpcUrlsByChainId = (
  chainIds: number[],
  rpcUrls?: { [chainId: number]: string | string[] }
): { [chainId: number]: string } =>
  chainIds.reduce((rpcUrlsByChainId, chainId) => {
    rpcUrlsByChainId[chainId] = getRpcUrls(chainId, rpcUrls[chainId])
    return rpcUrlsByChainId
  }, {})
