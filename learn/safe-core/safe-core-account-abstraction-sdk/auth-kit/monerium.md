# Monerium

The [`MoneriumPack`](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit/src/packs/monerium) allows users to use the Monerium and Safe services together for enable Safe users to make direct transfers of digital money from their Safe addresses to an IBAN using the SEPA network.

More info about Monerium:

- [Monerium](https://monerium.com)
- [Monerium Developers](https://monerium.dev)

### What are we going to learn?

In this section we are going to show how the [`OnRampKit`](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit) works with the `MoneriumPack` and how to integrate it in your web app.

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. [Monerium account and application](https://monerium.dev/docs/getting-started/create-app)
3. A web page. You can use your favorite CLI and language in order to create a web application. Some recommendations are

- [Vite for React projects](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html#vue-create)
- [Angular CLI](https://angular.io/cli/new)

There are several ways to authenticate a web app with Monerium. The MoneriumPack implements the "Authorization code flow with proof key for code exchange (PKCE)". You can read more about it [here](https://monerium.dev/docs/api#authentication).

### Install dependencies

```bash
yarn add @safe-global/onramp-kit @monerium/sdk
```

### Login with Monerium

Create a Login with Monerium integration for the Safe is a multi step process you should implement in your web app.

1. When the application is loaded you should instantiate the `OnRampKit` with the `MoneriumPack` by using the following snippet

```typescript
const onRampKit = await SafeOnRampKit.init(
  new MoneriumPack({
    clientId: { YOUR_CLIENT_ID }, // Get your client id from Monerium
    environment: 'sandbox' | 'production', // Use the proper Monerium environment
  }),
  { safeSdk }
);
```

The `safeSdk` is an instance of the [`Safe`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/protocol-kit/src/Safe.ts) class. More info about how to instantiate the protocol kit [here](https://docs.safe.global/learn/safe-core/safe-core-account-abstraction-sdk/protocol-kit#quickstart)

This snippet will initialize the `OnRampKit` with the `MoneriumPack` and internally will know which is the safe address you want to link to your Monerium account through the `safeSdk` instance sent as parameter.

2. Login with Monerium. Create a button or link in your application for starting the flow using your favorite UI library. Add a handler for starting the login flow and do the following in it.

```typescript
await onRampKit.open({ redirectUrl: 'https://your-site-redirect-url' });
```

This will open the Monerium web page to start the authentication flow to give permissions to access your resources. You should login or create a new account if you don't have one.

⚠️ Is important to know what's going on with this first interaction. A `signMessage` transaction signing the [required Monerium message](https://monerium.dev/api-docs#operation/auth) is going to be proposed to your Safe and executed if:

- The Safe threshold is 1/1
- You have enough funds in the Safe owner (`safeSdk.getSignerAddress()`)

If the owner don't have enough funds or the Safe is a multi owner one then the signer address that started the flow will sign the message but you need to add the remaining signatures in order to execute the transaction.

If you use the `sandbox` environment you can test this flow in `goerli` without having to kyc yourself. In production you can use the `mainnet` environment for `ethereum`, `gnosis` or `polygon` but you need to create an account in the Monerium dashboard and kyc yourself. The `production` environment moves real money while the `sandbox` environment uses fake money and test tokens.

Once the redirection happens and you reach the Monerium web page you can take a look to the URL and check this parameters are included in the query string among others:

- `address`: The safe address you want to bind to your Monerium account
- `signature`: Always "0x". Means the origin wallet is a multisig as the Safe is and Monerium will check for confirmed transactions in your Safe contract.
- `chain`: The Monerium selected chain. The value is automatically calculated using the `safeSdk` instance.
- `network`: The Monerium selected network. The value is automatically calculated using the `safeSdk` instance.
- `redirect_uri`: The `redirectUrl` you sent in the `open` method. Once authenticated the control is returned to this URI.

3. Once the authentication is done following the Monerium prompts a window asking you to give permissions to access your resources is presented. If you accept the permissions the control is returned to the `redirectUrl` you sent in the `open` method.

⚠️ The Monerium authentication process will wait until it detects the Safe address has signed the message and the transaction is confirmed. Sometimes need to reload the Monerium page once you know the transaction is confirmed in order to continue with the flow. You can start it again as well and Monerium will detect the transaction confirmed immediatly. ⚠️

4. Back to the main app. The `redirectUrl` you sent in the `open` is going to be reached again with an extra query string parameter `code`. This is the authorization code you need to exchange in order to gain access to your Monerium account.

Load the auth kit again as in step 1 by using the `init` method and exchange the code:

```typescript
const safeMoneriumClient = await onRampKit.open({ authCode: <The querystring code parameter> });
```

If the code is exchanged without issues then you are now authenticated with Monerium and your Safe is linked !!. You can start using the `safeMoneriumClient` instance to interact with your Monerium account. This instance is basically the Monerium SDK enhanced with some Safe features.

You can check the [Monerium SDK documentation](https://monerium.dev/docs/sdk) to know more about the methods you can use with the `safeMoneriumClient` instance.

Some examples are:

```typescript
const authContext = await moneriumClient.getAuthContext();
const profile = await moneriumClient.getProfile(authContext.defaultProfile);
const balances = await moneriumClient.getBalances();
const orders = await moneriumClient.getOrders();
```

5. As with any authentication system, if you reload the page you probably wish to remain authenticated as long as the tokens are valid. For this flow we have the third way to open the `OnRampKit` instance with the `MoneriumPack`.

Once authenticated in the step 4 you can store the `refresh_token` contained in the `bearerProfile` property in the `safeMoneriumClient`

```typescript
localStorage.setItem(
  'MONERIUM_TOKEN',
  safeMoneriumClient.bearerProfile.refresh_token
);
```

So, if the user abandon the session or refresh the browser, in the next load you should detect and retrieve the stored token and use it to open the `OnRampKit` instance again. Remember to `init` always the kit on the page load.

```typescript
const safeMoneriumClient = await onRampKit.open({
  refreshToken: localStorage.getItem('MONERIUM_TOKEN'),
});
```

6. Now, you are ready to place orders. In the `production` environment real money will be transferred. In the `sandbox` environment fake money will be transferred. If you add funds using the `sandbox` or create a transfer from your bank account to your Monerium IBAN in the `production` environment you will receive the corresponding tokens in your Safe. For example, if your monerium IBAN is associated to the EURe token of your Safe and you send real 10 euros to it then the balance of EURe will be 10 after the transfer is completed through the SEPA system.

For this example you can add some tokens using the `sandbox`. The tokens should be almost instantly available in your Safe. You can check the balance between [your assets](https://app.safe.global/balances)

Once you have tokens, you can create a [`redeem` order](https://monerium.dev/api-docs#operation/post-orders) to burn and convert them to fiat. Add a text box for an IBAN to be entered and a button to place the order. Add a handler for the button and do the following in it.

```typescript
safeMoneriumClient.send({
  amount: '10',
  currency: Currency.eur, // Or the currency you want to redeem. Your Monerium IBAN would be connected only to one token
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

After this your order should try to fly to the destination account. Two things are going to happen:

- A `signMessage` transaction will be proposed to the Safe services under the same conditions as in the step 2. So it will be confirmed and executed depending on the threshold and the owner funds. The message to be signed can be checked in [the api docs](https://monerium.dev/api-docs#operation/post-orders)
- An order is placed into the Monerium system and will listen for the transaction in 1) to be confirmed and executed.

Once the transaction is in the blockchain the token burn and the transfer of real money will start and the order will be completed !!.

7. Listening to events

You probably want to know when the order is completed. For this you can listen to events using the [Monerium API websockets](https://monerium.dev/api-docs#operation/profile-orders-notifications)

We are creating the connection for you and exposing it through the subscribe and unsubscribe methods of the `onRampKit` instance. You can subscribe using it like this:

```typescript
const handler = (notification) => {
  console.log(notification);
};

client.subscribe(OrderState.processed, handler);
```

The possible states are:

```typescript
OrderState {
	placed = "placed",
	pending = "pending",
	processed = "processed",
	rejected = "rejected"
}
```

If you want to unsubscribe you can do it like this:

```typescript
client.unsubscribe(OrderState.processed, handler);
```

### MoneriumPack complete React example

Check a complete [example](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client) in the `safe-core-sdk` repo. Follow the steps in the [`README.md`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client/README.md) to run the example and configure the environment variables for the pack following the [`.env.sample`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client/.env.sample).

```

```
