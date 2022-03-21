import { CHAIN_ID } from '../constants'

export const getChainColorByChainId = (chainId: number) => {
  switch (chainId) {
    case CHAIN_ID.mainnet:
      return '#68a7ff'
    case CHAIN_ID.goerli:
    case CHAIN_ID.kovan:
    case CHAIN_ID.rinkeby:
      return '#ff9303'
    case CHAIN_ID['bsc-testnet']:
    case CHAIN_ID.bsc:
      return '#d7a42f'
    case CHAIN_ID.polygon:
    case CHAIN_ID.mumbai:
      return '#946fdf'
    case CHAIN_ID.avalanche:
    case CHAIN_ID.fuji:
      return '#e61b1b'
    case CHAIN_ID.celo:
    case CHAIN_ID['celo-testnet']:
      return '#3ef3d4'
    default:
      return null
  }
}
