## Monerium

Using the Monerium pack you can leverage the use of Safe with the Monerium services. [Monerium](https://monerium.com) is a regulated platform allowing the use of digital fiat currencies on the blockchain.

### Install

If you choose to work with the MoneriumPack you need to install additional dependencies apart from the `@safe-global/onramp-kit` package.

```bash
yarn add @monerium/sdk
```

### MoneriumPack

The `MoneriumPack` class allow to use the Monerium services with Safe. You need to create an instance of the pack and pass it to the `SafeOnRampKit` `init` method.

This pack allow you to "Login with Monerium" by creating a link between Safe addresses and Monerium accounts. With this pack you will start an authentication flow using the Monerium SDK.

#### `MoneriumPack(moneriumConfig)`

```typescript
const moneriumPack = new MoneriumPack(moneriumConfig);
await SafeAuthKit.init(moneriumPack);
```

**Parameters**

- `moneriumConfig` - The configuration for the Monerium pack. The options are:

```typescript
MoneriumConfig {
  clientId: string
  environment: 'production' | 'sandbox'
}
```

The `clientId` is the client id for your Monerium account. You can get one using [your account](https://monerium.dev) and adding a [new application](https://monerium.dev/docs/getting-started/create-app).

The `environment` is the environment for the Monerium SDK. You can choose between `production` and `sandbox`.

The production environment will use the real Monerium services and the accounts will need to pass a kyc process and real money will be transferred. The sandbox environment will use the Monerium [sandbox services](https://sandbox.monerium.dev) and no kyc is required and no real money will be used.

**Returns**
An instance of the `MoneriumPack` class implementing the `SafeAuthPack<TPack>` interface for being used with the `SafeOnRampKit`.

⚠️ The following methods shouldn't be called directly but used from the `SafeOnRampKit` instance instead. ⚠️

#### `init(moneriumInitOptions)`

The `init` method will initialize the Monerium SDK and the Safe services creating a new instance of the [`SafeMoneriumClient`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/src/packs/monerium/SafeMoneriumClient.ts) class. This class will extend the [`MoneriumClient`](https://github.com/monerium/sdk/blob/main/src/client.ts) class from the Monerium SDK and will add some extra features for use it with the Safe services.

**params**

The `MoneriumInitOptions` options to be passed to the `init` method are:

```typescript
MoneriumInitOptions {
  safeSdk: Safe
}
```

- `safeSdk` - The Safe class instance to be used by the Monerium SDK. You need to add the protocol-kit as a dependency for your project and create an instance of the [`Safe`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/protocol-kit/src/Safe.ts) class.

#### `open(moneriumOpenOptions)`

The `open` method will start the authentication flow with Monerium. It will open a popup window with the Monerium authentication page.

**params**
The `MoneriumOpenOptions` options to be passed to the `open` method are:

```typescript
MoneriumOpenOptions {
  redirectUrl?: string
  authCode?: string
  refreshToken?: string
}
```

- `redirectUrl` - The redirect uri to be used by the Monerium SDK. This uri will be used to redirect the user after the authentication flow is completed.
- `authCode` - The authorization code to be used by the Monerium SDK. This code will be returned as a query parameter (auth_code) after successfully authenticated (Sign In or Sign Up) and can be used to get access to the resources through the Monerium SDK. The typical use case for this should be:

1. Use the open method only with the `redirectUrl` parameter. This will open the Monerium web page for Sign In or Sign Up.
2. After authentication and returned to the calling DApp then use the authCode in the query string to call the open method again with the authCode parameter and authenticate.

- `refreshToken` - The refresh token to be used by the Monerium SDK. This token will be used to get to get access to the resources through the Monerium SDK. The typical use case should be to store it in the browser storage after authenticating using the `authCode` and use it to authenticate in subsequent application openings.

Take a look to [the example](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client) for more information.

**Returns**

- A `SafeMoneriumClient` instance. This instance contain all the methods and properties from the Monerium SDK and some extra methods and properties for use it with the Safe services. You can use them in your application to build any flow you want.
  Take a look to the Monerium SDK [documentation](https://monerium.github.io/sdk/) for more information about all the methods you can use.
  The Monerium SDK will be enhanced with Safe related methods mostly used inside the `MoneriumPack` so you usually don't need to call them directly. The exception will be the `send` method that will be used to place the orders into the Monerium system.
  The `send` method receive an order to be placed:

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

1. Create an redeem order with the proper format so the Monerium SDK can understand it
2. Place the order to Monerium
3. Propose (and execute if 1/1 Safe) a `signMessage` transaction to the Safe services with the required Monerium message to be signed by the Safe owners. Monerium knowing the Safe is a multisig wallet will wait to this order to be confirmed and executed in order to execute the order in their systems.

**Caveats**

- The order we use for evaluating the `authCode` and `refreshToken` is important. Each one open a different flow with Monerium and we evaluate the presence first for the `authCode` and then for the `refreshToken`. So have this in mind and don't use both together expecting to only authenticate.

#### `close()`

The `close` method will clean up things as subscriptions, the socket connection to the Monerium API and browser storage.

#### `subscribe(event, handler)`

Allow to subscribe to [order status changes](https://monerium.dev/api-docs#operation/profile-orders-notifications) using the Monerium API.

**Parameters**

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

**Parameters**

- `event` - The event you want to unsubscribe to.
- `handler` - The handler function that will be called when the event is triggered.
