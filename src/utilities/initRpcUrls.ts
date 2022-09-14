import { WC_RPC_URLS } from '../constants'

/**
 * Initializes a global store of RPC URLs to be used.
 * @param rpcUrls
 * @returns
 */
export const initRpcUrls = (rpcUrls: { [chainId: number]: string | string[] }) =>
  Object.keys(rpcUrls)
    .map(Number)
    .map((chainId) => (WC_RPC_URLS[chainId] = rpcUrls[chainId]))
