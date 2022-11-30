import { SendTransactionOptions } from '../interfaces'
import { useSendTransaction } from './useSendTransaction'
import ERC20 from '../abis/ERC20'
import { BigNumber, Contract, Overrides } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { useSigner } from 'wagmi'

export const useApproveErc20 = (
  tokenAddress: string,
  spenderAddress: string,
  options: Partial<Omit<SendTransactionOptions, 'callTransaction'>> = {},
  amountUnformatted: BigNumber = MaxUint256,
  t?: (key: string) => string,
  log?: (message: string) => void
) => {
  const sendTx = useSendTransaction(t, log)
  const { refetch } = useSigner()

  const callTransaction = async () => {
    const { data: signer } = await refetch()
    const erc20 = new Contract(tokenAddress, ERC20, signer)
    const gasEstimate = await erc20.estimateGas.approve(spenderAddress, amountUnformatted)
    const overrides: Overrides = !!gasEstimate ? { gasLimit: gasEstimate.mul(12).div(10) } : undefined
    return erc20.approve(spenderAddress, amountUnformatted, overrides)
  }

  return () =>
    sendTx({
      ...options,
      name: options?.name || t?.('approve') || 'Approve',
      callTransaction
    })
}
