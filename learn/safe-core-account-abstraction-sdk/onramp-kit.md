# ⚠️ Warning ⚠️

This package is provided for testing purposes only. It's not ready for production use. We are working with Stripe and participating in the pilot test for their new [crypto on-ramp](https://stripe.com/docs/crypto). Considering this, we provide a public key and a testing server already configured during the [Safe Account Abstraction hackathon](https://gnosis-safe.notion.site/Safe-d6c6ed61389041e28f5c7c925f653701)

Once the hackathon and Stripe pilot are over, the server will be removed and you should use your own keys and server in case you opt-in for the [StripeAdapter](https://github.com/safe-global/account-abstraction-sdk/blob/main/packages/onramp-kit/src/adapters/stripe/StripeAdapter.ts).

Currently this package is only prepared to work with Stripe. See [considerations and limitations](#considerations-and-limitations) for more details.

# OnRamp Kit

The [Onramp kit](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onramp-kit) allows users to buy cryptocurrencies using a credit card and other payment options.

## Quickstart

### Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Stripe account to get your own public and private keys](https://dashboard.stripe.com/register)
- A deployed server ([example](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onramp-kit/example/server)) for communicating with Stripe APIs

> The docs for the latest step (server) are not published yet as Stripe onramp solution is still in pilot testing

### Install dependencies

```bash
yarn add @safe-global/onramp-kit
```

### How to use

Create an instance of the [SafeOnRampKit](https://github.com/safe-global/account-abstraction-sdk/blob/main/packages/onramp-kit/src/SafeOnRampKit.ts) using `SafeSafeOnRampProviderType` and `SafeOnRampConfig` as parameters.

_With Stripe_

```typescript
import { SafeOnRampKit, SafeOnRampProviderType } from '@safe-global/onramp-kit'

const safeOnRamp = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
  onRampProviderConfig: {
    stripePublicKey: <Your public key>, // You should get your own public and private keys from Stripe
    onRampBackendUrl: <Your backend url> // You should deploy your own server
  }
})
```

You can check [this server implementation](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onramp-kit/example/server) as an example.

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
    onRampBackendUrl: 'https://aa-stripe.safe.global', // Safe deployed server
  },
});
```

2. As we are working on Stripe _testmode_, the purchases are simulated. You must use fake data for KYC process and payments in the Stripe embedded widget. Please use the following dummy data:

- Use any test or fake emails such as `8404.john.smith@example.com`. Emails previously used with the on-ramp (i.e. have a Link account) will trigger a returning user OTP immediately, skipping the sign up screen
- Use `+18004444444` for phone number
- Use `000000` for the OTP verification code
- Use any first name such as `John` but specifically `Verified` for the last name and `01/01/1901` for the birthday for successful identity verification.
- Select Social Security Number for identification type and then enter `000000000` for fill the field
- Select `United States` for country
- Use `address_full_match` for address line 1 for successful identity verification
- Use `Seattle` for city
- Select `Washington` for state
- Use `12345` for zip code
- To receive testnet assets, use a network compatible wallet that you control
- Use test credit card `4242424242424242` with future expiration date `12/24`, any CVC `123`, and any zip code `12345`. You can find more details on testing payment methods [here](https://stripe.com/docs/testing?testing-method=card-numbers#cards).

3. When using testnets such as Polygon Mumbai, the cryptocurrencies will be transferred. PLEASE DO TRY TO USE LOWER AMOUNTS to preserve testnet's liquidity, ESPECIALLY THE USDC TOKEN ON POLYGON MUMBAI.

    In any case, for avoiding this, we limit the amount you can buy to **10 monetary currency units**, so if you try to buy more than that an error will be thrown.

4. If you want to deploy a POC with your solution, bear in mind that our integration with Stripe has the following domains whitelisted:

   - localhost: For local development
   - [netlify.app](https://www.netlify.com) and [vercel.app](https://vercel.com) for hosted deployments

   So you can deploy your solution in one of these hosting providers. Using a different domain won't work and the widget will throw an error.

5. Currently the Stripe widget can only be used if you are **connecting from the United States**. If this is not the case you will receive a load error.

## Example

[Check out a functional demo](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onramp-kit/example) using the `onramp-kit`
