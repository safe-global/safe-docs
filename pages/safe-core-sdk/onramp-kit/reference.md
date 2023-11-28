# Reference

The [Onramp Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit) allow users to access on-ramp services and use them with their Safes.

These services can be used to buy crypto assets with credit cards or make SEPA transfers between their Safe and bank accounts (Monerium).

## Install dependencies

To add the Onramp Kit to your project, run:

```bash
yarn add @safe-global/onramp-kit
```
The Onramp Kit can integrate several providers in the form of **"packs"**. A pack is a piece of code that works with the chosen provider to give Safe users access to new services.

To use each pack, the right package needs to be installed:

- [Monerium](./MoneriumPack.md#install)
- [Stripe](./StripePack.md#install)

## How to use a pack

To start working with the packs, instantiate the main class and call the `init()` method afterwards.

```typescript
const pack = new MoneriumPack(packConfig)
await pack.init(packInitOptions)
```

After the initialization, use the methods in the pack to interact with the chosen provider.

Some common methods (`open()`, `close()`, etc.) can be called regardless of the package being used.

The kit creates a common interface that any pack should implement. Check the [`OnRampKitBasePack`](./OnRampKitBasePack.md) abstract class to get more details.
