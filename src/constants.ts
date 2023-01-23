import { Chain } from 'wagmi'
import {
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  crossbell,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinHyperspace,
  foundry,
  gnosis,
  gnosisChiado,
  goerli,
  hardhat,
  iotex,
  iotexTestnet,
  localhost,
  mainnet,
  metis,
  metisGoerli,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  sepolia,
  taraxa,
  taraxaTestnet,
  zkSync,
  zkSyncTestnet
} from '@wagmi/chains'

export const WC_RPC_URLS: { [chainId: number]: string | string[] } = {}

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
  'mumbai': 80001,
  'optimism': 10,
  'optimism-goerli': 420,
  'avalanche': 43114,
  'fuji': 43113,
  'celo': 42220,
  'celo-testnet': 44787,
  'arbitrum': 42161,
  'arbitrum-goerli': 421613
})

/**
 * Chains supported by Infura
 */
export const INFURA_CHAIN_IDS = Object.freeze([
  // Ethereum
  1,
  3,
  4,
  5,
  42,
  // Polygon
  137,
  80001,
  // Avalanche
  // 43114,
  // Optimism
  10,
  420,
  // Arbitrum
  42161,
  421613
])

/**
 * Custom Wagmi Chains that aren't provided by WAGMI that PoolTogether uses
 */
const CUSTOM_CHAINS: Chain[] = [
  {
    id: 44787,
    name: 'Celo Alfajores Testnet',
    network: 'Alfajores',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: {
      celohttps: { http: ['https://alfajores-forno.celo-testnet.org'] },
      default: { http: ['https://alfajores-forno.celo-testnet.org'] },
      public: { http: ['https://alfajores-forno.celo-testnet.org'] },
      celowss: { http: ['wss://alfajores-forno.celo-testnet.org/ws'] }
    },
    blockExplorers: {
      default: { name: 'BlockScout', url: 'https://alfajores-blockscout.celo-testnet.org/' }
    },
    testnet: true
  },
  {
    id: 42220,
    name: 'Celo',
    network: 'Celo',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: {
      forno: { http: ['https://forno.celo.org'] },
      default: { http: ['https://forno.celo.org'] },
      public: { http: ['https://forno.celo.org'] }
    },
    blockExplorers: { default: { name: 'Celo Explorer', url: 'https://explorer.celo.org/' } },
    testnet: false
  },
  {
    id: 56,
    name: 'Binance Smart Chain',
    network: 'BSC',
    nativeCurrency: {
      decimals: 18,
      name: 'Binance Chain Native Token',
      symbol: 'BNB'
    },
    rpcUrls: {
      default: { http: ['https://bsc-dataseed.binance.org/'] },
      public: { http: ['https://bsc-dataseed.binance.org/'] },
      bsc1: { http: ['https://bsc-dataseed.binance.org/'] },
      bsc2: { http: ['https://bsc-dataseed1.defibit.io/'] },
      bsc3: { http: ['https://bsc-dataseed1.ninicoin.io/'] }
    },
    blockExplorers: { default: { name: 'Bscscan', url: 'https://bscscan.com' } }
  },
  {
    id: 43114,
    name: 'Avalanche Mainnet',
    network: 'Avalanche',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: {
      default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
      public: { http: ['https://api.avax.network/ext/bc/C/rpc'] }
    },
    blockExplorers: { default: { name: 'SnowTrace', url: 'https://snowtrace.io' } },
    testnet: false
  },
  {
    id: 43113,
    name: 'Avalanche Fuji Testnet',
    network: 'Fuji',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: {
      default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
      public: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] }
    },
    blockExplorers: {
      default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' }
    },
    testnet: true
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
 * In case we want to inject a public RPC URL for a chain into wagmi Chain objects, we can do that here.
 */
const CHAIN_RPC_OVERRIDES: {
  [chainId: number]: { [key: string]: string }
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
  //@ts-ignore
  if (overrides) chain.rpcUrls = { ...overrides, ...chain.rpcUrls }
  return chain
}

/**
 * Returns a list of all chains from wagmi augmented with PT preferred names and RPC URLs.
 */
export const ALL_CHAINS: Chain[] = [
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  crossbell,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinHyperspace,
  foundry,
  gnosis,
  gnosisChiado,
  goerli,
  hardhat,
  iotex,
  iotexTestnet,
  localhost,
  mainnet,
  metis,
  metisGoerli,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  sepolia,
  taraxa,
  taraxaTestnet,
  zkSync,
  zkSyncTestnet,
  ...CUSTOM_CHAINS
]
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
