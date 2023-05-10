# How to integrate Monerium with your Safe

The [`MoneriumPack`](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit/src/packs/monerium) enables Safe users to make direct transfers of digital money from their Safe addresses to an IBAN via the SEPA network. This allows them to use Monerium and Safe services together.

More info about Monerium:

- [Monerium](https://monerium.com)
- [Monerium Developers](https://monerium.dev)

### What are we going to learn?

This guide demonstrates how to use the `MoneriumPack` with the [`OnRampKit`](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit) and incorporate it into your web application.

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. [Monerium account and application](https://monerium.dev/docs/getting-started/create-app)
3. A web application using your favorite CLI and language. We recommend:

- [Vite for React projects](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html#vue-create)
- [Angular CLI](https://angular.io/cli/new)

Monerium offers several authentication methods for web apps. The `MoneriumPack` implements the _Authorization code flow with proof key for code exchange (PKCE)_. Learn more about it [here](https://monerium.dev/docs/api#authentication).

### Install dependencies

```bash
yarn add @safe-global/onramp-kit @monerium/sdk
```

### Login with Monerium

Creating a _Login with Monerium_ integration for the Safe requires a multi-step process that should be implemented in your web app. The following steps are required.

1. Load the application and instantiate the `OnRampKit` with the `MoneriumPack` using the following snippet:

```typescript
const onRampKit = await SafeOnRampKit.init(
  new MoneriumPack({
    clientId: { YOUR_CLIENT_ID }, // Get your client id from Monerium
    environment: 'sandbox', // Use the proper Monerium environment ('sandbox' | 'production')
  }),
  { safeSdk }
);
```

The `safeSdk` is an instance of the [`Safe`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/protocol-kit/src/Safe.ts) class. For more information on how to instantiate the protocol kit refer [here](https://docs.safe.global/learn/safe-core/safe-core-account-abstraction-sdk/protocol-kit#quickstart).

When the `OnRampKit` is initialized this way with the `MoneriumPack`, internally, it will work with the safe address you want to link to your Monerium account, thanks to the `safeSdk` instance sent as a parameter.

2. Start the _Login with Monerium_ flow by creating a button or link in your application. Use your favorite UI library to add a handler and start the login flow. In the button handler you should start the flow by calling the `open` method:

```typescript
await onRampKit.open({ redirectUrl: 'https://your-site-redirect-url' });
```

This action will open the Monerium web page to begin the authentication process and get the permissions to gain access to your resources. You should login or create a new account if you don't have one already.

⚠️ It is important to be aware of what is happening during this initial interaction. A `signMessage` transaction signing the [required Monerium message](https://monerium.dev/api-docs#operation/auth) will be proposed to your Safe and executed in case both of the following conditions are met:

- The Safe threshold is 1/1
- You have sufficient funds in the Safe owner’s account (`safeSdk.getSignerAddress()`)

If the owner doesn't have enough funds or the Safe is a multi-owner one, then the signer address that initiated the flow will sign the message. To confirm and execute, you must also add the remaining signatures in the Safe UI and execute the transaction.

If you use the `sandbox` environment, you can test this flow without KYC in `goerli`. To use the mainnets for `ethereum`, `gnosis` or `polygon` in production, you need to create an account in the Monerium dashboard and complete KYC. The `production` environment involves real money, whereas the `sandbox` environment uses fake money and test tokens.

Once you are redirected to the Monerium web page, take a look at the URL. You will see that the query string includes parameters such as these, among others:

- `address`: The safe address you want to bind to your Monerium account
- `signature`: Always "0x". It means the origin wallet is a multisig, just like the Safe. Monerium will then verify confirmed transactions in your Safe contract
- `chain`: The Monerium selected chain. The value is automatically calculated using the `safeSdk` instance
- `network`: The Monerium selected network. The value is automatically calculated using the `safeSdk` instance
- `redirect_uri`: The `redirectUrl` you sent in the `open` method. Once authenticated, control is returned to the url

3. Once you authenticate through the Monerium UI, a window will appear asking for permission to access your resources. If you accept, control will be returned to the `redirectUrl` you specified in the `open` method.

⚠️ The Monerium UI, during the authentication process will wait until it detects the Safe address has signed the message and the transaction is confirmed. You may need to reload the Monerium UI page once you know the transaction is confirmed in order to continue with the flow. Alternatively, you can start the process again and Monerium will detect the transaction confirmation immediately. ⚠️

4. The `redirectUrl` used in the `open` will be reached again with an extra query string parameter `code`. This is the authorization code you need to exchange in order to gain access to your Monerium account.

Re-initialize the authentication kit using the `init` method and exchange the code, as per Step 1.

```typescript
const safeMoneriumClient = await onRampKit.open({ authCode: <The querystring code parameter> });
```

If the code is exchanged without problems, you are now authenticated with Monerium and your Safe is linked!. You can start using the `safeMoneriumClient` instance to interact with your Monerium account. This instance is an enhanced version of the Monerium SDK, with some additional Safe features.

To learn more about the methods you can use with the `safeMoneriumClient` instance, consult the [Monerium SDK documentation](https://monerium.dev/docs/sdk).

Here are some examples:

```typescript
const authContext = await moneriumClient.getAuthContext();
const profile = await moneriumClient.getProfile(authContext.defaultProfile);
const balances = await moneriumClient.getBalances();
const orders = await moneriumClient.getOrders();
```

5. When you reload a page, you usually want to stay authenticated as long as the tokens are valid. To do this, we have another way to open the `OnRampKit` instance with the `MoneriumPack`.

Once authenticated in step 4, you can store the `refresh_token` found in the `bearerProfile` property of the `safeMoneriumClient` using browser storage methods.

```typescript
localStorage.setItem(
  'MONERIUM_TOKEN',
  safeMoneriumClient.bearerProfile.refresh_token
);
```

If the user abandons the session or refreshes the browser, detect and retrieve the stored token on the next session or page load. Always `init` the `OnRampKit` instance when the page loads.

```typescript
const safeMoneriumClient = await onRampKit.open({
  refreshToken: localStorage.getItem('MONERIUM_TOKEN'),
});
```

6. You're now ready to place orders. In the `production` environment, real funds will be transferred. In the `sandbox` environment, fake money will be used. If you add funds using the `sandbox` or create a transfer from your bank account to your Monerium IBAN in the `production` environment, you'll receive the corresponding tokens in your Safe. For example, if your Monerium IBAN is associated with the EURe token of your Safe, and you transfer 10 euros, the EURe balance of your Safe will be 10 after the SEPA system completes the transfer.

Add tokens to your Safe using the `sandbox`. They should be available almost instantly. You can check the balance of your assets [here](https://app.safe.global/balances) afterwards.

Once you have tokens, you can create a [`redeem` order](https://monerium.dev/api-docs#operation/post-orders) to burn them and convert them to fiat. Include a text box for an IBAN and a button to place the order. Add a handler for the button and do the following:

```typescript
safeMoneriumClient.send({
  amount: '10',
  currency: Currency.eur, // You can redeem the currency of your choice. Your Monerium IBAN will be linked to a single token.
  counterpart: {
    identifier: {
      standard: 'iban',
      iban: 'The IBAN to send the money to',
    },
    details: {
      firstName: 'John',
      lastName: 'Doe',
      country: 'You ISO country code',
    },
  },
  memo: 'Testing Safe-Monerium integration',
});
```

Once you place your order, it will be sent to the destination account. Two things will occur:

- A `signMessage` transaction will be proposed to the Safe services with the same conditions as in step 2. It will be confirmed and executed based on the threshold and the owner funds. To verify the message to be signed, refer to [the API docs](https://monerium.dev/api-docs#operation/post-orders)
- When an order is placed in the Monerium system, it listens for the transaction above to be confirmed and executed

Once the transaction is recorded on the blockchain, the token is burned and the transfer of real money begins, completing the order 🚀.

7. Listening to events is important for understanding what is happening around. It helps us to create a proper UI in our web page.

You probably want to know when the order is completed. For this you can listen to events using the [Monerium API websockets](https://monerium.dev/api-docs#operation/profile-orders-notifications)

Connecting to the socket is easy, just use the `onRampKit` instance's `subscribe` and `unsubscribe` methods. To subscribe, do this:

```typescript
const handler = (notification) => {
  console.log(notification);
};

client.subscribe(OrderState.processed, handler);
```

The potential states are this ones:

```typescript
OrderState {
  placed = "placed",
  pending = "pending",
  processed = "processed",
  rejected = "rejected"
}
```

If you wish to unsubscribe, you can do:

```typescript
client.unsubscribe(OrderState.processed, handler);
```

### MoneriumPack complete React example

Check a complete [example](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client) in the `safe-core-sdk` repo. Follow the steps in the [`README.md`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client/README.md) to run the example and configure the environment variables for the pack following the [`.env.sample`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client/.env.sample).
