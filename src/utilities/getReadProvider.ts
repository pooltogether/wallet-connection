import { BaseProvider, JsonRpcProvider } from '@ethersproject/providers'
import { getRpcUrls } from './getRpcUrls'

/**
 * Creates a new Fallback RPC provider for the given chainId.
 * Optionally, can be passed an RPC URL to use instead of the public one.
 * @param chainId
 * @param _rpcUrl
 * @returns
 */
export const getReadProvider = (chainId: number, _rpcUrl?: string | string[]): BaseProvider => {
  const rpcUrls = getRpcUrls(chainId, _rpcUrl)
  if (!rpcUrls || rpcUrls.length === 0) throw new Error(`No RPC URL found for chainId: ${chainId}`)
  return new JsonRpcProvider(rpcUrls[0], chainId)
  // TODO: Add fallback provider for other RPC URLs
  // return new FallbackProvider(
  //   rpcUrls.map((rpcUrl, index) => ({
  //     provider: new JsonRpcProvider(rpcUrl, chainId),
  //     priority: index < 3 ? index + 1 : 3,
  //     weight: index < 2 ? 5 : 1,
  //     stallTimeout: 2000
  //   }))
  // )
}
