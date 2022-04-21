import { useConnect } from 'wagmi'

/**
 * Checks if a wallet is connected
 * @returns
 */
export const useIsWalletConnected = () => {
  const [{ data: connectionData }] = useConnect()
  return !!connectionData?.connected
}
