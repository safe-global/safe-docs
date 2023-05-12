# Auth Kit

The [Auth kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit) creates or retrieves an Ethereum address and authenticates a blockchain account using an email address, social media platform, or traditional crypto wallets such as Metamask.

### Install

To add the Auth kit to your project, run:

```bash
yarn add @safe-global/auth-kit
```

We currently offer several providers in the form of "packs". A pack is a piece of code that works with the chosen provider to give Safe users access to new services.

To use one of our developed packs, add the required packages.

- [Web3Auth](./web3auth-modal.md#install)

### SafeAuthKit

This class offers a common interface for accessing different providers.

Create an instance of the [SafeAuthKit](https://github.com/safe-global/safe-core-sdk/blob/main/packages/auth-kit/src/SafeAuthKit.ts)

For creating an instance of the Auth Kit you need to use the static method `init` and use the chosen pack.

```typescript
const pack = new XXXPack(packConfig);
const safeAuthKit = await SafeAuthKit.init(pack, safeAuthConfig);
```

#### `static init(pack, config?)`

To create an instance of the [SafeAuthKit](https://github.com/safe-global/safe-core-sdk/blob/main/packages/auth-kit/src/SafeAuthKit.ts), use the `init` static method and specify the desired pack.

```typescript
const safeAuthKit = await SafeAuthKit.init(pack, config);
```

**Params**

- `pack` - The pack you want to use.
- `config?` - The required options for each pack. The init options are different for each pack so you should check the pack documentation.

**Returns**
The `SafeAuthKit` instance allowing the different methods to be called using the pack.

**Caveats**
You should always call the `init` method before interacting with the `SafeAuthKit`.

#### `signIn()`

Call this method after the `init` method to sign in the user using the chose pack.

```typescript
await safeAuthKit.signIn();
```

**Returns**
An object with the derived external owned account address and the associated safe addresses.

```typescript
SafeAuthSignInData {
  eoa: string
  safes?: string[]
}
```

**Caveats**

- To get the Safe addresses, instantiate the authKit with the `txServiceUrl` property in the config object. Otherwise, only the eoa will be returned.
- ⚠️ This method currently returns the Safe addresses which the EOA is the owner of. It does not create a Safe. We are investigating ways to enhance the auth-kit and the associated flows. ⚠️

#### `signOut()`

Call this method to sign out the user and clean the session.

#### `getProvider()`

Using `getProvider()` you will receive a regular web3 provider derived from the pack you are using.

**Returns**
A web3 provider.

**Caveats**
⚠️ Web3Auth with Social Logins returns a provider that allows you to sign transactions without any UI confirmations, unlike regular wallets such as Metamask ⚠️

#### `getUserInfo()`

Using `getUserInfo()` you will receive the user information derived from the pack you are using. It varies depending on the provider.

**Returns**
The `UserInfo` object has properties that depend on the adapter and authentication platform and method used.

#### `subscribe(event, handler)`

Allow to subscribe to authentication state changes. The event depends on the pack you are using so read the chosen pack documentation.

**Params**

- `event` - The event you want to subscribe to.
- `handler` - The handler function that will be called when the event is triggered.

#### `unsubscribe(event, handler)`

Allow to unsubscribe to authentication state changes. The event depends on the pack you are using so read the chosen pack documentation.

**Params**

- `event` - The event you want to unsubscribe to.
- `handler` - The handler function that will be called when the event is triggered.

### Usage

Calling `init()` when your page loads or component renders is all it takes to use Auth-Kit. To start the authentication process, simply call `signIn()` afterwards. This method returns the EOA and associated Safe addresses.

```typescript
// Instantiate
const safeAuthKit = await SafeAuthKit.init(new Pack(packConfig));

// Sign in
const { eoa, safes } = await safeAuthKit.signIn();
const userInfo = await safeAuthKit.getUserInfo();
const web3Provider = safeAuthKit.getProvider();

// Subscribe to events
const handler = (event) => {};
safeAuthKit.subscribe(packEvent, handler);
safeAuthKit.unsubscribe(packEvent, handler);

// Sign out
await safeAuthKit.signOut();
```
