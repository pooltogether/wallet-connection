# PoolTogether Wallet Connection

PoolTogether wallet connection logic wrapping [WAGMI](wagmi.sh), React UI elements for connecting to a users wallet and utility hooks for sending and managing transactions.

## 💾 &nbsp; Installation

```bash
yarn add @pooltogether/wallet-connection
```

## 💾 &nbsp; Installation

```bash
yarn add @pooltogether/wallet-connection
```

## 🏎️ &nbsp; Quickstart

`@pooltogether/wallet-connection` relies on [PoolTogether components](https://www.npmjs.com/package/@pooltogether/react-components), [WAGMI](wagmi.sh), [Ethers](https://docs.ethers.io/v5/), [react-toastify](https://www.npmjs.com/package/react-toastify) and [Jotai](https://jotai.org/).

This means you **must** do some setup in your app. Place the following at the highest point inside your react app as possible:

>  `@pooltogether/wallet-connection` assumes 1 instance `FullWalletConnectionButton`. This component contains the modal for wallet connection and account modal. For all other "Connect wallet" buttons use the function returned by `useConnectWallet`.

```ts
import { Provider as WagmiProvider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeContext, ThemeContextProvider } from '@pooltogether/react-components'
import { ToastContainer } from 'react-toastify'

import { initProviderApiKeys, FullWalletConnectionButton } from '@pooltogether/wallet-connection'

// Initialize provider API keys for the best experience
initProviderApiKeys(providerApiKeys)

// Styles
import 'react-toastify/dist/ReactToastify.css'
import 'react-spring-bottom-sheet/dist/style.css'

// chains are Chains from WAGMI that your app supports
const chains = [getChain(CHAIN_ID.mainnet), getChain(CHAIN_ID.polygon)]

// connectors are Connectors from WAGMI that you want your app to connect to
const connectors = ({ chainId }) => {
  return [
    new InjectedConnector({ chains, options: {} }),
    new WalletConnectConnector({
      chains,
      options: {
        chainId: chainId || CHAIN_ID.mainnet,
        rpc: getRpcUrls(chains.map((chain) => chain.id), providerApiKeys),
        bridge: 'https://pooltogether.bridge.walletconnect.org/',
        qrcode: true
      }
    }),
    new WalletLinkConnector({
      chains,
      options: {
        appName: 'PoolTogether',
        jsonRpcUrl: getRpcUrl(chainId || CHAIN_ID.mainnet, providerApiKeys)
      }
    })
  ]
}

const PoolTogetherWalletProviders = (props) => (
  <WagmiProvider
    autoConnect
    connectorStorageKey='pooltogether-wallet'
    connectors={connectors}
    provider={({ chainId }) =>
      chainId ? getReadProvider(chainId, providerApiKeys) : getReadProvider(CHAIN_ID.mainnet, providerApiKeys)
    }
  >
    <JotaiProvider>
      <ThemeContextProvider>
        <ThemedToastContainer />
        <FullWalletConnectionButton chains={chains} TosDisclaimer='I agree to TOS' />
        {props.children}
      </ThemeContextProvider>
    </JotaiProvider>
  </WagmiProvider>
)


const ThemedToastContainer = () => {
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
```

React Components
`FullWalletConnectionButton` can be rendered anywhere in your app to allow users to connect their wallet to your app.
`NetworkSelectionButton` can be rendered anywhere in your app to allow users to connect their wallet to a specific network.

Transactions
`useSendTransaction` can be used to send a transaction to the blockchain using the users connected wallet. Additionally it stores transaction data in local storage and provides simple hooks for reacting to different events throughout the transactions lifecycle.
`useTransaction` can be used to read a transaction from local state.
`useUsersTransactions`
`useUsersPendingTransactions`
`useUpdateStoredPendingTransactions`

Wallet
`useUsersAddress`
`useWalletChainId`
`useIsWalletOnChainId`

Utilities
`getChain`
`getChainAliasByChainId`
`getChainIdByChainAlias`
`getChainNameByChainId`
`getReadProvider`
`getReadProviders`
`getRpcUrl`
`getRpcUrls`

Constants
`CHAIN_ID`
`ALL_CHAINS`
`TransactionState`
`TransactionStatus`

Types
`ProviderApiKeys`
`Transaction`
`TransactionCallbacks`


## 💻 &nbsp; Developer Experience

### Commands

```bash
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run either Storybook or the example playground:

### Storybook

Run inside another terminal:

```bash
yarn storybook
```

This loads the stories from `./stories`.

> NOTE: Stories should reference the components as if using the library, similar to the example playground. This means importing from the root project directory. This has been aliased in the tsconfig and the storybook webpack config as a helper.

#### Example

Then run the example inside another:

```bash
cd example
npm i # or yarn to install dependencies
npm start # or yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure TSDX is running in watch mode like we recommend above. **No symlinking required**, we use [Parcel's aliasing](https://parceljs.org/module_resolution.html#aliases).

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

### Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle analysis

Calculates the real cost of your library using [size-limit](https://github.com/ai/size-limit) with `npm run size` and visulize it with `npm run analyze`.

## Continuous Integration

### GitHub Actions

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [size-limit](https://github.com/ai/size-limit)
