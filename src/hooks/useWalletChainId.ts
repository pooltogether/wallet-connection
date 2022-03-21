import { useNetwork } from 'wagmi'

/**
 *
 * @returns the chain id the connected wallet is on
 */
export const useWalletChainId = () => {
  const [{ data }] = useNetwork()
  return data?.chain?.id
}
