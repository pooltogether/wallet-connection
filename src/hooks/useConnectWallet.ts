import { useUpdateAtom } from 'jotai/utils'
import { isWalletConnectionModalOpenAtom } from '../atoms'

/**
 * Sets the boolean controlling the WalletConnectionModal to true.
 * useConnectWallet Relies on having the WalletConnectionModal mounted elsewhere in the app.
 * @returns
 */
export const useConnectWallet = () => {
  const setIsWalletConnectionModalOpen = useUpdateAtom(isWalletConnectionModalOpenAtom)
  return () => setIsWalletConnectionModalOpen(true)
}
