import { ProviderApiKeys } from '../interfaces'
import { getRpcUrl } from './getRpcUrl'

/**
 * Returns multiple RPC URLS using configured API keys if possible.
 * @param chainIds
 * @returns
 */
export const getRpcUrls = (
  chainIds: number[],
  apiKeys?: ProviderApiKeys
): { [chainId: number]: string } =>
  chainIds.reduce((rpcUrls, chainId) => {
    rpcUrls[chainId] = getRpcUrl(chainId, apiKeys)
    return rpcUrls
  }, {})
