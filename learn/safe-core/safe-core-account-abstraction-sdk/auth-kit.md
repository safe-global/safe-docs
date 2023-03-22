# Auth Kit

The [Auth kit](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/auth-kit) creates an Ethereum address and authenticates a blockchain account using an email address, social media account, or traditional crypto wallets like Metamask.

Note: The Auth kit creates a [Signing Account, not a Smart Account](/learn/what-is-a-smart-contract-account.md#smart-accounts-vs-signing-accounts).

The quick start guide below shows you how to sign transactions using your Signing Account. You can sign transactions using your Signing Account to create a Smart Account.

## Quickstart

### Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Create a Web3Auth account](https://web3auth.io) to use Web3Auth as the authentication provider.

### Install dependencies

```bash
yarn add @safe-global/auth-kit @web3auth/base @web3auth/modal @web3auth/openlogin-adapter
```

### How to use

Create an instance of the [SafeAuthKit](https://github.com/safe-global/account-abstraction-sdk/blob/main/packages/auth-kit/src/SafeAuthKit.ts) class providing the chosen adapter (e.g `Web3AuthAdapter`) and the kit configuration `SafeAuthConfig`.

`Web3Auth` is the only provider type currently supported but we plan to add more providers in the future.

```typescript
import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit';

// https://web3auth.io/docs/sdk/web/modal/initialize#arguments
const options: Web3AuthOptions = {
  clientId: 'web3Auth-client-id',
  web3AuthNetwork: 'testnet',
  chainConfig: { ... },
};
// https://web3auth.io/docs/sdk/web/modal/initialize#configuring-adapters
const modalConfig = { ... };
// https://web3auth.io/docs/sdk/web/modal/whitelabel#whitelabeling-while-modal-initialization
const openloginAdapter = new OpenloginAdapter({ ... });

// Create an instance of the Web3AuthAdapter
const web3AuthAdapter = new Web3AuthAdapter(options, [openloginAdapter], modalConfig);

// Create an instance of the SafeAuthKit using the adapter and the SafeAuthConfig allowed options
const safeAuthKit = await SafeAuthKit.init(web3AuthAdapter, { ... });
```

Once the instance is created, you can call the `signIn()` method to start the authentication process showing the web3Auth modal in case you use the `Web3AuthAdapter`.

While you sign in with the same email or social account, the same Ethereum address will be returned.

```typescript
// The signIn method will return the user's Ethereum address
// The await will last until the user is authenticated so while the UI modal is showed
await safeAuthKit.signIn();
```

The `signOut` method will remove the current session.

```typescript
await safeAuthKit.signOut();
```

Call `getProvider` to get the Ethereum provider instance.

```typescript
safeAuthKit.getProvider();
```

We expose two methods for listening to events. In the case of the `Web3AuthAdapter` we can listening to all the events listed [here](https://web3auth.io/docs/sdk/web/modal/initialize#subscribing-the-lifecycle-events).

```typescript
import { ADAPTER_EVENTS } from '@web3auth/base';

safeAuthKit.subscribe(ADAPTER_EVENTS.CONNECTED, () => {
  console.log('User is authenticated');
});

safeAuthKit.subscribe(ADAPTER_EVENTS.DISCONNECTED, () => {
  console.log('User is not authenticated');
});
```

It's also possible to get the associated Safe addresses to a external owned account adding the transaction service url to the config. This could be useful depending on your workflow.

```typescript
const safeAuthKit = await SafeAuthKit.init(web3AuthAdapter, {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global', // Add the corresponding transaction service url depending on the network
});
```

When `txServiceUrl` is provided, the list of associated Safe addresses will be returned as part of the `signIn()` method response.

## Sending/signing transactions or messages using the Auth kit

Once you are logged in using the Auth kit you can get the associated web3 provider using the `safeAuthKit.getProvider()` method. If you want to make any kind of operation afterward, you can use this method with your favorite web3 library:

```typescript
// Using web3
const web3 = new Web3(safeAuthKit.getProvider());

await web3.eth.sendTransaction(tx);
await web3.eth.signTransaction(tx);
const message = 'hello world';
const address = '0x...';
await web3.eth.personal.sign(message, address);

// Using ethers
const provider = new ethers.providers.Web3Provider(safeAuthKit.getProvider());
const signer = provider.getSigner();

await signer.sendTransaction(tx);
await signer.signTransaction(tx);
await signer.signMessage(message);
```

## Example

[Check a functional demo](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/auth-kit/example) using the `auth-kit`
