# Integration with Monerium

The [`MoneriumPack`](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit/src/packs/monerium) enables Safe users to make direct transfers of e-money tokens from their Safe accounts to an IBAN via the SEPA network. This allows them to use Monerium and Safe services together.

More info about Monerium:

- [Monerium](https://monerium.com)
- [Monerium Developers](https://monerium.dev)

## What are we going to learn?

This guide demonstrates how to use the `MoneriumPack` as part of the [`OnRampKit`](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit) and incorporate it into your web application.

## Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. [Monerium account and application](https://monerium.dev/docs/getting-started/create-app)
3. A web application using your favorite CLI and language. For example:

- [Vite for React projects](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html#vue-create)
- [Angular CLI](https://angular.io/cli/new)

Monerium offers several authentication methods for web apps. The `MoneriumPack` implements the _[Authorization code flow with proof key for code exchange (PKCE)](https://monerium.dev/docs/api#authentication)_.

## Install dependencies

```bash
yarn add @safe-global/onramp-kit @safe-global/protocol-kit @monerium/sdk
```

## Login with Monerium

Creating a _Login with Monerium_ integration for the Safe requires a multi-step process that should be implemented in your web app. The following steps are required.

1. Load the application and initialize the `MoneriumPack` using the following snippet:

```typescript
import { MoneriumPack } from '@safe-global/onramp-kit'

const moneriumPack = new MoneriumPack({
  clientId: { YOUR_CLIENT_ID }, // Get your client id from Monerium
  redirectUrl: 'https://your-site-redirect-url' // return URL after authenticating in Monerium
  environment: 'sandbox' // Use the proper Monerium environment ('sandbox' | 'production')})
})

await moneriumPack.init({ protocolKit })
```

The `protocolKit` is an instance of the [`Safe`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/protocol-kit/src/Safe.ts) class. For more information on how to instantiate the `protocol-kit` refer to the [Protocol Kit Quickstart section](../../protocol-kit.md).

The `MoneriumPack` will use the Safe account address configured in the `protocolKit` to link to your Monerium account.

1. Start the _Login with Monerium_ flow by creating a button or link in your application. Use your favorite UI library to add a handler and start the login flow. In the button handler you should start the flow by calling the `open` method:

```typescript
await moneriumPack.open({ initiateAuthFlow: true })
```

This action will open the Monerium web page to begin the authentication process and get the permissions to gain access to your information.

Take a look to the Monerium web page URL. You will see that the query string includes parameters such as these, among others:

- `address`: The Safe address you want to bind to your Monerium account.
- `signature`: Always "0x." It means the origin wallet is a multisig, just like the Safe. Monerium will then verify for onchain signatures in your Safe contract.
- `chain`: The Monerium selected chain. The value is automatically calculated using the `protocolKit` instance.
- `network`: The Monerium selected network. The value is automatically calculated using the `protocolKit` instance.
- `redirect_uri`: The `redirectUrl` you sent in the `MoneriumPack` constructor. Once authenticated Monerium dashboard will redirect to that URL.

⚠️ It's important to be aware of what's happening during this initial interaction. A `signMessage` transaction accepting the [required Monerium message](https://monerium.dev/api-docs#operation/auth) will be proposed to your Safe the first time you try to link your Safe address. To confirm and execute it, you must also add the remaining signatures in the Safe UI and execute the transaction.

Once you are in the Monerium web page, you should login or create a new account if you don't have one already.

After that, the Monerium UI, will wait until it detects the Safe address has signed the message as explained above and the transaction is executed. You may need to reload the Monerium UI page once you know the transaction was executed in order to continue with the flow. Alternatively, you can start the process again and Monerium will detect the transaction confirmation immediately.

Note. If you use the `sandbox` environment, you can test this flow without KYC in `Goerli`. To use the mainnets for `ethereum`, `gnosis` or `polygon` in production, you need to create an account in the Monerium dashboard and complete KYC. The `production` environment involves real money, whereas the `sandbox` environment uses fake money and test tokens.

3. Once you authenticate through the Monerium UI, a window will appear asking for permission to access your information. If you accept, control will be returned to the `redirectUrl` you specified in the `MoneriumPack` constructor.

4. Once we reach the `redirectUrl` we can call open again, now without using arguments.

```typescript
const safeMoneriumClient = await moneriumPack.open()
```

If the process was successful, you will be now authenticated with Monerium and your Safe will be linked!. You can start using the `safeMoneriumClient` instance to interact with your Monerium account. This instance is an enhanced version of the Monerium SDK, with some additional Safe features.

To learn more about the methods you can use with the `safeMoneriumClient` instance, check the [Monerium SDK documentation](https://monerium.dev/docs/sdk).

Here are some examples:

```typescript
const authContext = await moneriumClient.getAuthContext()
const profile = await moneriumClient.getProfile(authContext.defaultProfile)
const balances = await moneriumClient.getBalances()
const orders = await moneriumClient.getOrders()
```

5. When you reload a page, you usually want to stay authenticated as long as the tokens are valid. To do this, just call the `open()` method without arguments.

6. You are now ready to place orders. In the `production` environment, real funds will be transferred. In the `sandbox` environment, fake money will be used. If you add funds using the `sandbox` or create a transfer from your bank account to your Monerium IBAN in the `production` environment, you'll receive the corresponding tokens in your Safe. For example, if your Monerium IBAN is associated with the EURe token of your Safe, and you transfer 10 euros, the EURe balance of your Safe will be 10 after the SEPA system completes the transfer.

Add tokens to your Safe using the `sandbox`. They should be available almost instantly. You can check the balance of your assets [here](https://app.safe.global/balances) afterwards.

Once you have tokens, you can create a [`redeem` order](https://monerium.dev/api-docs#operation/post-orders) to burn them and convert them to fiat. Include a text box for an IBAN and a button to place the order. Add a handler for the button and do the following:

```typescript
safeMoneriumClient.send({
  amount: '10',
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
  memo: 'Testing Safe-Monerium integration'
})
```

Once you place your order, it will be sent to the destination account. Two things will occur:

- A `signMessage` transaction will be proposed to the Safe services indicating in the message the amount of tokens to burn and the destination IBAN. To verify the message to be signed, refer to [the API docs](https://monerium.dev/api-docs#operation/post-orders).
  You should confirm and execute it using the Safe UI or an alternative method as the transaction data is returned in the `send()` call.
- An order is placed in the Monerium system, it listens for the `signMessage` transaction above to be confirmed and executed.

Once the transaction is recorded on the blockchain, the token is burned and the transfer of real money begins, completing the order 🚀.

7. Listening to events is important for understanding what's happening around. It helps us to create a proper UI in our web page.

You probably want to know when the order is completed. For this you can listen to events using the [Monerium API web sockets](https://monerium.dev/api-docs#operation/profile-orders-notifications)

Connecting to the socket is easy, just use the `moneriumPack` instance along with the `subscribe()` and `unsubscribe()` methods. 

To subscribe, do this:

```typescript
const handler = (notification) => {
  console.log(notification)
}

moneriumPack.subscribe(OrderState.processed, handler)
```

The potential states are this ones:

```typescript
OrderState {
  placed = 'placed',
  pending = 'pending',
  processed = 'processed',
  rejected = 'rejected'
}
```

If you wish to unsubscribe, you can do:

```typescript
moneriumPack.unsubscribe(OrderState.processed, handler)
```

## MoneriumPack complete React example

Check a complete [example](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client) in the `safe-core-sdk` repository. Follow the steps in the [`README.md`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client/README.md) to run the example and configure the environment variables for the pack following the [`.env.sample`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client/.env.sample).
