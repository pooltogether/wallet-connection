import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { utils } from 'ethers'

/**
 * Checksums the address for easier checks throughout the app.
 * @returns the address of the connected wallet
 */
export const useUsersAddress = () => {
  const { address } = useAccount()
  return useMemo(() => {
    return !!address ? utils.getAddress(address) : null
  }, [address])
}
