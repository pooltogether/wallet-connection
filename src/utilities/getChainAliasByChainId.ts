import { CHAIN_ID } from '../constants'

/**
 *
 * @param chainId chain id that maps to a network alias
 * @returns the network alias that maps to a provided chain id if known
 */
export const getChainAliasByChainId = (chainId: number): string | undefined => {
  const networkKeys = Object.keys(CHAIN_ID)
  return networkKeys.find((networkKey) => CHAIN_ID[networkKey] === chainId)
}
