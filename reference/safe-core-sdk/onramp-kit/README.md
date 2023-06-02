# OnRamp Kit

The [Onramp kit](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onramp-kit) allow users to access on-ramp services and use them with their Safe's.

These services can be used to buy crypto assets with credit cards or make SEPA transfers between their Safe and bank accounts (Monerium).

### Install dependencies

To add the Onramp kit to your project, run:

```bash
yarn add @safe-global/onramp-kit
```

We currently offer several providers in the form of "packs". A pack is a piece of code that works with the chosen provider to give Safe users access to new services.

To use one of our developed packs, add the required packages.

- [Monerium](./MoneriumPack.md#install)
- [Stripe](./StripePack.md#install)

### How to use a pack

Start working with one of our packs is as easy as instantiate the main class and and call the common `init()` method afterwards.

```typescript
const pack = new MoneriumPack(packConfig);
await pack.init(packInitOptions);
```

After the initialization, you can use the pack methods to interact with the chosen provider. There are some common methods (`open()`, `close()` ...) that you can use with any pack. It creates a common interface that any pack should implement. Check the abstract class [`OnRampKitBasePack`](./OnRampKitBasePack.md) for more information.

