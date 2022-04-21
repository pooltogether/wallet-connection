import { useMemo } from 'react'
import { ProviderApiKeys } from '../interfaces'
import { getRpcUrl } from '../utilities/getRpcUrl'

/**
 * Creates and memoizes an RPC URL using configured API keys if possible.
 * Attempts to use API keys for RPC providers first.
 * Falls back to mainnet if chain id provided is not supported.
 * @param chainId
 * @param apiKeys
 * @returns
 */
export const useRpcUrl = (chainId: number, apiKeys?: ProviderApiKeys) =>
  useMemo(() => getRpcUrl(chainId, apiKeys), [chainId])
