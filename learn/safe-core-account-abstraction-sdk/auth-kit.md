# Auth Kit

The [Auth kit](https://github.com/safe-global/account-abstraction-sdk/tree/dev/packages/auth-kit) creates an Ethereum address and authenticates a blockchain account using an email address, social media account, or traditional crypto wallets like Metamask.

## Quickstart

### Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Create a Web3Auth account](https://web3auth.io) to use Web3Auth as the authentication provider.

### Install dependencies

```bash
yarn add @safe-global/auth-kit
```

### How to use

Create an instance of the [SafeAuthKit](https://github.com/safe-global/account-abstraction-sdk/blob/dev/packages/auth-kit/src/SafeAuthKit.ts) class providing the `SafeAuthProviderType` and `SafeAuthConfig` as parameters.

`Web3Auth` is the only provider type currently supported but we plan to add more providers in the future.

```typescript
import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'

const safeAuthKit = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
  chainId: '0x5',
  authProviderConfig: {
    rpc: <Your rpc url>, // Add your RPC e.g. https://goerli.infura.io/v3/<your project id>
    clientId: <Your client id>, // Add your client id. Get it from the Web3Auth dashboard
    network: 'testnet' | 'mainnet', // The network to use for the Web3Auth modal. Use 'testnet' while developing and 'mainnet' for production use
    theme: 'light' | 'dark' // The theme to use for the Web3Auth modal
  }
})
```

The `authProviderConfig` object is the specific configuration object for the Web3Auth modal:

- `rpc`: The rpc url to connect to the Ethereum network
- `clientId`: The client id of your Web3Auth account. [Create an application in your Web3Auth account](https://dashboard.web3auth.io) to get this value.
- `network`: The network name to use for the Web3Auth modal (mainnet | testnet)
- `theme`: The theme to use for the Web3Auth modal (dark | light)

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

## Example

[Check a functional demo](https://github.com/safe-global/account-abstraction-sdk/tree/dev/packages/auth-kit/example) using the `auth-kit`
