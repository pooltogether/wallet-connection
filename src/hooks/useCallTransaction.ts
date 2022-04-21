import { CallOverrides } from 'ethers'
import { useContractWrite } from 'wagmi'

/**
 * Creates an ethers contract and preps a function to call the provided method
 * @param addressOrName
 * @param contractInterface
 * @param method
 * @returns
 */
export const useCallTransaction = (
  method: string,
  addressOrName: string,
  contractInterface: object[]
) => {
  const [, callTransaction] = useContractWrite(
    {
      addressOrName,
      contractInterface
    },
    method
  )
  return async (config?: { args?: any; overrides?: CallOverrides }) => {
    const response = await callTransaction(config)
    return response.data
  }
}
