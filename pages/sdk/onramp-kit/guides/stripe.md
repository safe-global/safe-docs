# Integration with Stripe

The [Stripe Crypto Onramp service](https://stripe.com/docs/crypto/overview) allows individuals to securely purchase cryptocurrencies from your application.

## What are we going to learn?

This guide demonstrates how to use the `StripePack` as part of the [`OnrampKit`](https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit) and incorporate it into your web application.

We are going to learn how to render the Stripe widget into your page. This widget allows the use your own Ethereum address for onramping cryptocurrencies. As [Stripe API](https://stripe.com/docs/crypto/using-the-api) usage [requires a server](https://stripe.com/docs/crypto/quickstart?client=html&lang=node) to start the interaction with their services, we will also be using a [pre-deployed server](https://github.com/5afe/aa-stripe-service) and providing a public key for testing purposes.

![The Stripe widget](https://b.stripecdn.com/docs-statics-srv/assets/crypto-onramp-overview.c4c0682697f2cd4c1c2769c3c5e08506.png)

## Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. [Stripe account to get your own public and private keys](https://dashboard.stripe.com/register)
3. A deployed server ([example](https://github.com/5afe/aa-stripe-service)) for communicating with Stripe APIs.
   We are providing both the public key and the server for testing purposes but you must use your own public key and server in production.

## Install dependencies

```bash
yarn add @safe-global/onramp-kit @stripe/stripe-js @stripe/crypto
```

## Using the `StripePack` in your Web App

The `StripePack` can be used with any frontend framework like React, Vue, Angular or even plain HTML and JavaScript. In this example, we are using it with plain JavaScript.

1. Load the application and initialize the `StripePack` using the following snippet:

```typescript
const stripePack = new StripePack({
  // Get public key from Stripe: https://dashboard.stripe.com/register
  stripePublicKey:
    'pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO',
  // Deploy your own server: https://github.com/5afe/aa-stripe-service
  onRampBackendUrl: 'https://aa-stripe.safe.global'
})
await stripePack.init()
```

2. Add a container in any place in your web page. We choose to add a `div` container with an id of `stripe-root`:

```html
<div id="stripe-root"></div>
```

3. Render the Stripe widget inside the container by providing the CSS selector to the `element` prop in the `open()` method:

```typescript
// See options for using the StripePack open method in:
// https://stripe.com/docs/crypto/using-the-api
const sessionData = await stripePack.open({
  element: '#stripe-root', // Can be any CSS selector
  theme: 'light' // light | dark
  // Optional, if you want to use a specific created session
  // ---
  // sessionId: 'cos_1Mei3cKSn9ArdBimJhkCt1XC',
  // Optional, if you want to specify default options
  // ---
  // defaultOptions: {
  // transaction_details: {
  //   wallet_address: walletAddress,
  //   lock_wallet_address: true
  //   supported_destination_networks: ['ethereum', 'polygon'],
  //   supported_destination_currencies: ['usdc'],
  // },
  // customer_information: {
  //   email: 'john@doe.com'
  // }
})
```

Make sure you include the `element`. Otherwise, you may get the following error:

![Error when Specifying the element ID isn't provided](https://user-images.githubusercontent.com/9806858/228420761-0f24df48-03a1-4fe6-bd59-45cb4d18daf6.png)

You can also specify the default options for the widget. For example, you can specify the default wallet address, supported destination networks, and supported destination currencies. See the [Stripe API documentation](https://stripe.com/docs/crypto/using-the-api) for more details. The default options you specify using the `open` method will be passed through the Stripe API when using our provided server. When you create your own one (you need to do it on your production apps) you should do something similar.

4. Listening to events is important for understanding what's happening around. It helps us to create a proper UI in our web page.

Check the [Stripe frontend events](https://stripe.com/docs/crypto/using-the-api#frontend-events) for the list of available events.

```typescript
const uiLoadedHandler = () => {
  console.log('UI loaded')
}

const sessionUpdatedHandler = (e) => {
  console.log('Session Updated', e.payload)
}

stripePack.subscribe('onramp_ui_loaded', uiLoadedHandler)
stripePack.subscribe('onramp_session_updated', sessionUpdatedHandler)

...

stripePack.unsubscribe('onramp_ui_loaded', uiLoadedHandler)
stripePack.unsubscribe('onramp_session_updated', sessionUpdatedHandler)
```

## Testing my dapp containing the Stripe widget

In production, each customer should pass an individual KYC process but probably you want to test your application before 😊. You can use the following test data for bypass the KYC process while in [test mode](https://stripe.com/docs/test-mode).

| **Field**                   | **Value**                   | **Description**                                             |
| --------------------------- | --------------------------- | ----------------------------------------------------------- |
| **Email**                   | 8404.john.smith@example.com | Use any test or fake emails                                 |
| **Phone Number**            | +18004444444                | Use +18004444444 for phone number                           |
| **OTP Verification Code**   | 000000                      | Use 000000 for the OTP verification code                    |
| **First Name**              | John                        | Use any first name                                          |
| **Last Name**               | Verified                    | Use Verified for the last name                              |
| **Birthday**                | 01/01/1901                  | Use 01/01/1901 for successful identity verification         |
| **Identification Type**     | Social Security Number      | Select Social Security Number for identification type       |
| **Identification Number**   | 000000000                   | Enter 000000000 to fill the identification number field     |
| **Country**                 | United States               | Select United States for country                            |
| **Address Line 1**          | address_full_match          | Use address_full_match for successful identity verification |
| **City**                    | Seattle                     | Use Seattle for city                                        |
| **State**                   | Washington                  | Select Washington for state                                 |
| **Zip Code**                | 12345                       | Use 12345 for zip code                                      |
| **Test Credit Card Number** | 4242424242424242            | Use test credit card 4242424242424242                       |
| **Expiration Date**         | 12/24                       | Use future expiration date 12/24                            |
| **CVC**                     | 123                         | Use any CVC 123                                             |
| **Billing Zip Code**        | 12345                       | Use any zip code 12345 for billing                          |

## Onramp Kit KYC test data - Examples

![KYC Personal info example](https://user-images.githubusercontent.com/9806858/228418052-30b2239a-ca19-4639-9858-4344d3ba7d45.png) ![KYC Address Example](https://user-images.githubusercontent.com/9806858/228418056-48cfa6a6-fde9-4504-a8be-ce91b03c960f.png) ![Payment Method](https://user-images.githubusercontent.com/9806858/228418059-b83b6357-a6b0-4f09-a4b2-3b89767cb4f0.png)

## StripePack complete React example

Check a complete [example](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client) in the `safe-core-sdk` repository. Follow the steps in the [`README.md`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client/README.md) to run the example and configure the environment variables (`VITE_MONERIUM_CLIENT_ID` isn't necessary) for the pack following the [`.env.sample`](https://github.com/safe-global/safe-core-sdk/blob/main/packages/onramp-kit/example/client/.env.sample).
