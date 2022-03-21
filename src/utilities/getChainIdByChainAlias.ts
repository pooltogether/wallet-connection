import { CHAIN_ID } from '../constants'

/**
 * @param networkAlias alias that maps to a chain id
 * @returns a chain id
 */
export const getChainIdByAlias = (networkAlias: string): number | undefined => {
  return CHAIN_ID?.[networkAlias]
}
