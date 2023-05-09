## Web3AuthModal

Web3Auth is a pluggable auth infrastructure for Web3 wallets and applications. It streamlines the onboarding of both mainstream and crypto native users by providing experiences that they're most comfortable with. With support for all social logins, web & mobile native platforms, wallets, and other key management methods, Web3Auth results in a standard cryptographic key provider specific to the user and application.

The Web3AuthModal pack enables you to use [Web3Auth modal](https://web3auth.io/docs/sdk/web/modal/) sdk with added Safe capabilities as retrieving the related Safe addresses given a external owned account created using Web3Auth services.

### Install

If you want to work with the Web3Auth modal pack you need to install additional dependencies apart from the `@safe-global/onramp-kit` package.

```bash
yarn add @web3auth/base @web3auth/modal
```

You have to choose the adapters to use as well with Web3Auth and add them

For example, if you want to use the [OpenLogin](https://docs.openlogin.com/) adapter you need to install the following dependency:

```bash
yarn add @web3auth/openlogin-adapter
```

Check the official docs for the [supported adapters](https://web3auth.io/docs/sdk/web/adapters/).

### Web3AuthModalPack

The `Web3AuthModalPack` class is the pack that allows you to use the Web3Auth modal sdk with Safe. You need to create an instance of the pack and pass it to the `SafeOnRampKit` instance.

#### `Web3AuthModalPack(web3AuthModalOptions, adapters[]?, modalConfig?)`

```typescript
const web3AuthModalPack = new Web3AuthModalPack(
  web3AuthModalOptions,
  adapters,
  modalConfig
);
SafeAuthKit.init(web3AuthModalPack);
```

**Parameters**

- `web3AuthModalOptions` - The options to use to create the `Web3Auth` [instance](https://web3auth.io/docs/sdk/web/modal/initialize#instantiating-web3auth). You can send a configuration object matching the [official one](https://web3auth.io/docs/sdk/web/modal/initialize#web3authoptions) as we passthrough the options to the `Web3Auth` instance when we instantiate it inside the pack.
- `adapters` - The adapters for the Web3Auth modal sdk. You can use any of the [supported adapters](https://web3auth.io/docs/sdk/web/adapters/). This parameter accepts an array of adapters and the pack will call teh [`configureAdapter`](https://web3auth.io/docs/sdk/web/no-modal/initialize#configureadapteradapter) method for each one of them internally.
  Remember to add the corresponding package for each adapter (e.g `@web3auth/openlogin-adapter` for OpenLogin).
- `modalConfig` - The configuration for the Web3Auth modal sdk. You can explore the options [here](https://web3auth.io/docs/sdk/web/modal/whitelabel#initmodal). This options are used with the `initModal` method internally.

**Returns**
An instance of the `Web3AuthModalPack` class that implements the `SafeAuthPack<TPack>` interface.

⚠️ The following methods shouldn't be called directly but used from the `SafeOnRampKit` instance instead. ⚠️
