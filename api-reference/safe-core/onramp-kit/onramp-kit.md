# OnRamp Kit

The [Onramp kit](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onramp-kit) allows users to buy cryptocurrencies using a credit card and other payment options.

### Install dependencies

```bash
yarn add @safe-global/onramp-kit
```

Currently we support these OnRamp providers delivered as "packs". To add the pack you want to use you should add the proper packages:

- [Monerium](./monerium.md/#install)
- [Stripe](./stripe.md/#install)

### SafeOnRampKit

Create an instance of the [SafeOnRampKit](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/src/SafeOnRampKit.ts)

For creating an instance of the OnRamp Kit you need to use the static method `init` and use the chosen pack.

```typescript
SafeOnRampKit.init(pack);
```

### Reference

#### `init(pack, safeSdk)`

Call the `init` method to create an instance of the OnRamp Kit.

```typescript
const safeOnRampKit = await SafeOnRampKit.init(pack, safeSdk?);
```

**Parameters**

- `pack` - The pack you want to use.
- `safeSdk?` - The Safe SDK instance. This is an instance of the [protocol kit](https://github.com/safe-global/safe-core-sdk/blob/main/packages/protocol-kit/src/Safe.ts) and some packs can require it (e.g Monerium)

**Returns**
The SafeOnRampKit instance allowing the different methods to be called using the pack.

**Caveats**
You should always call the `init` method before interacting with the OnRamp Kit.

#### `open(options?)`

The open method starts the interaction with the pack. It can do different things as creating a widget (e.g Stripe) or redirecting to a website (e.g Monerium).

This is the first method you are going to use after the `init` method.

```typescript
await safeOnRampKit.open(options?);
```

**Parameters**

- `options?` - The options for the pack. Some packs can require it and some others don't. The options are different for each pack so you should check the pack documentation.

**Returns**
The result of the interaction with the pack. It can be different depending on the pack. Check the corresponding pack documentation.

#### `close()`

Make some cleanup after the interaction with the pack. Typically this method is called when you stop using the kit as on page leaving or when you want to stop the interaction with the pack.

```typescript
safeOnRampKit.close();
```

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

Using the onramp kit is as simple as calling the `init` method and then the `open(options)` method. The `open` method will start the interaction with the pack and will return different objects depending on the pack you are using.

```typescript
// Instantiate
const safeOnRampKit = await SafeOnRampKit.init(new Pack(PackOptions, safeSdk));

// Open
const openResponse = await safeOnRampKit.open();

// Subscribe to events
const handler = (event) => {};
safeOnRampKit.subscribe(PackEvent, handler);
safeOnRampKit.unsubscribe(PackEvent, handler);

// Close
await safeOnRampKit.close();
```

### TroubleShooting
