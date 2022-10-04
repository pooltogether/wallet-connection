import { getAddress } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

/**
 * Checksums the address for easier checks throughout the app.
 * @returns the address of the connected wallet
 */
export const useUsersAddress = () => {
  const { address } = useAccount()
  return useMemo(() => {
    return !!address ? getAddress(address) : null
  }, [address])
}
