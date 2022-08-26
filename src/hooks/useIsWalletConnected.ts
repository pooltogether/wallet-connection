import { useAccount } from 'wagmi'

/**
 * Checks if a wallet is connected
 * @returns
 */
export const useIsWalletConnected = () => {
  const { connector } = useAccount()
  return Boolean(connector)
}
