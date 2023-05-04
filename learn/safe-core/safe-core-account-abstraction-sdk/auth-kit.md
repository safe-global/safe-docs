# Auth Kit

The [Auth kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit) creates an Ethereum address and authenticates a blockchain account using an email address, social media account, or traditional crypto wallets like Metamask.

Note: The Auth kit creates a [Signing Account, not a Smart Account](/learn/what-is-a-smart-contract-account.md#smart-accounts-vs-signing-accounts).

The quick start guide below shows you how to create a Signing Account using your email or social media account. Once authenticated, you can sign transactions and interact with any Safe Smart Accounts you own.

## Quickstart

## Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Create a Web3Auth account](https://web3auth.io)

## Example

See an [Auth Kit example in the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/7959821ab08c96cf3babb9ed906c01d644ac49f4/packages/auth-kit/example/src/App.tsx#L33) and [Pull Request 12](https://github.com/5afe/safe-space/pull/12) in [Safe Space](https://github.com/5afe/safe-space).


{% embed url="https://user-images.githubusercontent.com/9806858/234088191-441c1c18-5922-47a4-a4dd-44fb383a54d6.mp4" %}
[Watch video demo](https://user-images.githubusercontent.com/9806858/234088191-441c1c18-5922-47a4-a4dd-44fb383a54d6.mp4)
{% endembed %}



### Install dependencies

```bash
yarn add @safe-global/auth-kit @web3auth/base @web3auth/modal @web3auth/openlogin-adapter
```

If you run `yarn start` and see an error similar to `Module not found: Error: Can't resolve 'crypto'`, see Web3Auth's [Webpack 5 Polyfills Issue](https://web3auth.io/docs/troubleshooting/webpack-issues) for more context on how to fix or [commit 85ccd22](https://github.com/5afe/safe-space/pull/12/commits/85ccd22b8528d7eacd013a8e3f5bb0093c85b081) for the necessary code changes to fix the Polyfill issues.

Note: You might also need to also install `browserify-zlib` (`yarn add browserify-zlib`), which is not included in the Web3Auth documentation.

Inside `config-overrides.js` in the root of your project folder with the content, add the following as well:

```javascript
const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    // ...
    zlib: require.resolve("browserify-zlib")
  });
  // ...
};
```

See [Webpack 5 Polyfills Issue](https://web3auth.io/docs/troubleshooting/webpack-issues) for the full `config-overrides.js` instructions.

## Create SafeAuthKit Instance

Create an instance of the [SafeAuthKit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit/src/SafeAuthKit.ts) by providing the chosen adapter (e.g `Web3AuthAdapter`) and the kit configuration `SafeAuthConfig`.

`Web3Auth` is the only provider type currently supported but we plan to add more providers in the future.

```typescript
import { SafeAuthKit } from '@safe-global/auth-kit';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

// https://dashboard.web3auth.io/
const WEB3_AUTH_CLIENT_ID=process.env.REACT_APP_WEB3_AUTH_CLIENT_ID!

// https://web3auth.io/docs/sdk/web/modal/initialize#arguments
const options: Web3AuthOptions = {
  clientId: WEB3_AUTH_CLIENT_ID,
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x5',
    // https://chainlist.org/
    rpcTarget: `https://rpc.ankr.com/eth_goerli`
  },
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook']
  }
}

// https://web3auth.io/docs/sdk/web/modal/initialize#configuring-adapters
const modalConfig = {
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: 'torus',
    showOnModal: false
  },
  [WALLET_ADAPTERS.METAMASK]: {
    label: 'metamask',
    showOnDesktop: true,
    showOnMobile: false
  }
}

// https://web3auth.io/docs/sdk/web/modal/whitelabel#whitelabeling-while-modal-initialization
const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: 'mandatory'
  },
  adapterSettings: {
    uxMode: 'popup',
    whiteLabel: {
      name: 'Safe'
    }
  }
})

const adapter = new Web3AuthAdapter(options, [openloginAdapter], modalConfig)

const safeAuthKit = await SafeAuthKit.init(adapter, {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global'
})
```

## Sign In to an Ethereum Account

Once your Auth Kit instance is created, call `signIn()` to start the authentication process.

When you sign in with the same social account, the same Ethereum address will be returned for the same Client ID.

Note: When using Web3Auth, if you sign in with email and then "Sign in with Google", a different Ethereum address might be returned, even if you use the same email address for both login providers.

```typescript
// The signIn method will return the user's Ethereum address
// The await will last until the user is authenticated so while the UI modal is showed
await safeAuthKit.signIn();
```

The `signOut` method will remove the current session.

```typescript
await safeAuthKit.signOut();
```

Call `getProvider()` to get the Ethereum provider instance.

```typescript
safeAuthKit.getProvider();
```

We expose two methods for listening to events. In the case of the `Web3AuthAdapter` we can listen to all the events listed [here](https://web3auth.io/docs/sdk/web/modal/initialize#subscribing-the-lifecycle-events).

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

## Signing transactions using the Auth kit and Protocol Kit

The Auth Kit can be combined with the [Protocol Kit](./protocol-kit/) to connect to a Safe using the `provider` and `signer` of the currently authenticated account.

Once connected, you can use any of the methods available in the [Safe Core SDK](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit#sdk-api).

```typescript
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'

provider = new ethers.providers.Web3Provider(safeAuthKit.getProvider());
signer = provider.getSigner();

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer || provider
})

const safeSDK = await Safe.create({
  ethAdapter,
  safeAddress
})

// Create a Safe transaction with the provided parameters
const safeTransactionData: MetaTransactionData = {
  to: '0x',
  data: '0x',
  value: ethers.utils.parseUnits('0.0001', 'ether').toString()
}

const safeTransaction = await safeSDK.createTransaction({ safeTransactionData })
```

## Sign transactions using the Auth kit

You can also sign any arbitrary message or transaction as a regular Signing Account with your favorite web3 library:

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
