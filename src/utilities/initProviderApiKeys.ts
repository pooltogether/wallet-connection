import { RPC_API_KEYS } from '../constants'
import { ProviderApiKeys } from '../interfaces'

/**
 * Initializes the store of API keys for different providers.
 * @param apiKeys
 */
export const initProviderApiKeys = (apiKeys: ProviderApiKeys) => {
  RPC_API_KEYS.alchemy = apiKeys.alchemy
  RPC_API_KEYS.etherscan = apiKeys.etherscan
  RPC_API_KEYS.infura = apiKeys.infura
}
