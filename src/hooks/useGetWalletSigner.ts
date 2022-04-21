import { useSigner } from 'wagmi'

/**
 *
 * @returns an async fn to retrieve the connected wallets signer
 */
export const useGetWalletSigner = () => {
  const [, getSigner] = useSigner({ skip: true })
  return getSigner
}
