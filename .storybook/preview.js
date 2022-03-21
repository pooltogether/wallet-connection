import { Provider as WagmiProvider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeContext, ThemeContextProvider } from '@pooltogether/react-components'
import React, { useContext, Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import { CHAIN_ID } from '../src/constants'
import { getRpcUrls } from '../src/utilities/getRpcUrls'
import { getRpcUrl } from '../src/utilities/getRpcUrl'
import { getChain } from '../src/utilities/getChain'
import { getReadProvider } from '../src/utilities/getReadProvider'

// Styles
import 'react-toastify/dist/ReactToastify.css'
import 'react-spring-bottom-sheet/dist/style.css'

const chains = [getChain(CHAIN_ID.mainnet), getChain(CHAIN_ID.polygon)]
const connectors = ({ chainId }) => {
  return [
    new InjectedConnector({ chains, options: {} }),
    new WalletConnectConnector({
      chains,
      options: {
        chainId: chainId || CHAIN_ID.mainnet,
        rpc: getRpcUrls(chains.map((chain) => chain.id)),
        bridge: 'https://pooltogether.bridge.walletconnect.org/',
        qrcode: true
      }
    }),
    new WalletLinkConnector({
      chains,
      options: {
        appName: 'PoolTogether',
        jsonRpcUrl: getRpcUrl(chainId || CHAIN_ID.mainnet)
      }
    })
  ]
}

export const parameters = {
  actions: { argTypesRegex: '^on.*' }
}

// loading component for suspence fallback
const Loader = () => {
  return (
    <div className='App'>
      <div>loading...</div>
    </div>
  )
}

export const decorators = [
  (Story) => (
    <WagmiProvider
      autoConnect
      connectorStorageKey='pooltogether-wallet'
      connectors={connectors}
      provider={({ chainId }) => getReadProvider(chainId)}
    >
      <JotaiProvider>
        <ThemeContextProvider>
          <ThemedToastContainer />
          <Suspense fallback={<Loader />}>
            <div className='flex flex-col w-screen h-screen justify-center items-center'>
              <Story />
            </div>
          </Suspense>
        </ThemeContextProvider>
      </JotaiProvider>
    </WagmiProvider>
  )
]

const ThemedToastContainer = () => {
  // This doesn't quite fit here, it needs to be nested below Jotai though.
  // useUpdateStoredPendingTransactions()

  const { theme } = useContext(ThemeContext)
  return (
    <ToastContainer
      limit={3}
      style={{ zIndex: '99999' }}
      position={'bottom-right'}
      autoClose={7000}
      theme={theme}
    />
  )
}
