# OnRamp Kit

The [Onramp kit](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onramp-kit) allow users to access on-ramp services and use them with their Safe's.

These services can be used to buy crypto assets with credit cards or make SEPA transfers between their Safe and bank accounts (Monerium).

### Install dependencies

```bash
yarn add @safe-global/onramp-kit
```

We currently offer several providers in the form of "packs". A pack is a piece of code that works with the chosen provider to give Safe users access to new services.

To use one of our developed packs, add the required packages.

- [Monerium](./monerium.md/#install)
- [Stripe](./stripe.md/#install)

### SafeOnRampKit

This class offers a common interface for accessing different providers.

```typescript
const pack = new XXXPack(packConfig);
const safeOnRampKit = await SafeOnRampKit.init(pack, initOptions);
```

#### `static init(pack, safeOnRampInitOptions?)`

To create an instance of the [SafeOnRampKit](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/src/SafeOnRampKit.ts), use the `init` static method and specify the desired pack.

```typescript
const safeOnRampKit = await SafeOnRampKit.init(pack, { safeSdk });
```

**Params**

- `pack` - The pack you want to use.
- `safeOnRampInitOptions?` - The required options for each pack. The init options are different for each pack so you should check the pack documentation.

**Returns**
The `SafeOnRampKit` instance enables you to call various methods using the pack.

**Caveats**
Before using the OnRamp Kit, ensure you call the `init` method.

#### `open(options?)`

The `open()` method initiates the interaction with the pack. It can create a widget (e.g. Stripe) or redirect to a website (e.g. Monerium).

After the `init` method, this is the first method you'll use.

```typescript
await safeOnRampKit.open(options?);
```

**Params**

- `options?` - The options for the pack vary. Some require them, while others don't. Check the pack documentation for details.

**Returns**
The outcome of interacting with the pack varies. Refer to the pack's documentation for more information.

#### `close()`

Clean up after interacting with the pack. This method is usually called when you are done using the kit, such as when you leave the page, or when you want to end the interaction with the pack.

```typescript
safeOnRampKit.close();
```

#### `subscribe(event, handler)`

Subscribe to authentication state changes, depending on the package you are using. For more information, refer to the documentation of the chosen pack.

**Params**

- `event` - The event you want to subscribe to.
- `handler` - The handler function that will be called when the event is triggered.

#### `unsubscribe(event, handler)`

Unsubscribe from authentication state changes. The event depends on the package you are using, so read the relevant documentation.

**Params**

- `event` - The event you want to unsubscribe to.
- `handler` - The handler function that will be called when the event is triggered.

### Usage

Using the onRamp kit is easy: just call the `init` method when you load the page or component, followed by the `open(options)` method when you want to start the interaction.

The `open` method starts the interaction with the pack and returns different objects based on the pack you're using.

```typescript
// Instantiate
const safeOnRampKit = await SafeOnRampKit.init(
  new Pack(PackOptions),
  initOptions
);

// Open
const openResponse = await safeOnRampKit.open();

// Subscribe to events
const handler = (event) => {};
safeOnRampKit.subscribe(PackEvent, handler);
safeOnRampKit.unsubscribe(PackEvent, handler);

// Close
await safeOnRampKit.close();
```
