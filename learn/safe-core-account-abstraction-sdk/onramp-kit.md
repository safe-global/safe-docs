# ⚠️ Warning ⚠️

This package is provided for testing purposes only. It's not ready for production use. We are working with Stripe and participating in the pilot test for their new [crypto on-ramp](https://stripe.com/es/blog/crypto-onramp). Given this, we are offering our public key and a deployed server with our private one during the [Safe Account Abstraction hackaton](https://gnosis-safe.notion.site/Safe-d6c6ed61389041e28f5c7c925f653701)

Once the hackaton and Stripe pilot ends the server will be removed and you should use your own keys and server in case you opt-in for the [StripeAdapter](https://github.com/safe-global/account-abstraction-sdk/blob/195588a4388b15f06b05d2027ffd43185781be34/packages/onramp-kit/src/adapters/StripeAdapter.ts).

Currently this package is only prepared to work with Stripe. See [considerations and limitations](#considerations-and-limitations) for more details.

# OnRamp Kit

This kit provides a way for buy cryptoassets using a credit card or other payment methods. The library give access to several on ramp providers through several adapters.

## Quickstart

### Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- An Stripe account in order to get your own public and private keys. You can create one [here](https://dashboard.stripe.com/register)
- A deployed server like the one provided as [an example](https://github.com/safe-global/account-abstraction-sdk/blob/195588a4388b15f06b05d2027ffd43185781be34/packages/onramp-kit/example/server) in order to communicate with Stripe APIs

> The docs for the latest step (server) are not published yet as Stripe onramp solution is still in pilot testing

### Install dependencies

```bash
npm install @safe-global/onramp-kit
yarn add @safe-global/onramp-kit
```

### How to use

Create an instance of the [SafeOnRampKit](https://github.com/safe-global/account-abstraction-sdk/blob/195588a4388b15f06b05d2027ffd43185781be34/packages/onramp-kit/src/SafeOnRampKit.ts#L1) using `SafeSafeOnRampProviderType` and `SafeOnRampConfig` as parameters.

_With Stripe_

```typescript
import { SafeOnRampKit, SafeOnRampProviderType } from '@safe-global/onramp-kit'

const safeOnRamp = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
  onRampProviderConfig: {
    stripePublicKey: <You public key>, // You should get your own public and private keys from Stripe
    onRampBackendUrl: <Your backend url> // You should deploy your own server
  }
})
```

You can check [this server implementation](https://github.com/safe-global/account-abstraction-sdk/blob/195588a4388b15f06b05d2027ffd43185781be34/packages/onramp-kit/example/server) as an example.

> Currently we are providing both the public key and the server for testing purposes. In the future you will need to use your own public key and server based on the final documentation Stripe will provide once their on ramps solution is ready for production. See the [considerations and limitations](#considerations-and-limitations) section for more details.

Once the instance is created, you can call the `open(SafeOnRampOpenOptions)` method to start the session with the provider and opening the widget.

As an example, you can use the following code:

```typescript
const sessionData = await safeOnRamp.open({
  walletAddress,
  networks: ['polygon']
  element: '#stripe-root',
  sessionId: 'cos_1Mei3cKSn9ArdBimJhkCt1XC', // Optional, if you want to use a specific created session
  events: {
    onLoaded: () => console.log('Loaded'),
    onPaymentSuccessful: () => console.log('Payment successful')
    onPaymentError: () => console.log('Payment failed')
    onPaymentProcessing: () => console.log('Payment processing')
  }
})
```

### Considerations and limitations

1. The library is under development and it's not ready for production use. We are working with Stripe and participating in the pilot testing for their new [on ramp solution](https://stripe.com/es/blog/crypto-onramp)

    Considering this, we provide a public key and a deployed server only available for testing purposes. It can be used like this:

```typescript
const safeOnRamp = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
  onRampProviderConfig: {
    stripePublicKey:
      'pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO', // Safe public key
    onRampBackendUrl: 'https://safe-onramp-backend.5afe.dev', // Safe deployed server
  },
});
```

2. As we are working on Stripe _testmode_, the purchases are simulated. You can use the fake data in the [docs](https://stripe.com/docs/testing) and the [following test cards](https://stripe.com/docs/testing?testing-method=card-numbers#cards) to enter the required information in the embedded widget.

3. When using with testnets as Mumbai in Polygon, the crypto assets will be transferred so PLEASE DO TRY TO USE LOWER AMOUNTS to preserve testnets liquidity, but SPECIALLY WITH USDC ON POLYGON MUMBAI.

4. If you want to deploy a POC with your solution, bear in mind that our integration with Stripe has the following domains whitelisted:

   - localhost: For local development
   - [netlify.app](https://www.netlify.com) and [vercel.app](https://vercel.com) for hosted deployments

    So you can deploy your solution in one of these hosting providers. Using a different domain won't work and the widget will throw an error.

5. Currently the Stripe widget can only be used if you are __based in the United States__. If you are hacking from another country you could use a VPN connecting to an US server.

## Example

[Check a functional demo](https://github.com/safe-global/account-abstraction-sdk/tree/195588a4388b15f06b05d2027ffd43185781be34/packages/onramp-kit/example) using the `onramp-kit` 
