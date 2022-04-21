import { useMemo } from 'react'
import { getReadProvider } from '../utilities/getReadProvider'
import { ProviderApiKeys } from '../interfaces'

/**
 * Creates and memoizes a provider for the given chain id if available.
 * Attempts to use API keys for RPC providers first.
 * Falls back to mainnet if chain id provided is not supported.
 * @param chainId
 * @param apiKeys
 * @returns
 */
export const useReadProvider = (chainId: number, apiKeys?: ProviderApiKeys) =>
  useMemo(() => getReadProvider(chainId, apiKeys), [chainId])
