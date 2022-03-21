import { useWalletChainId } from './useWalletChainId'

/**
 *
 * @param chainId chain id to match against the wallets chain id
 * @returns true if wallet chain id matches, false otherwise
 */
export const useIsWalletOnChainId = (chainId: number) => {
  const walletChainId = useWalletChainId()
  return chainId === walletChainId
}
