# Auth Kit

The [Auth Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/auth-kit) creates or retrieves an Ethereum address and authenticates a blockchain account using an email address, a social media platform or a crypto wallet address.

## Install dependencies

To add the Auth Kit to your project, run:

```bash
yarn add @safe-global/auth-kit
```

The Auth Kit can integrate several providers in the form of **"packs"**. A pack is a piece of code that works with the chosen provider to give Safe users access to new services.

To use each pack, the right package needs to be installed:

- [Web3Auth](./Web3AuthModalPack.md#install)

## How to use a pack

To start working with the packs, instantiate the main class and call the `init()` method afterwards.

```typescript
const pack = new Web3AuthModalPack(packConfig)
await pack.init(packInitOptions)
```

After the initialization, use the methods in the pack to interact with the chosen provider.

There are some common methods (`signIn()`, `signOut()`, etc.) that can be called regardless of the package being used.

The kit creates a common interface that any pack should implement. Check the [`AuthKitBasePack`](./AuthKitBasePack.md) abstract class to get more details.
