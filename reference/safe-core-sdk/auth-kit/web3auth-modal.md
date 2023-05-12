## Web3AuthModal

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

### Web3AuthModalPack

The `Web3AuthModalPack` class is the pack that makes Web3Auth modal and Safe work together. Create an instance of the pack and pass it to the `SafeAuthKit` instance.

#### `Web3AuthModalPack(web3AuthModalOptions, adapters[]?, modalConfig?)`

```typescript
const web3AuthModalPack = new Web3AuthModalPack(
  web3AuthModalOptions,
  adapters,
  modalConfig
);
await SafeAuthKit.init(web3AuthModalPack);
```

**Params**

- `web3AuthModalOptions` - The options to create the `Web3Auth` [instance](https://web3auth.io/docs/sdk/web/modal/initialize#instantiating-web3auth). You can send a configuration object matching the [official one](https://web3auth.io/docs/sdk/web/modal/initialize#web3authoptions) as we passthrough the options to the `Web3Auth` instance when we instantiate it inside the pack.
- `adapters` - The adapters for the Web3Auth modal sdk. You can use any of the [supported adapters](https://web3auth.io/docs/sdk/web/adapters/). This prop accepts an array of adapters and the `Web3AuthModalPack` will call the [`configureAdapter`](https://web3auth.io/docs/sdk/web/no-modal/initialize#configureadapteradapter) method for each one of them internally.

⚠️ Remember to add the corresponding package for each adapter (e.g `@web3auth/openlogin-adapter` for OpenLogin).

- `modalConfig` - The configuration for the Web3Auth modal sdk. You can explore the options [here](https://web3auth.io/docs/sdk/web/modal/whitelabel#initmodal). This options are used with the `initModal` method internally.

**Returns**
An instance of the `Web3AuthModalPack` class that implements the `SafeAuthPack<TPack>` interface.

⚠️ The following methods shouldn't be called directly but used from the `SafeAuthKit` instance instead. ⚠️

#### `init()`

[Instantiate the `Web3Auth`](https://web3auth.io/docs/quick-start?product=Plug+and+Play&sdk=Plug+and+Play+Web+Modal+SDK&platform=React#3-initialize-web3auth-for-your-preferred-blockchain) class and [configure the adapters](https://web3auth.io/docs/sdk/web/no-modal/initialize#configureadapteradapter). It calls the [`initModal`](https://web3auth.io/docs/sdk/web/modal/whitelabel#initmodal) method internally.

The options and adapters being used are the ones passed to the `Web3AuthModalPack` constructor.

#### `signIn()`

The `signIn()` method call internally the [`connect()`](https://web3auth.io/docs/sdk/web/modal/usage#connect) one from Web3Auth. It get a web3 provider and store it internally in the instance.

#### `signOut()`

Calls the [`logout()`](https://web3auth.io/docs/sdk/web/modal/usage#web3authlogout) method from Web3Auth and clear the web3 provider stored in the instance.

#### `getUserInfo()`

Calls the [`getUserInfo()`](https://web3auth.io/docs/sdk/web/modal/usage#getuserinfo) method from Web3Auth.

**Returns**
The `UserInfo` object has properties that depend on the adapter and authentication platform and method used.

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
