import { BaseProvider, InfuraProvider, JsonRpcProvider } from '@ethersproject/providers'
import { CHAIN_ID, INFURA_CHAIN_IDS } from '../constants'
import { ProviderApiKeys } from '../interfaces'
import { getRpcUrl } from './getRpcUrl'
import { getChain } from './getChain'

/**
 * Creates a provider for the given chain id if available.
 * Attempts to use API keys for RPC providers first.
 * Falls back to mainnet if chain id provided is not supported.
 * @param chainId
 * @param apiKeys
 * @returns
 */
export const getReadProvider = (chainId: number, apiKeys?: ProviderApiKeys): BaseProvider => {
  const infuraApiKey = apiKeys?.infura

  try {
    if (!!infuraApiKey && INFURA_CHAIN_IDS.includes(chainId)) {
      // if (chainId === CHAIN_ID.avalanche) {
      //   return new JsonRpcProvider(`https://avalanche-mainnet.infura.io/v3/${infuraApiKey}`)
      // }
      return new InfuraProvider(chainId, infuraApiKey)
    }

    // if (!!PT_RPC_PROXY[chainId]) {
    //   return new JsonRpcProvider(PT_RPC_PROXY[chainId], chainId)
    // }

    const chainData = getChain(chainId)
    if (!!chainData) {
      const rpcUrl = getRpcUrl(chainId, apiKeys)
      return new JsonRpcProvider(rpcUrl, chainId)
    } else {
      console.warn(`getReadProvider | Chain id ${chainId} not supported.`)
      const rpcUrl = getRpcUrl(CHAIN_ID.mainnet, apiKeys)
      return new JsonRpcProvider(rpcUrl, chainId)
    }
  } catch (e) {
    console.error(e)
    console.warn(`getReadProvider | Chain id ${chainId} not supported.`)
    const rpcUrl = getRpcUrl(CHAIN_ID.mainnet, apiKeys)
    return new JsonRpcProvider(rpcUrl, chainId)
  }
}
