import { useMemo } from 'react'
import { getRpcUrls } from '../utilities/getRpcUrls'
import { ProviderApiKeys } from '../interfaces'

/**
 * Creates and memoizes several RPC URLS using configured API keys if possible.
 * Attempts to use API keys for RPC providers first.
 * Falls back to mainnet if chain id provided is not supported.
 * @param chainIds
 * @param apiKeys
 * @returns
 */
export const useRpcUrls = (chainIds: number[], apiKeys?: ProviderApiKeys) =>
  useMemo(() => getRpcUrls(chainIds, apiKeys), [chainIds])
