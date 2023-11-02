# Web3AuthModalPack

Web3Auth is a pluggable authentication infrastructure for Web3 wallets and applications. It simplifies onboarding for both mainstream and crypto native users, offering experiences tailored to their preferences. It supports all social logins, web and mobile native platforms, wallets, and other key management methods, creating a cryptographic key provider specific to the user and application.

The `Web3AuthPack` enables the use of the [Web3Auth infrastructure](https://web3auth.io) with added Safe capabilities, such as retrieving the related Safe addresses for a given externally-owned account created using Web3Auth services.

The pack allow the onboarding of web2 users and provides a ethereum signer address that can be used across any dApp using the different Ethereum chains.

## Install dependencies

To use the `Web3AuthPack`, you need to install the `@safe-global/auth-kit` package.

```bash
yarn add @safe-global/auth-kit
```

## Reference

The `Web3AuthPack` class is what makes Web3Auth modal and Safe work together. Create an instance of the pack and initialize it to start the interaction.

```typescript
const web3AuthPack = new Web3AuthPack({
  txServiceUrl: 'https://safe-transaction-mainnet.safe.global',
});
await web3AuthPack.init(web3AuthOptions);
```

### new Web3AuthPack(web3AuthConfig)

**Params**

- `web3AuthConfig` - The configuration used in the instantiation of the `Web3AuthPack` class accepts the following options:

```typescript
Web3AuthConfig {
  txServiceUrl: string
}
```

- `txServiceUrl` - The URL of the Safe transaction service. It is used to retrieve the Safe addresses for an externally-owned account created using Web3Auth services. It is required to use the `Web3AuthPack` with Safe.

**Caveats**
You should always call the `init()` method afterwards before interacting with the pack.

### init(web3AuthOptions)

The init method initialize the Web3Auth SDK and Safe services

**Params**

- `web3AuthOptions` - The options to initialize the SDK instance.

```typescript
web3AuthOptions {
  enableLogging?: boolean
  showWidgetButton?: boolean
  buttonPosition?: "bottom-left" | "top-left" | "bottom-right" | "top-right"
  buildEnv?: "production" | "development" | "testing"
  chainConfig?: {
    blockExplorerUrl: string
    logo: string
    tickerName: string
    ticker: string
    rpcTarget: string
    wcTarget?: string
    chainId: string
    displayName: string
    isTestnet?: boolean
    isErc20?: boolean
    tokenAddress?: string
  }
}
```

- `enableLogging` - Enable logging for the SDK. Defaults to `false`
- `buildEnv` - The build environment. 'production' and 'testing' uses "https://safe.web3auth.com". 'development' uses "http://localhost:4050". Defaults to `production`
- `showWidgetButton` - Show the widget button. Defaults to `true`
- `buttonPosition` - If `showWidgetButton` is true then this prop represent the position of the widget button. Defaults to `bottom-left`
- `chainConfig` - The chain configuration. Defaults to `ethereum` if no configuration is provided.
  - `blockExplorerUrl` - Block explorer url for the chain (e.g https://etherscan.io)
  - `logo` - Logo url for the base token of the chain (e.g https://eth.svg)
  - `tickerName` - Name for ticker (e.g Ethereum)
  - `ticker` - Symbol for ticker (e.g ETH)
  - `rpcTarget` - The RPC url to be used
  - `wcTarget` - The websocket url to be used
  - `chainId` - The chain id to be used. Should be an hex with 0x prefix (e.g 0x1 for mainnet)
  - `displayName` - The display name for the network
  - `isTestnet` - Whether the network is testnet or not
  - `isErc20`- Wether the token is an ERC20 token or not
  - `tokenAddress` - The token address for the chain. Should be an hex with 0x prefix (e.g 0x6b175474e89094c44da98b954eedeac495271d0f for DAI)

**Caveats**
Call always the `init()` method before interacting with the other methods in the pack.

### signIn(web3AuthSignInOptions)

`signIn(web3AuthSignInOptions)` starts the authentication flow. It shows a popup that allow the user to choose the oAuth or email to use for generating the web3 wallet address. Returns the EOA and associated Safe addresses.

**Params**

```typescript
Web3AuthSignInOptions = {
  loginProvider?: "google" | "facebook" | "reddit" | "discord" | "twitch" | "apple" | "line" | "github" | "kakao" | "linkedin" | "twitter" | "weibo" | "wechat" | "email_passwordless"
  login_hint?: string
}
```

- `loginProvider` - If specified, instead showing the popup to choose the oAuth or email a direct attempt to login with the specified provider will be made

- `login_hint`

**Returns**
An object with the derived externally-owned account address and the associated safe addresses.

```typescript
AuthKitSignInData {
  eoa: string
  safes?: string[]
}
```

**Caveats**

- To get the Safe addresses, instantiate the authKit with the `txServiceUrl` property in the config object. Otherwise, only the eoa will be returned.
- ⚠️ This method currently returns the Safe addresses which the EOA is the owner of. It does not create a Safe. We are investigating ways to enhance the Auth Kit and the associated flows. ⚠️

### signOut(web3AuthSignOutOptions?)

Call this method to sign out the user and clean the session.

```typescript
Web3AuthSignOutOptions {
  reset: boolean;
}
```

**Params**

- `reset` - If true, the user will be logged out from the provider and the widget will be destroyed so don't use this parameter if you want to logout and login again without refreshing the browser or reinitializing the `Web3AuthPack` instance.

### getUserInfo()

Using `getUserInfo()` you will receive the user information derived from the pack you are using. It varies depending on the provider.

**Returns**
The `UserInfo` object has properties that depend on the provider.

### getProvider()

Using `getProvider()` you will receive a regular web3 provider derived from the pack you are using and compatible with the EIP-1193 standard.

**Returns**
A EIP-1193 compatible provider.

### subscribe(event, handler)

Allow to subscribe to authentication state changes. The event depends on the pack you are using so read the chosen pack documentation.

**Params**

- `event` - The event you want to subscribe to. The events are defined [in the documentation](https://web3auth.io/docs/sdk/pnp/web/no-modal/initialize#subscribing-the-lifecycle-events).
- `handler` - The handler function that will be called when the event is triggered.

### unsubscribe(event, handler)

Allow to unsubscribe to authentication state changes

**Params**

- `event` - The event you want to unsubscribe to.
- `handler` - The handler function that will be called when the event is triggered.

## Usage

Calling `init()` when your page loads or component renders is all it takes to use the Auth Kit with the `Web3AuthModalPack`. To start the authentication process, simply call `signIn()` afterwards. This method returns the EOA and associated Safe addresses.

```typescript
// Instantiate and initialize the pack
const web3AuthPack = new Web3AuthModalPack(web3AuthConfig);
await web3AuthPack.init(web3AuthOptions);

const { eoa, safes } = await web3AuthPack.signIn();
const userInfo = await web3AuthPack.getUserInfo();
const web3Provider = web3AuthPack.getProvider();

// Subscribe to events
const handler = (event) => {};
web3AuthPack.subscribe(packEvent, handler);
web3AuthPack.unsubscribe(packEvent, handler);

// Sign out
await web3AuthPack.signOut();
```

```

```
