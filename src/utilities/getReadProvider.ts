import {
  BaseProvider,
  AlchemyProvider,
  InfuraProvider,
  EtherscanProvider,
  JsonRpcProvider
} from '@ethersproject/providers'
import { ALCHEMY_CHAIN_IDS, CHAIN_ID, ETHERSCAN_CHAIN_IDS, INFURA_CHAIN_IDS } from '../constants'
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
  const alchemyApiKey = apiKeys?.alchemy
  const infuraApiKey = apiKeys?.infura
  const etherscanApiKey = apiKeys?.etherscan

  try {
    if (!!alchemyApiKey && ALCHEMY_CHAIN_IDS.includes(chainId)) {
      return new AlchemyProvider(chainId, alchemyApiKey)
    } else if (!!infuraApiKey && INFURA_CHAIN_IDS.includes(chainId)) {
      return new InfuraProvider(chainId, infuraApiKey)
    } else if (!!etherscanApiKey && ETHERSCAN_CHAIN_IDS.includes(chainId)) {
      return new EtherscanProvider(chainId, etherscanApiKey)
    }

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
