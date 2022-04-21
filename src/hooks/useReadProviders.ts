import { useMemo } from 'react'
import { getReadProviders } from '../utilities/getReadProviders'
import { ProviderApiKeys } from '../interfaces'

/**
 * Creates and memoizes several providers for the given chain ids if available.
 * Attempts to use API keys for RPC providers first.
 * Falls back to mainnet if chain id provided is not supported.
 * @param chainIds
 * @param apiKeys
 * @returns
 */
export const useReadProviders = (chainIds: number[], apiKeys?: ProviderApiKeys) =>
  useMemo(() => getReadProviders(chainIds, apiKeys), [chainIds])
