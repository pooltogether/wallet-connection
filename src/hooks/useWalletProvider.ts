import { useProvider } from 'wagmi'

/**
 *
 * @returns the provider for connected wallet
 */
export const useWalletProvider = () => {
  return useProvider()
}
