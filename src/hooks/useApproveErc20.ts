import { SendTransactionOptions } from '../interfaces'
import { useSendTransaction } from './useSendTransaction'
import ERC20 from '../abis/ERC20'
import { BigNumber, Contract } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { useSigner } from 'wagmi'

export const useApproveErc20 = (
  tokenAddress: string,
  spenderAddress: string,
  amountUnformatted: BigNumber = MaxUint256,
  options?: Partial<Omit<SendTransactionOptions, 'callTransaction'>>,
  t?: (key: string) => string,
  log?: (message: string) => void
) => {
  const sendTx = useSendTransaction(t, log)
  const { refetch } = useSigner()

  const callTransaction = async () => {
    const { data: signer } = await refetch()
    const erc20 = new Contract(tokenAddress, ERC20, signer)
    return erc20.approve(spenderAddress, amountUnformatted)
  }

  return () =>
    sendTx({
      ...options,
      name: options?.name || t?.('approve') || 'Approve',
      callTransaction
    })
}
