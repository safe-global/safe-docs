## Stripe

Using the [Stripe Crypto OnRamp](https://stripe.com/docs/crypto/overview) services you can enable individuals to securely purchase cryptocurrencies directly from your platform or Dapp. The onramp is fully customizable and you can integrate it into your product or service.

### Install

If you choose to work with the Stripe pack you need to install additional dependencies apart from the `@safe-global/onramp-kit` package.

```bash
yarn add @stripe/stripe-js @stripe/crypto
```

### StripePack

The `StripePack` allow you to use the Stripe Crypto OnRamp services with Safe. You need to create an instance of the pack and pass it to the `SafeOnRampKit` `init` method.

This pack will allow to show a customizable widget to the user to purchase cryptocurrencies using Stripe services. The widget will be rendered in chosen slot (css selector) inside a webpage.

#### `StripePack(stripeConfig)`

```typescript
const stripePack = new Web3AuthModalPack(stripeConfig);
await SafeAuthKit.init(stripePack);
```

**Parameters**

- `stripeConfig` - The configuration for the Stripe pack. The options are:

```typescript
StripeConfig {
  stripePublicKey: string
  onRampBackendUrl: string
}
```

The `stripePublicKey` is the public key for your Stripe account. You can get one using [your account](https://stripe.com/docs/keys#obtain-api-keys)

The `onRampBackendUrl` is the url for the backend that will be used to start a session with Stripe. You can get more information about how to create the server in the [official documentation](https://stripe.com/docs/crypto/quickstart#init-stripe). You can as well check the example application and server in the [Safe{Core} monorepo](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit/example/server)

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

- The `element` is the css selector for the element where the widget will be rendered.
- `sessionId` is the session id for the Stripe session. This is optional and if not provided the pack will create a new session instead.
- `theme` is the theme for the widget. This is optional and if not provided the default theme will be used.
- `defaultOptions` are the default options for the widget. The options can be checked [here](https://github.com/safe-global/safe-core-sdk/blob/f2e8e82d88d815d7b278f605a125f4cfb2816020/packages/onramp-kit/src/packs/stripe/types.ts#L104-L109) and the instructions in the [official Stripe docs](https://stripe.com/docs/crypto/using-the-api)

#### `close()`

The `close` method will close the Stripe widget. This method shouldn't be called directly but using the `SafeOnRampKit` `close` method instead.

#### `subscribe(event, handler)`

Allow to subscribe to authentication state changes. Check the [stripe documentation](https://stripe.com/docs/crypto/using-the-api#frontend-events) for the list of available events.

**Parameters**

- `event` - The event you want to subscribe to.
- `handler` - The handler function that will be called when the event is triggered.

#### `unsubscribe(event, handler)`

Allow to unsubscribe to authentication state changes.

**Parameters**

- `event` - The event you want to unsubscribe to.
- `handler` - The handler function that will be called when the event is triggered.
