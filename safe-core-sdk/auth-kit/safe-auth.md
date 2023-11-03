# Integration with SafeAuth

This guide demonstrate how to create an externally-owned account using your email or social media account. Once authenticated, you can sign transactions and interact with any Safe Smart Accounts you own.

The `SafeAuthPack` is an authentication system that utilizes the [Web3Auth](https://web3auth.io) MPC technology. It was developed in collaboration with Web3Auth to create a smooth onboarding experience for web2 users.

## Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Install dependencies

```bash
npm i @safe-global/auth-kit @web3auth/ws-embed
```

## Create a SafeAuthPack instance

We are going to use the provided `SafeAuthPack` exported in the `@safe-global/auth-kit` package.

Create an instance of the [SafeAuthPack](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit/src/packs/safe-auth/SafeAuthPack.ts) using the required `SafeAuthConfig` configuration object.

```typescript
import {
  SafeAuthPack,
  SafeAuthConfig,
  SafeAuthInitOptions,
} from '@safe-global/auth-kit';

const safeAuthConfig: SafeAuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global',
};
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
};

const safeAuthPack = new SafeAuthPack(safeAuthConfig);
await safeAuthPack.init(safeAuthInitOptions);
```

## Sign in to an Ethereum account

Once your `SafeAuthPack` instance is created, use the `signIn()` method to start the authentication process. Usually, you call this method when the user clicks on a "Sign In" button added to your page.

After the signing, you are going to create a new Ethereum Wallet that will remain the same for all the future logins and **will be shared across different applications**.

```typescript
// The signIn() method will return the user's Ethereum address and the associated Safe addresses
// The await will last until the user is authenticated, so while the authentication popup is showed
const authKitSignData = await safeAuthPack.signIn();
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
await safeAuthPack.signOut();
```

After the user is authenticated, call `getProvider()` to get the Ethereum provider instance. This is a [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) compatible provider you can wrap using your favorite library (web3, ethers).

```typescript
safeAuthPack.getProvider();
```

We expose two methods for listening to events, `subscribe()` and `unsubscribe()`.

```typescript
safeAuthPack.subscribe('?', () => {
  console.log('User is authenticated');
});

safeAuthPack.subscribe('?', () => {
  console.log('User is not authenticated');
});
```

When `txServiceUrl` is provided in the `SafeAuthPack` instantiation, the list of associated Safe addresses will be returned as part of the `signIn()` method response.

```typescript
const safeAuthPack = new SafeAuthPack({
  txServiceUrl: 'https://safe-transaction-mainnet.safe.global',
});
```

## Signing transactions using the SafeAuthPack and Protocol Kit

The `SafeAuthPack` can be combined with the [Protocol Kit](../protocol-kit/) to connect to a Safe using the `provider` and `signer` of the currently authenticated account.

Once connected, you can use any of the methods available in the [Protocol Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit#sdk-api).

```typescript
import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';

const provider = new ethers.providers.Web3Provider(safeAuthPack.getProvider());
const signer = provider.getSigner();

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer || provider,
});

const safeSDK = await Safe.create({
  ethAdapter,
  safeAddress,
});

// Create a Safe transaction with the provided parameters
const safeTransactionData: MetaTransactionData = {
  to: '0x',
  data: '0x',
  value: ethers.utils.parseUnits('0.0001', 'ether').toString(),
};

const safeTransaction = await safeSDK.createTransaction({
  safeTransactionData,
});
```

## Sign messages using the `SafeAuthPack`

You can also sign any arbitrary message or transaction as a regular Signing Account with your favorite web3 library:

```typescript
// Using web3
const web3 = new Web3(safeAuthPack.getProvider());

await web3.eth.sendTransaction(tx);
await web3.eth.signTransaction(tx);
const message = 'hello world';
const address = '0x...';
await web3.eth.personal.sign(message, address);

// Using ethers
const provider = new ethers.providers.Web3Provider(safeAuthPack.getProvider());
const signer = provider.getSigner();

await signer.sendTransaction(tx);
await signer.signTransaction(tx);
await signer.signMessage(message);
```

## Alternative example in `@safe-global/safe-core-sdk`

See an [example](https://github.com/safe-global/safe-core-sdk/blob/main/packages/auth-kit/example/src/App.tsx) on how to initialize and use the Auth Kit.
