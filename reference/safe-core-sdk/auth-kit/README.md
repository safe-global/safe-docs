# Auth Kit

The [Auth kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit) creates or retrieves an Ethereum address and authenticates a blockchain account using an email address, social media platform, or traditional crypto wallets such as Metamask.

### Install dependencies

To add the Auth kit to your project, run:

```bash
yarn add @safe-global/auth-kit
```

We currently offer several providers in the form of **"packs"**. A pack is a piece of code that works with the chosen provider to give Safe users access to new services.

To use one of our packs, add the corresponding pack required packages:

- [Web3Auth](./Web3AuthModalPack.md#install)

### How to use a pack

Start working with one of our packs is as easy as instantiate the main class and and call the common `init()` method afterwards.

```typescript
const pack = new Web3AuthModalPack(packConfig);
await pack.init(packInitOptions);
```

After the initialization, you can use the pack methods to interact with the chosen provider. There are some common methods (`signIn()`, `signOut()`, etc.) that you can use with any pack. It creates a common interface that any pack should implement. Check the abstract class [`AuthKitBasePack`](./AuthKitBasePack.md) for more information.

