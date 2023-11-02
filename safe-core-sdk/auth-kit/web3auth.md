# Integration with Web3Auth

This guide demonstrate how to create an externally-owned account using your email or social media account. Once authenticated, you can sign transactions and interact with any Safe Smart Accounts you own.

## Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Create a Web3Auth account](https://dashboard.web3auth.io)

### Install dependencies

```bash
npm i @safe-global/auth-kit @web3auth/ws-embed
```

## Create a Web3AuthPack instance

We are going to use the provided `Web3AuthPack` exported in the `@safe-global/auth-kit` package.

Create an instance of the [Web3AuthPack](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit/src/packs/web3auth/Web3AuthPack.ts) using the required `Web3AuthConfig` configuration object.

```typescript
import {
  Web3AuthPack,
  Web3AuthConfig,
  Web3AuthInitOptions,
} from '@safe-global/auth-kit';

const options: Web3AuthInitOptions = {
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

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global',
};

// Instantiate and initialize the pack
const web3AuthPack = new Web3AuthPack(web3AuthConfig);
await web3AuthModalPack.init(options);
```

## Sign in to an Ethereum account

Once your `Web3AuthPack` instance is created, use the `signIn()` method to start the authentication process. Usually, you call this method when the user clicks on a "Sign In" button added to your page.

After the signing, you are going to create a new Ethereum Wallet that will remain the same for all the future logins and will be shared across different applications.

```typescript
// The signIn() method will return the user's Ethereum address
// The await will last until the user is authenticated, so while the UI modal is showed
const authKitSignData = await web3AuthModalPack.signIn();
```

The returned `authKitSignData` data contains the following props:

```typescript
AuthKitSignInData {
  eoa: string // The safe signer
  safes?: string[] // The list of associated Safe addresses
}
```

The `signOut()` method removes the current session.

```typescript
await web3AuthPack.signOut();
```

Call `getProvider()` to get the Ethereum provider instance. This is a [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) compatible provider you can wrap using your favorite library (web3, ethers).

```typescript
web3AuthPack.getProvider();
```

We expose two methods for listening to events, `subscribe()` and `unsubscribe()`.

```typescript
web3AuthModalPack.subscribe('?', () => {
  console.log('User is authenticated');
});

web3AuthModalPack.subscribe('?', () => {
  console.log('User is not authenticated');
});
```

When `txServiceUrl` is provided in the `Web3AuthPack` instantiation, the list of associated Safe addresses will be returned as part of the `signIn()` method response.

```typescript
const web3AuthModalPack = new Web3AuthModalPack({
  txServiceUrl: 'https://safe-transaction-goerli.safe.global',
});
```

## Signing transactions using the Web3AuthModalPack and Protocol Kit

The `Web3AuthPack` can be combined with the [Protocol Kit](../protocol-kit/) to connect to a Safe using the `provider` and `signer` of the currently authenticated account.

Once connected, you can use any of the methods available in the [Protocol Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit#sdk-api).

```typescript
import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';

provider = new ethers.providers.Web3Provider(web3AuthModalPack.getProvider());
signer = provider.getSigner();

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

## Sign messages using the `Web3AuthPack`

You can also sign any arbitrary message or transaction as a regular Signing Account with your favorite web3 library:

```typescript
// Using web3
const web3 = new Web3(web3AuthPack.getProvider());

await web3.eth.sendTransaction(tx);
await web3.eth.signTransaction(tx);
const message = 'hello world';
const address = '0x...';
await web3.eth.personal.sign(message, address);

// Using ethers
const provider = new ethers.providers.Web3Provider(web3AuthPack.getProvider());
const signer = provider.getSigner();

await signer.sendTransaction(tx);
await signer.signTransaction(tx);
await signer.signMessage(message);
```

## Alternative example in `@safe-global/safe-core-sdk`

See an [example](https://github.com/safe-global/safe-core-sdk/blob/main/packages/auth-kit/example/src/App.tsx) on how to initialize and use the Auth Kit.
