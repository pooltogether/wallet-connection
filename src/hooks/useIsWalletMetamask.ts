import { useConnect } from 'wagmi'

export const useIsWalletMetamask = () => {
  const { data } = useConnect()
  return data?.connector.name === 'MetaMask'
}
