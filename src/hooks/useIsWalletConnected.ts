import { useAccount } from 'wagmi'

/**
 * Checks if a wallet is connected
 * @returns
 */
export const useIsWalletConnected = () => {
  const { address, status } = useAccount()
  return !!address && status === 'connected'
}
