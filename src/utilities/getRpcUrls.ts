import { CHAIN_ID, WC_RPC_URLS } from '../constants'
import { getChain } from './getChain'

export const PROXY_RPC_URL = Object.freeze({
  [CHAIN_ID.mainnet]: 'https://ethereum-mainnet-web3-provider-proxy.pooltogether-api.workers.dev/',
  [CHAIN_ID.goerli]: 'https://goerli-web3-provider-proxy.pooltogether-api.workers.dev/',
  [CHAIN_ID.optimism]: 'https://optimism-mainnet-web3-provider-proxy.pooltogether-api.workers.dev/',
  [CHAIN_ID['optimism-goerli']]:
    'https://optimism-goerli-web3-provider-proxy.pooltogether-api.workers.dev/',
  [CHAIN_ID.arbitrum]: 'https://arbitrum-web3-provider-proxy.pooltogether-api.workers.dev/',
  [CHAIN_ID['arbitrum-goerli']]:
    'https://arbitrum-goerli-web3-provider-proxy.pooltogether-api.workers.dev/',
  [CHAIN_ID.polygon]: 'https://polygon-mainnet-web3-provider-proxy.pooltogether-api.workers.dev/',
  [CHAIN_ID.mumbai]: 'https://polygon-mumbai-web3-provider-proxy.pooltogether-api.workers.dev/',
  [CHAIN_ID.fuji]: 'https://avalanche-fuji-web3-provider-proxy.pooltogether-api.workers.dev/',
  [CHAIN_ID.avalanche]:
    'https://avalanche-mainnet-web3-provider-proxy.pooltogether-api.workers.dev/'
})

/**
 * Builds a list of RPC URLs for the given chainId.
 * @param chainId
 * @param rpcUrl will be first in the list of RPC URLs
 */
export const getRpcUrls = (chainId: number, rpcUrl?: string | string[]): string[] => {
  const rpcUrls: string[] = []

  // Passthrough for overriding
  if (!!rpcUrl) {
    if (typeof rpcUrl === 'string') {
      rpcUrls.push(rpcUrl)
    } else {
      rpcUrls.push(...rpcUrl)
    }
  }

  // Add initialized RPC URLs
  const storedRpcUrl = WC_RPC_URLS[chainId]
  if (storedRpcUrl) {
    if (typeof storedRpcUrl === 'string') {
      rpcUrls.push(storedRpcUrl)
    } else {
      rpcUrls.push(...storedRpcUrl)
    }
  }

  // // PT Proxied RPC URLs
  // if (!!PROXY_RPC_URL[chainId]) rpcUrls.push(PROXY_RPC_URL[chainId])

  // wagmi public RPC URLs
  const publicRpcUrl = getChain(chainId)?.rpcUrls?.default
  if (!!publicRpcUrl) rpcUrls.push(publicRpcUrl.http[0])

  return rpcUrls
}
