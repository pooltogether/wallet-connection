import { InfuraProvider } from '@ethersproject/providers'
import { getNetwork } from '@ethersproject/networks'
import { CHAIN_ID, INFURA_CHAIN_IDS } from '../constants'
import { ProviderApiKeys } from '../interfaces'
import { getChain } from './getChain'

export const PT_RPC_PROXY = Object.freeze({
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
 * Creates an RPC URL using configured API keys if possible.
 * Attempts to use API keys for RPC providers first.
 * Falls back to mainnet if chain id provided is not supported.
 * @param chainId
 * @param apiKeys
 */
export const getRpcUrl = (chainId: number, apiKeys?: ProviderApiKeys): string => {
  const infuraApiKey = apiKeys?.infura

  try {
    if (!!infuraApiKey && INFURA_CHAIN_IDS.includes(chainId)) {
      const connectionInfo = InfuraProvider.getUrl(
        getNetwork(chainId),
        typeof infuraApiKey === 'string' ? { projectId: infuraApiKey } : infuraApiKey
      )
      return connectionInfo.url
    }

    if (!!PT_RPC_PROXY[chainId]) return PT_RPC_PROXY[chainId]

    const chainData = getChain(chainId)
    const rpcUrl = !!chainData?.rpcUrls ? Object.values(chainData.rpcUrls)[0] : null

    if (!!rpcUrl) {
      return rpcUrl
    } else {
      console.warn(`getRpcUrl | Chain id ${chainId} not supported.`)
      const chainData = getChain(CHAIN_ID.mainnet)
      return Object.values(chainData.rpcUrls)[0]
    }
  } catch (e) {
    console.error(e)
    console.warn(`getRpcUrl | Chain id ${chainId} not supported.`)
    const chainData = getChain(CHAIN_ID.mainnet)
    return Object.values(chainData.rpcUrls)[0]
  }
}
