## Monerium

The Monerium pack enables you to take advantage of Safe with Monerium services. [Monerium](https://monerium.com) is a regulated platform that facilitates the use of e-money tokens on the blockchain.

### Install

If you choose to use the `MoneriumPack`, you must install additional dependencies in addition to the `@safe-global/onramp-kit` package.

Install the `@monerium/sdk` package:

```bash
yarn add @monerium/sdk
```

### MoneriumPack

The `MoneriumPack` class enables the use of Monerium services with Safe. To use it, create an instance of the pack and pass it to the `SafeOnRampKit` `init` method.

This pack makes possible to "Login with Monerium" by creating a connection between your Safe address and your Monerium account. Using this pack you will start an authentication flow using the Monerium SDK which will allow you to gain access to your account resources.

#### `new MoneriumPack(moneriumConfig)`

```typescript
const moneriumPack = new MoneriumPack(moneriumConfig);
await SafeAuthKit.init(moneriumPack);
```

**Params**

- `moneriumConfig` - The configuration for the Monerium pack. The options are:

```typescript
MoneriumConfig {
  clientId: string
  environment: 'production' | 'sandbox'
}
```

The `clientId` is the secret representing the "Authorization Code Flow" for your Monerium account. You can obtain one by logging into [your account](https://monerium.dev) and creating a [new application](https://monerium.dev/docs/getting-started/create-app).

The `environment` is the environment for the Monerium SDK. You can choose between `production` and `sandbox`.

The `production` environment will use the production Monerium services and the accounts will need to go through a KYC process. Real money will be transferred. The sandbox environment will use the Monerium [sandbox services](https://sandbox.monerium.dev) and no KYC is required. Fake money will be used.

**Returns**
An instance of the `MoneriumPack` class implementing the `SafeAuthPack<TPack>` interface for being used alongside the `SafeOnRampKit`.

⚠️ The following methods shouldn't be called directly but used from the `SafeOnRampKit` instance instead. ⚠️

#### `init(moneriumInitOptions)`

The `init` method initializes the Monerium SDK and the Safe services by creating a new instance of the [`SafeMoneriumClient`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/src/packs/monerium/SafeMoneriumClient.ts) class. This class extends the [`MoneriumClient`](https://github.com/monerium/sdk/blob/main/src/client.ts) class from the Monerium SDK and adds extra features to use it with the Safe services.

**Params**

The `MoneriumInitOptions` options to be passed to the `init` method are:

```typescript
MoneriumInitOptions {
  safeSdk: Safe
}
```

- `safeSdk` - To use the `MoneriumPack`, you need to add protocol-kit as a dependency for your project and create an instance of the [`Safe`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/protocol-kit/src/Safe.ts) class.

#### `open(moneriumOpenOptions)`

The `open()` method initiates the authentication process with Monerium. It opens a popup window with the Monerium authentication page.

**Params**

The `MoneriumOpenOptions` options to be passed to the `open` method are:

```typescript
MoneriumOpenOptions {
  redirectUrl?: string
  authCode?: string
  refreshToken?: string
}
```

- `redirectUrl` - The Monerium SDK requires a redirect URL. This URI will be used to send the user back to the app after they complete the authentication process.
  If you Use the open method with the `redirectUrl` parameter alone. This will open the Monerium web page for Sign In or Sign Up.

- `authCode` - This code is returned as a query parameter (auth_code) after a user has successfully signed in or signed up. The typical use case for this code is to gain access to the resources (Get a token) through the Monerium SDK. Once authenticated, the dApp can call again the `open()` method with then `authCode` obtained from the query string

- `refreshToken` - This token will be used to get to get access to the resources through the Monerium SDK. The typical use case should be to store it in the browser storage after authenticating using the `authCode` and use it to authenticate in subsequent application openings by calling the `open()` method with the `refreshToken` alone.

Take a look to [the example](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client) for more information.

**Returns**

A `SafeMoneriumClient` instance. This instance contains all the methods and properties from the Monerium SDK, plus some extra ones for using the Safe services. You can use them in your application to create any flow you need.

For more information about the methods available, refer to the Monerium SDK [documentation](https://monerium.github.io/sdk/).

The Monerium SDK will be enhanced with Safe-related methods, mainly used in the `MoneriumPack` so you won't need to call them directly. The exception will be the `send()` method, which is used to place the orders in the Monerium system.

The `send(safeMoneriumOrder)` you can access as a property in the `SafeMoneriumClient` instance method takes an order to be placed:

```typescript
SafeMoneriumOrder {
  safeAddress: string
  amount: string
  currency: Currency
  counterpart: Counterpart
  memo: string
}
```

And will do the following:

1. Creates a `redeem` order with the correct format for the Monerium SDK to understand
2. Place the order to Monerium
3. Propose a `signMessage` transaction to the Safe services with the required Monerium message to be signed and executed. Monerium systems are aware that the Safe is a multisig wallet and will wait for this order to be confirmed and executed before carrying out the order in their systems.

**Caveats**

- The order we use internally in the SDK for evaluating the `redirectUrl`, `authCode` and `refreshToken` is important. Each property opens a different flow with Monerium and we evaluate the presence of the `authCode`, then the `refreshToken` and `redirectUrl` as default. So have this in mind if you use all of them together in yout app

#### `subscribe(event, handler)`

You can subscribe to [order status changes](https://monerium.dev/api-docs#operation/profile-orders-notifications) through the Monerium API.

**Params**

- `event` - The event you want to subscribe to. You can choose between one of the following:

```typescript
MoneriumEvent {
	placed = "placed",
	pending = "pending",
	processed = "processed",
	rejected = "rejected"
}
```

- `handler` - The handler function that will be called when the event is triggered.

#### `unsubscribe(event, handler)`

Allow to unsubscribe to authentication state changes.

**Params**

- `event` - The event you want to unsubscribe to.
- `handler` - The handler function that will be called when the event is triggered.

#### `close()`

The `close` method will clean up the socket, subscriptions and browser storage.
