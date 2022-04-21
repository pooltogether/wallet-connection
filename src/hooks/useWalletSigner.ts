import { useSigner } from 'wagmi'

/**
 * NOTE: Signer may be undefined on mount
 * @returns the signer for the connected wallet
 */
export const useWalletSigner = () => {
  const [{ data }] = useSigner()
  return data
}
