import { getReadProvider } from './getReadProvider'
import { BaseProvider } from '@ethersproject/providers'
import { ProviderApiKeys } from '../interfaces'

/**
 * Creates several providers for the given chain ids if available.
 * Attempts to use any initialized api keys for RPC providers first.
 * @param chainIds
 * @returns an object of providers keyed by chain id
 */
export const getReadProviders = (
  chainIds: number[],
  apiKeys?: ProviderApiKeys
): { [chainId: number]: BaseProvider } =>
  chainIds.reduce((readProviders, chainId) => {
    readProviders[chainId] = getReadProvider(chainId, apiKeys)
    return readProviders
  }, {})
