import { ALL_CHAINS } from '../constants'
import { Chain } from 'wagmi'

/**
 * Builds objects with PoolTogether preferred names and RPC urls.
 * @param chainId
 * @returns a WAGMI Chain data type
 */
export const getChain = (chainId: number): Chain => ALL_CHAINS.find((chain) => chain.id === chainId)
