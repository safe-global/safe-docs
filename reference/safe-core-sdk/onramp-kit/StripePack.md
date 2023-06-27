## StripePack

The [Stripe Crypto OnRamp service](https://stripe.com/docs/crypto/overview) allows individuals to securely purchase cryptocurrencies from your application.

### Install dependencies

To use the `StripePack`, you need to install the stripe frontend libraries in addition to the `@safe-global/onramp-kit` package.

```bash
yarn add @stripe/stripe-js @stripe/crypto @safe-global/onramp-kit
```

### Reference

The `StripePack` allow you to use the Stripe Crypto OnRamp services with Safe. You need to create an instance of the pack and pass it to the `SafeOnRampKit` `init` method.

This pack provides a customizable widget for users to purchase cryptocurrencies using Stripe services. It can be rendered in any chosen CSS selector on a webpage.

```typescript
const stripePack = new StripePack(stripeConfig)
await stripePack.init()
```

#### `new StripePack(stripeConfig)`

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

**Caveats**
You should always call the `init()` method afterwards before interacting with the pack.

#### `init()`

The `init` method will load the Stripe scripts using the public key provided in the class instantiation and initialize the Stripe SDK.

#### `open(stripeOpenOptions)`

The `open` method will open the Stripe widget in the chosen slot (css selector) inside a webpage.

**Params**

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

#### `close()`

The `close` method will close the Stripe widget. This method shouldn't be called directly but using the `SafeOnRampKit` `close` method instead.

#### `subscribe(event, handler)`

Subscribe to authentication state changes. Check the [Stripe frontend events](https://stripe.com/docs/crypto/using-the-api#frontend-events) for the list of available events.

**Params**

- `event` - The event you want to subscribe from.
- `handler` - The handler function that will be called when the event is triggered.

#### `unsubscribe(event, handler)`

Unsubscribe from authentication state changes.

**Params**

- `event` - The event you want to unsubscribe from.
- `handler` - The handler function that will be called when the event is triggered.

### Usage

Using the `StripePack` is easy: just instantiate the class and call the `init` method when you load the page or component, followed by the `open(options)` method when you want to start the interaction.

The `open` method renders the Stripe widget.

```typescript
// Instantiate and initialize the pack
const stripePack = new StripePack(stripeConfig)
stripePack.init()

// Open
await stripePack.open(stripePackOpenOptions)

// Subscribe to events
const handler = (event) => {}
stripePack.subscribe('onramp_ui_loaded', handler)
stripePack.unsubscribe('onramp_session_updated', handler)

// Close
await stripePack.close()
```