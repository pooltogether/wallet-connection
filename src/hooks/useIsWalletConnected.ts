import { useConnect } from 'wagmi'

/**
 * Checks if a wallet is connected
 * @returns
 */
export const useIsWalletConnected = () => {
  const { activeConnector } = useConnect()
  return Boolean(activeConnector)
}
