import { AlchemyProvider, InfuraProvider } from '@ethersproject/providers'
import { getNetwork } from '@ethersproject/networks'
import { ALCHEMY_CHAIN_IDS, CHAIN_ID, INFURA_CHAIN_IDS } from '../constants'
import { ProviderApiKeys } from '../interfaces'
import { getChain } from './getChain'

/**
 * Creates an RPC URL using configured API keys if possible.
 * Attempts to use API keys for RPC providers first.
 * Falls back to mainnet if chain id provided is not supported.
 * @param chainId
 * @param apiKeys
 */
export const getRpcUrl = (chainId: number, apiKeys?: ProviderApiKeys): string => {
  const alchemyApiKey = apiKeys?.alchemy
  const infuraApiKey = apiKeys?.infura

  try {
    if (!!alchemyApiKey && ALCHEMY_CHAIN_IDS.includes(chainId)) {
      const connectionInfo = AlchemyProvider.getUrl(getNetwork(chainId), alchemyApiKey)
      return connectionInfo.url
    } else if (!!infuraApiKey && INFURA_CHAIN_IDS.includes(chainId)) {
      const connectionInfo = InfuraProvider.getUrl(
        getNetwork(chainId),
        typeof infuraApiKey === 'string' ? { projectId: infuraApiKey } : infuraApiKey
      )
      return connectionInfo.url
    }

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
