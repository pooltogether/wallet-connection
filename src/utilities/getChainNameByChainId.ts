import { getChain } from './getChain'

/**
 *
 * @param chainId chain id that maps to a network alias
 * @returns the name of the chain requested or Unknown if not known
 */
export const getChainNameByChainId = (chainId: number): string | undefined => {
  const chain = getChain(chainId)

  if (!chain) {
    return 'Unknown'
  }

  return chain.name
}
