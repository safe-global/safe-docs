## Stripe

The [Stripe Crypto OnRamp service](https://stripe.com/docs/crypto/overview) allows individuals to purchase cryptocurrencies securely from your platform or Dapp. It is fully customizable and can be easily integrated into your product or service.

### Install

```bash
yarn add @stripe/stripe-js @stripe/crypto @safe-global/onramp-kit
```

### StripePack

The `StripePack` allow you to use the Stripe Crypto OnRamp services with Safe. You need to create an instance of the pack and pass it to the `SafeOnRampKit` `init` method.

This pack provides a customizable widget for users to purchase cryptocurrencies using Stripe services. It can be rendered in any chosen CSS selector on a webpage.

#### `StripePack(stripeConfig)`

```typescript
const stripePack = new StripePack(stripeConfig);
await SafeOnRampKit.init(stripePack);
```

**Params**

- `stripeConfig` - The configuration for the Stripe pack. The options are:

```typescript
StripeConfig {
  stripePublicKey: string
  onRampBackendUrl: string
}
```

The `stripePublicKey` is the public key for your Stripe account. You can get one using [your account](https://stripe.com/docs/keys#obtain-api-keys)

The `onRampBackendUrl` is the URL for the backend that starts a session with Stripe. For more information on how to create the server, refer to the [official documentation](https://stripe.com/docs/crypto/quickstart#init-stripe). You can also check out the example application and server in the [Safe{Core} SDK monorepo](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit/example/server).

**Returns**
An instance of the `StripePack` class implementing the `SafeAuthPack<TPack>` interface for being used with the `SafeOnRampKit`.

⚠️ The following methods shouldn't be called directly but used from the `SafeOnRampKit` instance instead. ⚠️

#### `init()`

The `init` method will load the Stripe scripts using the public key provided using the `SafeOnRampKit`

#### `open(stripeOpenOptions)`

The `open` method will open the Stripe widget in the chosen slot (css selector) inside a webpage.

**params**
The `StripeOpenOptions` options to be passed to the `open` method are:

```typescript
StripeOpenOptions {
  element: string
  sessionId?: string
  theme?: 'light' | 'dark'
  defaultOptions: StripeDefaultOpenOptions
}
```

- `element` - This is the CSS selector for the element where the widget will be displayed.
- `sessionId` - Optionally provide a session ID for the Stripe session. If not provided, the pack will create a new session.
- `theme` - This is an optional theme for the widget. If not specified, the default theme will be applied.
- `defaultOptions`- The default options for the widget are available [here](https://github.com/safe-global/safe-core-sdk/blob/f2e8e82d88d815d7b278f605a125f4cfb2816020/packages/onramp-kit/src/packs/stripe/types.ts#L104-L109). Refer to the [official Stripe docs](https://stripe.com/docs/crypto/using-the-api) for instructions.

#### `subscribe(event, handler)`

Subscribe to authentication state changes. Check the [Stripe frontend events](https://stripe.com/docs/crypto/using-the-api#frontend-events) for the list of available events.

**Params**

- `event` - The event you want to subscribe to.
- `handler` - The handler function that will be called when the event is triggered.

#### `unsubscribe(event, handler)`

Unsubscribe from authentication state changes.

**Params**

- `event` - The event you want to unsubscribe to.
- `handler` - The handler function that will be called when the event is triggered.

#### `close()`

The `close` method will close the Stripe widget. This method shouldn't be called directly but using the `SafeOnRampKit` `close` method instead.
