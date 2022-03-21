import { useSigner } from 'wagmi'

/**
 *
 * @returns the signer for the connected wallet
 */
export const useWalletSigner = () => {
  const [{ data }] = useSigner()
  return data
}
