import { getAddress } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

/**
 * Checksums the address for easier checks throughout the app.
 * @returns the address of the connected wallet
 */
export const useUsersAddress = () => {
  const account = useAccount()
  return useMemo(() => {
    return !!account && account.isConnected ? getAddress(account.address) : null
  }, [account.address])
}
