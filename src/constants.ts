import { allChains, Chain } from 'wagmi'
import { ProviderApiKeys } from './interfaces'

/**
 * Global API keys, initialized through initProviderApiKeys
 */
export const RPC_API_KEYS: ProviderApiKeys = {
  alchemy: undefined,
  etherscan: undefined,
  infura: undefined
}

/**
 * Constant for chain ids
 */
export const CHAIN_ID = Object.freeze({
  'mainnet': 1,
  'homestead': 1,
  'ropsten': 3,
  'rinkeby': 4,
  'goerli': 5,
  'kovan': 42,
  'bsc': 56,
  'poa-sokol': 77,
  'bsc-testnet': 97,
  'poa': 99,
  'xdai': 100,
  'polygon': 137,
  'matic': 137,
  'optimism': 420,
  'avalanche': 43114,
  'fuji': 43113,
  'celo': 42220,
  'celo-testnet': 44787,
  'mumbai': 80001
})

/**
 * Chains supported by Alchemy
 */
export const ALCHEMY_CHAIN_IDS = Object.freeze([
  // Ethereum
  1, 3, 4, 5, 42,
  // Polygon
  137, 80001,
  // Optimism
  10, 69,
  // Arbitrum
  42161, 421611
])

/**
 * Chains supported by Etherscan
 */
export const ETHERSCAN_CHAIN_IDS = Object.freeze([
  // Ethereum
  1, 3, 4, 5, 42
])

/**
 * Chains supported by Infura
 */
export const INFURA_CHAIN_IDS = Object.freeze([
  // Ethereum
  1, 3, 4, 5, 42,
  // Polygon
  137, 80001,
  // Optimism
  10, 69,
  // Arbitrum
  42161, 421611
])

/**
 * Custom Wagmi Chains that aren't provided by WAGMI that PoolTogether uses
 */
const CUSTOM_CHAINS: Chain[] = [
  {
    id: 44787,
    name: 'Celo Alfajores Testnet',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: [
      'https://alfajores-forno.celo-testnet.org',
      'wss://alfajores-forno.celo-testnet.org/ws'
    ],
    blockExplorers: [{ name: 'BlockScout', url: 'https://alfajores-blockscout.celo-testnet.org/' }],
    testnet: true
  },
  {
    id: 42220,
    name: 'Celo',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: ['https://forno.celo.org'],
    blockExplorers: [{ name: 'Celo Explorer', url: 'https://explorer.celo.org/' }],
    testnet: false
  },
  {
    id: 56,
    name: 'Binance Smart Chain',
    nativeCurrency: {
      decimals: 18,
      name: 'Binance Chain Native Token',
      symbol: 'BNB'
    },
    rpcUrls: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/'
    ],
    blockExplorers: [{ name: 'Bscscan', url: 'https://bscscan.com' }]
  }
]

/**
 *
 */
const CHAIN_NAME_OVERRIDE: {
  [chainId: number]: string
} = Object.freeze({
  [CHAIN_ID.mainnet]: 'Ethereum',
  [CHAIN_ID.avalanche]: 'Avalanche',
  [CHAIN_ID.fuji]: 'Fuji',
  [CHAIN_ID.polygon]: 'Polygon',
  [CHAIN_ID.bsc]: 'Binance Smart Chain',
  [CHAIN_ID.celo]: 'Celo',
  [CHAIN_ID.xdai]: 'xDai'
})

/**
 *
 */
const CHAIN_RPC_OVERRIDES: {
  [chainId: number]: string[]
} = Object.freeze({})

/**
 * Overwrites the name of the chain with PoolTogethers preferred name.
 * @param chain
 */
const editChainName = (chain: Chain) => {
  const override = CHAIN_NAME_OVERRIDE[chain.id]
  if (override) chain.name = override
  return chain
}

/**
 * Pushes the preferred RPC URLS for the chain with PoolTogethers preferred RPC URL to the front.
 * @param chain
 */
const editRpcUrl = (chain: Chain) => {
  const overrides = CHAIN_RPC_OVERRIDES[chain.id]
  if (overrides) chain.rpcUrls = [...overrides, ...chain.rpcUrls]
  return chain
}

/**
 *
 */
export const ALL_CHAINS: Chain[] = [...allChains, ...CUSTOM_CHAINS]
  .map(editChainName)
  .map(editRpcUrl)

/**
 * A transaction is pending until it has either been cancelled, errored or succeeded.
 */
export enum TransactionState {
  pending = 'pending',
  complete = 'complete'
}

/**
 * A transaction progresses through these states linearly.
 * 1. pendingUserConfirmation
 * 2. pendingBlockchainConfirmation or cancelled
 * 3. success or error
 */
export enum TransactionStatus {
  pendingUserConfirmation = 'userConfirming',
  pendingBlockchainConfirmation = 'chainConfirming',
  cancelled = 'cancelled',
  success = 'success',
  error = 'error'
}
