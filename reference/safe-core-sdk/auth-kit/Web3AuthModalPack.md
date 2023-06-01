## Web3AuthPack

Web3Auth is a pluggable authentication infrastructure for Web3 wallets and applications. It simplifies onboarding for both mainstream and crypto native users, offering experiences tailored to their preferences. It supports all social logins, web and mobile native platforms, wallets, and other key management methods, creating a cryptographic key provider specific to the user and application.

The `Web3AuthModalPack` enables you to use [Web3Auth modal](https://web3auth.io/docs/sdk/web/modal/) SDK with added Safe capabilities, such as retrieving the related Safe addresses for an external owned account created using Web3Auth services.

### Install

To use the `Web3AuthModalPack`, you need to install some extra dependencies in addition to the `@safe-global/auth-kit` package.

```bash
yarn add @web3auth/base @web3auth/modal @safe-global/auth-kit
```

Choose the adapters to use with Web3Auth, and add them. For example, to use the [OpenLogin](https://docs.openlogin.com/) adapter, you must install the following dependency:

```bash
yarn add @web3auth/openlogin-adapter
```

Refer to the [supported adapters](https://web3auth.io/docs/sdk/web/adapters/) in the official documentation.

### Reference

The `Web3AuthModalPack` class is what makes Web3Auth modal and Safe work together. Create an instance of the pack and pass it to the `SafeAuthKit` instance.

```typescript
const web3AuthModalPack = new Web3AuthModalPack({
  txServiceUrl: 'https://safe-transaction-mainnet.safe.global',
});
```

#### `new Web3AuthModalPack(web3AuthConfig)`

**Params**

The `web3AuthConfig` config used in the instantiation if the `Web3AuthModalPack` class accepts the following options:

```typescript
Web3AuthConfig {
  txServiceUrl: string;
}
```
- `txServiceUrl` - The URL of the Safe transaction service. It is used to retrieve the Safe addresses for an external owned account created using Web3Auth services. It is required to use the `Web3AuthModalPack` with Safe.

**Caveats**
You should always call the `init()` method afterwards before interacting with the pack.

#### `init(web3AuthModalOptions, adapters[]?, modalConfig?)`

The init method initialize the required Web3Auth modal SDK and Safe services. It [instantiates the `Web3Auth`](https://web3auth.io/docs/quick-start?product=Plug+and+Play&sdk=Plug+and+Play+Web+Modal+SDK&platform=React#3-initialize-web3auth-for-your-preferred-blockchain) class and [configure the adapters](https://web3auth.io/docs/sdk/web/no-modal/initialize#configureadapteradapter). It calls the [`initModal`](https://web3auth.io/docs/sdk/web/modal/whitelabel#initmodal) method internally.

It initializes as well the web3 provider we can retrieve afterwards using the `getProvider()` method.

**Params**

- `web3AuthModalOptions` - The options to create the `Web3Auth` [instance](https://web3auth.io/docs/sdk/web/modal/initialize#instantiating-web3auth). You can send a configuration object matching the [official one](https://web3auth.io/docs/sdk/web/modal/initialize#web3authoptions) as we passthrough the options to the `Web3Auth` instance when we instantiate it inside the pack.
- `adapters` - The adapters for the Web3Auth modal sdk. You can use any of the [supported adapters](https://web3auth.io/docs/sdk/web/adapters/). This prop accepts an array of adapters and the `Web3AuthModalPack` will call the [`configureAdapter`](https://web3auth.io/docs/sdk/web/no-modal/initialize#configureadapteradapter) method for each one of them internally.

⚠️ Remember to add the corresponding package for each adapter (e.g `@web3auth/openlogin-adapter` for OpenLogin).

- `modalConfig` - The configuration for the Web3Auth modal sdk. You can explore the options [here](https://web3auth.io/docs/sdk/web/modal/whitelabel#initmodal). This options are used with the `initModal` method internally.

**Caveats**
Call always the `init()` method before interacting with the other methods in the pack.

#### `signIn()`

The `signIn()` method call internally the [`connect()`](https://web3auth.io/docs/sdk/web/modal/usage#connect) one from Web3Auth. It gets a web3 provider and store it internally in the instance. It retrieves the associated Safe addresses for the external owned account created using Web3Auth services.

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

Internally it calls the [`logout()`](https://web3auth.io/docs/sdk/web/modal/usage#web3authlogout) method from Web3Auth and clears the web3 provider stored in the instance.

#### `getUserInfo()`

Using `getUserInfo()` you will receive the user information derived from the pack you are using. It varies depending on the provider.

Internally it calls the [`getUserInfo()`](https://web3auth.io/docs/sdk/web/modal/usage#getuserinfo) method from Web3Auth.

**Returns**
The `UserInfo` object has properties that depend on the adapter and authentication platform and method used.

#### `getProvider()`

Using `getProvider()` you will receive a regular web3 provider derived from the pack you are using.

**Returns**
A web3 provider.

**Caveats**
⚠️ Web3Auth with Social Logins returns a provider that allows you to sign transactions without any UI confirmations, unlike regular wallets such as Metamask ⚠️

#### `subscribe(event, handler)`

Allow to subscribe to authentication state changes. The event depends on the pack you are using so read the chosen pack documentation.

**Params**

- `event` - The event you want to subscribe to. The events are defined [in the documentation](https://web3auth.io/docs/sdk/web/no-modal/initialize#subscribing-the-lifecycle-events).
- `handler` - The handler function that will be called when the event is triggered.

#### `unsubscribe(event, handler)`

Allow to unsubscribe to authentication state changes

**Params**

- `event` - The event you want to unsubscribe to.
- `handler` - The handler function that will be called when the event is triggered.

### Usage

Calling `init()` when your page loads or component renders is all it takes to use Auth kit with the `Web3AuthModalPack`. To start the authentication process, simply call `signIn()` afterwards. This method returns the EOA and associated Safe addresses.

```typescript
// Instantiate and initialize the pack
const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig)
await web3AuthModalPack.init(web3AuthModalOptions, adapters, modalConfig);

// Sign in
const { eoa, safes } = await web3AuthModalPack.signIn();
const userInfo = await web3AuthModalPack.getUserInfo();
const web3Provider = web3AuthModalPack.getProvider();

// Subscribe to events
const handler = (event) => {};
web3AuthModalPack.subscribe(packEvent, handler);
web3AuthModalPack.unsubscribe(packEvent, handler);

// Sign out
await web3AuthModalPack.signOut();
```