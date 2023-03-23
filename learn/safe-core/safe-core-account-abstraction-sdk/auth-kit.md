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

Create an instance of the [SafeAuthKit](https://github.com/safe-global/account-abstraction-sdk/blob/main/packages/auth-kit/src/SafeAuthKit.ts) class providing the `SafeAuthProviderType` and `SafeAuthConfig` as parameters.

`Web3Auth` is the only provider type currently supported but we plan to add more providers in the future.

```typescript
import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'

const safeAuthKit = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
  chainId: '0x5',
  authProviderConfig: {
    rpcTarget: <Your rpc url>, // Add your RPC e.g. https://goerli.infura.io/v3/<your project id>
    clientId: <Your client id>, // Add your client id. Get it from the Web3Auth dashboard
    network: 'testnet' | 'mainnet', // The network to use for the Web3Auth modal. Use 'testnet' while developing and 'mainnet' for production use
    theme: 'light' | 'dark', // The theme to use for the Web3Auth modal
    modalConfig: {
      // The modal config is optional and it's used to customize the Web3Auth modal
      // Check the Web3Auth documentation for more info: https://web3auth.io/docs/sdk/web/modal/whitelabel#initmodal
    }
  }
})
```

The `authProviderConfig` object is the specific configuration object for the Web3Auth modal:

- `rpcTarget`: The rpc url to connect to the Ethereum network
- `clientId`: The client id of your Web3Auth account. [Create an application in your Web3Auth account](https://dashboard.web3auth.io) to get this value.
- `network`: The network name to use for the Web3Auth modal (mainnet | testnet)
- `theme`: The theme to use for the Web3Auth modal (dark | light)
- `modalConfig`: The modal config is used to customize the Web3Auth modal methods shown

Once the instance is created, you can call the `signIn()` method to start the authentication process showing the web3Auth modal.
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

We expose two events to know when the user is authenticated or when the session is removed.

```typescript
safeAuthKit.subscribe(SafeAuthEvents.SIGN_IN, () => {
  console.log('User is authenticated');
});

safeAuthKit.subscribe(SafeAuthEvents.SIGN_OUT, () => {
  console.log('User is not authenticated');
});
```

It's also possible to get the associated Safe addresses to a external owned account adding the transaction service url to the config. This could be useful depending on your workflow.

```typescript
const safeAuthKit = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
  ...
  txServiceUrl: 'https://safe-transaction-goerli.safe.global' // Add the corresponding transaction service url depending on the network. Other networks: https://docs.gnosis-safe.io/learn/infrastructure/available-services#safe-transaction-service
  authProviderConfig: { ... }
})
```

When `txServiceUrl` is provided, the list of associated Safe addresses will be returned as part of the `signIn()` method response.

## Sending/signing transactions or messages using the Auth kit

Once you are logged in using the Auth kit you can get the associated web3 provider using the `safeAuthKit.getProvider()` method. If you want to make any kind of operation afterward, you can use this method with your favorite web3 library:

```typescript
// Using web3
const web3 = new Web3(safeAuthKit.getProvider());

await web3.eth.sendTransaction(tx);
await web3.eth.signTransaction(tx);
const message = "hello world"
const address = "0x..."
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
