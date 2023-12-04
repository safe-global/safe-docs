# Integration with SafeAuth

This guide demonstrates creating an externally-owned account using your email or social media account. Once authenticated, you can sign transactions and interact with your Safe accounts.

The `SafeAuthPack` is an authentication system that utilizes the [Web3Auth](https://web3auth.io) MPC technology. It was developed in collaboration with Web3Auth to create a smooth onboarding experience for web2 users across different dapps.

## Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Install dependencies

```bash
yarn add @safe-global/auth-kit@alpha @web3auth/safeauth-embed
```

## Create a SafeAuthPack instance

We will use the `SafeAuthPack` exported from the `@safe-global/auth-kit` package.

Create an instance of the [SafeAuthPack](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit/src/packs/safe-auth/SafeAuthPack.ts) using the required `SafeAuthConfig` configuration object.

> Supported networks:
>
> - Production: Ethereum, Polygon, BSC, Avalanche, Optimism, Celo, Arbitrum, Gnosis chain
> - Test: Goerli, Sepolia, Polygon Mumbai, BSC Testnet, Avalanche Testnet, Arbitrum Testnet, Optimism Testnet

```typescript
import {
  SafeAuthPack,
  SafeAuthConfig,
  SafeAuthInitOptions,
} from '@safe-global/auth-kit'

const safeAuthConfig: SafeAuthConfig = {
  txServiceUrl: 'https://safe-transaction-mainnet.safe.global',
}
const safeAuthInitOptions: SafeAuthInitOptions = {
  enableLogging: true,
  showWidgetButton: false,
  chainConfig: {
    blockExplorerUrl: 'https://etherscan.io',
    chainId: '0x1',
    displayName: 'Main Ethereum Network',
    logo: 'eth.svg',
    rpcTarget: `${rpcUrl}`,
    ticker: 'ETH',
    tickerName: 'Ethereum',
  },
}

const safeAuthPack = new SafeAuthPack(safeAuthConfig)
await safeAuthPack.init(safeAuthInitOptions)
```

## Sign in to an Ethereum account

After creating your `SafeAuthPack` instance, initiate the authentication process by calling the `signIn()` method. Typically, this method is called when the user clicks a "Sign In" button on the web page.

After successfully signing in, you will create a new Ethereum Wallet. This wallet will be used for all future logins and can be **shared across different applications**.

```typescript
// The signIn() method returns the user's Ethereum address and the associated Safe addresses
// The `await` will last until the user is authenticated. Therefore, it will be active while the authentication popup is being displayed.
const authKitSignData = await safeAuthPack.signIn()
```

The returned `authKitSignData` data contains the following properties:

```typescript
AuthKitSignInData {
  eoa: string // The safe signer
  safes?: string[] // The list of associated Safe addresses in the chain
}
```

The `signOut()` method removes the current session.

```typescript
await safeAuthPack.signOut()
```

After the user is authenticated, call `getProvider()` to get the Ethereum provider instance. This is a [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) compatible provider you can wrap using your favorite library (web3, ethers).

```typescript
safeAuthPack.getProvider()
```

We offer two methods for listening to events, `subscribe()` and `unsubscribe()`.

```typescript
const accountChangedHandler = (accounts: string[]) => {
  console.log('Signer accounts:', accounts)
}

safeAuthPack.subscribe('accountsChanged', accountChangedHandler)
safeAuthPack.unsubscribe('accountsChanged', accountChangedHandler)
```

The `SafeAuthPack` instantiation will return the list of associated Safe addresses as part of the response from the `signIn()` method when the `txServiceUrl` is provided.

```typescript
const safeAuthPack = new SafeAuthPack({
  txServiceUrl: 'https://safe-transaction-mainnet.safe.global',
})
```

## Signing and executing transactions using the SafeAuthPack and Protocol Kit

The `SafeAuthPack` can be used with the [Protocol Kit](../../protocol-kit/README.md) to establish a connection to a Safe. This connection is made using the `provider` and `signer` associated with the authenticated account.

After connecting, you can use any of the methods provided in the [Protocol Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit#sdk-api).

```typescript
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'

// Wrap EIP-1193 provider with ethers
const provider = new ethers.BrowserProvider(safeAuthPack.getProvider())
const signer = provider.getSigner()

// Create the Safe EthersAdapter
const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer || provider,
})

// Instantiate the protocolKit
const protocolKit = await Safe.create({
  ethAdapter,
  safeAddress,
})

// Create a Safe transaction with the provided parameters
const safeTransactionData: MetaTransactionData = {
  to: `${ethAddress}`,
  data: '0x',
  value: ethers.parseUnits('0.0001', 'ether').toString(),
}

const safeTransaction = await protocolKit.createTransaction({
  transactions: [safeTransactionData],
})

// Sign the transaction if the Safe have several owners
// safeTransaction = await protocolKit1.signTransaction(safeTransaction)
// safeTransaction = await protocolKit2.signTransaction(safeTransaction)

// Execute the transaction
await protocolKit.executeTransaction(safeTransaction)
```

## Sign messages using the `SafeAuthPack`

You can also sign any arbitrary message or transaction as a regular Signing Account with your favorite web3 library:

```typescript
// Using web3
const web3 = new Web3(safeAuthPack.getProvider())

await web3.eth.sendTransaction(tx)
await web3.eth.signTransaction(tx)
const message = 'hello world'
const address = '0x...'
await web3.eth.personal.sign(message, address)

// Using ethers
const provider = new ethers.BrowserProvider(safeAuthPack.getProvider())
const signer = provider.getSigner()

await signer.sendTransaction(tx)
await signer.signTransaction(tx)
await signer.signMessage(message)
```

## Examples

- [React](https://github.com/safe-global/safe-core-sdk/blob/main/packages/auth-kit/example/src/App.tsx)
- [Vanilla Typescript](https://github.com/5afe/safe-auth)
