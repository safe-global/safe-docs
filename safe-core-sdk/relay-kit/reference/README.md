# Relay Kit

The [Relay Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/relay-kit) lets users pay transaction fees (gas fees) using the native blockchain token or ERC-20 tokens. Gas fees can be payed with this kit using any ERC-20 token in your Safe, even if there is no native token balance.

## Install dependencies

To add the Relay Kit to your project, run:

```bash
yarn add @safe-global/relay-kit
```
The Relay Kit can integrate several providers in the form of **"packs"**. A pack is a piece of code that works with the chosen provider to give Safe users access to new services.

To use each pack, the right package needs to be installed:

- [GelatoRelay](./GelatoRelayPack.md#install)

## How to use a pack

To start working with the packs, instantiate the main class.

```typescript
const pack = new GelatoRelayPack(packConfig)
```

After the initialization, use the methods in the pack to interact with the chosen provider.

There are some common methods (`createRelayedTransaction()`, `executeRelayTransaction()`, etc.) that can be called regardless of the package being used.

The kit creates a common interface that any pack should implement. Check the [`RelayKitBasePack`](./RelayKitBasePack.md) abstract class to get more details.