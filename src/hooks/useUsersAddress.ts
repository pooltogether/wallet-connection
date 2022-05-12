import { getAddress } from 'ethers/lib/utils'
import { useAccount } from 'wagmi'

/**
 * Checksums the address for easier checks throughout the app.
 * @returns the address of the connected wallet
 */
export const useUsersAddress = () => {
  const { data } = useAccount()
  return !!data ? getAddress(data.address) : null
}
