import { getChain } from './getChain'

export const getBlockExplorerUrl = (chainId: number) => {
  const chain = getChain(chainId)
  return chain.blockExplorers?.default
}
