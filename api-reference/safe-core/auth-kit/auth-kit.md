# Auth Kit

The [Auth kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit) creates an Ethereum address and authenticates a blockchain account using an email address, social media account, or traditional crypto wallets like Metamask.

### Install

To add the Auth kit to your project, run:

```bash
yarn add @safe-global/auth-kit
```

Currently we support these Auth providers delivered as "packs". To add the pack you want to use you should add the proper packages:

- [Web3Auth](./web3auth.md#install)

### SafeAuthKit

Create an instance of the [SafeAuthKit](https://github.com/safe-global/safe-core-sdk/blob/main/packages/auth-kit/src/SafeAuthKit.ts)

For creating an instance of the OnRamp Kit you need to use the static method `init` and use the chosen pack.

```typescript
SafeAuthKit.init(pack);
```

### Reference

#### `init(pack, config?)`

Call the `init` method to create an instance of the Auth Kit.

```typescript
const safeAuthKit = await SafeAuthKit.init(pack, config);
```

**Parameters**

- `pack` - The pack you want to use.
- `config?` - The configuration options for the pack. Some packs can require it and some others don't.

**Returns**
The SafeAuthKit instance allowing the different methods to be called using the pack.

**Caveats**
You should always call the `init` method before interacting with the Auth Kit.

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
To retrieve the safe addresses you should instantiate the authKit with the `txServiceUrl` property in the config object. In other case only the eoa will be returned.

#### `signOut()`

Call this method to sign out the user and clean the session.

#### `getProvider()`

Using getProvider you will receive a regular web3 provider derived from the pack you are using.

**Returns**
A web3 standard provider.

**Caveats**

- Using Web3Auth with Social Logins you will receive a provider that will allow you to sign transactions but there is no interface involved so no UI confirmations as for example you get when using regular Wallets as Metamask.

#### `getUserInfo()`

Using getUserInfo you will receive the user information derived from the pack you are using. It varies depending on the provider.

**Returns**
A web3 standard provider.

#### `subscribe(event, handler)`

Allow to subscribe to authentication state changes. The event depends on the pack you are using so read the chosen pack documentation.

**Parameters**

- `event` - The event you want to subscribe to.
- `handler` - The handler function that will be called when the event is triggered.

#### `unsubscribe(event, handler)`

Allow to unsubscribe to authentication state changes. The event depends on the pack you are using so read the chosen pack documentation.

**Parameters**

- `event` - The event you want to unsubscribe to.
- `handler` - The handler function that will be called when the event is triggered.

### Usage

Using the auth kit is as simple as calling the `init` method and then the `signIn` method. The `signIn` method will return the EOA and the associated safe addresses.

```typescript
// Instantiate
const safeAuthKit = await SafeAuthKit.init(new Pack(PackOptions));

// Sign in
const { eoa, safes } = await safeAuthKit.signIn();
const userInfo = await safeAuthKit.getUserInfo();
const web3Provider = safeAuthKit.getProvider();

// Subscribe to events
const handler = (event) => {};
safeAuthKit.subscribe(PackEvent, handler);
safeAuthKit.unsubscribe(PackEvent, handler);

// Sign out
await safeAuthKit.signOut();
```

### TroubleShooting
