# Onramp Kit

The [Onramp kit](https://github.com/safe-global/safe-core-sdk/blob/aa61f1e6e841594e14edb1acfee54bbf1408100b/packages/onramp-kit) allows users to buy cryptocurrencies using a credit card and other payment options.

## ⚠️ Warning ⚠️

This package is provided for testing purposes only. It's not ready for production use. We are working with Stripe and participating in the pilot test for their new [crypto on-ramp](https://stripe.com/docs/crypto). Considering this, we provide a public key and a testing server already configured during the [Safe Account Abstraction hackathon](https://safe-global.notion.site/Safe-d6c6ed61389041e28f5c7c925f653701)

Once the hackathon and Stripe pilot are over, the server will be removed and you should use your own keys and server if you plan on using the [StripeAdapter](https://github.com/safe-global/safe-core-sdk/blob/aa61f1e6e841594e14edb1acfee54bbf1408100b/packages/onramp-kit/src/packs/stripe/StripeAdapter.ts).

## Quickstart

In this tutorial, we'll create a React component that allows you to enter an Ethereum address and fund it using a credit card. The full code example can be found in the [Safe Space repo](https://github.com/5afe/safe-space) in the [WalletFund.tsx file](https://github.com/5afe/safe-space/blob/onramp-kit-integration/src/scenes/Wallet/WalletFund.tsx) in [PR #8](https://github.com/5afe/safe-space/pull/8). We will also be using a [pre-deployed server](https://github.com/5afe/aa-stripe-service).

### Demo

{% embed url="https://user-images.githubusercontent.com/9806858/228415245-7b18b226-5ef4-4b7d-a4b1-5c9c53f625f5.mp4" %}
[Watch video demo](https://user-images.githubusercontent.com/9806858/228415245-7b18b226-5ef4-4b7d-a4b1-5c9c53f625f5.mp4)
{% endembed %}

![Payment Confirmation](https://user-images.githubusercontent.com/9806858/228415363-024fbfcd-443e-4024-8a2f-56390a09e9d4.png) ![Payment Success](https://user-images.githubusercontent.com/9806858/228415381-cf838ccc-4002-4327-a654-7c9dc2ba68f7.png) ![Transaction proof on the blockchain](https://user-images.githubusercontent.com/9806858/228415378-901931d8-7095-4257-a7ae-5ff67246c297.png)

### Prerequisites

Note: For the duration of the Safe hackathon and Stripe pilot, you can use this tutorial without Steps 2 and 3 for testing purposes.

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. [Stripe account to get your own public and private keys](https://dashboard.stripe.com/register)
3. A deployed server ([example](https://github.com/5afe/aa-stripe-service)) for communicating with Stripe APIs
   1. Currently we are providing both the public key and the server for testing purposes. In the future, you will need to use your own public key and server based on the final documentation Stripe will provide once their on ramps solution is ready for production. See the [considerations and limitations](onramp-kit.md#considerations-and-limitations) section for more details.

> The docs for the latest step (server) are not published yet as Stripe onramp solution is still in pilot testing

### Considerations and limitations

1. The Stripe widget can currently only be used if you are **connecting from the United States**.
2. When using testnets such as Polygon Mumbai, the cryptocurrencies will be transferred on the blockchain. PLEASE TRY TO USE LOWER AMOUNTS to avoid depleting the supply of tokens available on the testnet, ESPECIALLY THE USDC TOKEN ON POLYGON MUMBAI. To avoid depleting the supply, we limit the purchase amount to **10 monetary currency units**.
3. You must use one of the following whitelisted domains:
   1. Local development: localhost
   2. Hosted deployments: [netlify.app](https://www.netlify.com) and [vercel.app](https://vercel.com)

## Using OnrampKit in your Web App

The Onramp kit can be used in any browser based node environment like Reactjs, Vuejs, Angular or even plain HTML and Javascript. In this example, we will be using it in a React App.

### Install dependencies

```bash
yarn add @safe-global/onramp-kit @stripe/stripe-js @stripe/crypto
```

### Using in React

Use the following snippet and call `fundWallet` when the user performs an action:

```typescript
import { SafeOnRampKit, SafeOnRampProviderType, StripeAdapter } from '@safe-global/onramp-kit';

const fundWallet = async function () {
  const safeOnRamp = await SafeOnRampKit.init(
    new StripeAdapter({
      // Get public key from Stripe: https://dashboard.stripe.com/register
      stripePublicKey:
        'pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO',
      // Deploy your own server: https://github.com/5afe/aa-stripe-service
      onRampBackendUrl: 'https://aa-stripe.safe.global',
    })
  );

  // See options for using the StripeAdapter open method in:
  // https://stripe.com/docs/crypto/using-the-api
  const sessionData = await safeOnRamp.open({
    element: '#stripe-root',
    theme: 'light',
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
  });
};
```

Full React code:

Recall:

> The full code example can be found in the [Safe Space repo](https://github.com/5afe/safe-space) in the [WalletFund.tsx file](https://github.com/5afe/safe-space/blob/onramp-kit-integration/src/scenes/Wallet/WalletFund.tsx) in [PR #8](https://github.com/5afe/safe-space/pull/8).

```typescript
import React, { useState } from 'react';
import { SafeOnRampKit, SafeOnRampProviderType, StripeAdapter } from '@safe-global/onramp-kit';

export interface WalletFundProps {
  address: string;
}

function WalletFund() {
  const [address, setAddress] = useState<string>(
    localStorage.getItem('safeAddress') || ''
  );

  function handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAddress(event.target.value);
  }

  const fundWallet = async function () {
    const safeOnRamp = await SafeOnRampKit.init(
      new StripeAdapter({
        // Get public key from Stripe: https://dashboard.stripe.com/register
        stripePublicKey:
          'pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO',
        // Deploy your own server: https://github.com/safe-global/safe-core-sdk/blob/aa61f1e6e841594e14edb1acfee54bbf1408100b/packages/onramp-kit/example/server)
        onRampBackendUrl: 'https://aa-stripe.safe.global',
      })
    );

    // See options for using the StripeAdapter open method in:
    // https://stripe.com/docs/crypto/using-the-api
    const sessionData = await safeOnRamp.open({
      element: '#stripe-root',
      theme: 'light',
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
    });
  };

  return (
    <div id="stripe-root">
      <label>Destination Address</label>
      <input
        className="form-control mb-3"
        value={address}
        onChange={handleAddressChange}
      />
      <button className="btn btn-primary my-2" onClick={fundWallet}>
        Fund Wallet
      </button>
    </div>
  );
}

export default WalletFund;
```

### Specifying the Element ID

Make sure you include `id='stripe-root'` (or any string that matches `element` inside `safeOnRamp.open`) in the HTML for where you want the Stripe widget to be embedded. Otherwise, you may get the following error:

```
Uncaught (in promise) Error: Error trying to create a new Stripe session
at StripeAdapter.open (StripeAdapter.ts:85:1)
at async SafeOnRampKit.open (SafeOnRampKit.ts:50:1)
```

![Error when Specifying the element ID is not provided](https://user-images.githubusercontent.com/9806858/228420761-0f24df48-03a1-4fe6-bd59-45cb4d18daf6.png)

## Onramp Kit KYC Test Data

To complete the KYC process in test mode, you can use the following test data. See [more details on testing payment methods in Stripe](https://stripe.com/docs/testing?testing-method=card-numbers#cards).

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

### Onramp Kit KYC Test Data - Examples

![KYC Personal info example](https://user-images.githubusercontent.com/9806858/228418052-30b2239a-ca19-4639-9858-4344d3ba7d45.png) ![KYC Address Example](https://user-images.githubusercontent.com/9806858/228418056-48cfa6a6-fde9-4504-a8be-ce91b03c960f.png) ![Payment Method](https://user-images.githubusercontent.com/9806858/228418059-b83b6357-a6b0-4f09-a4b2-3b89767cb4f0.png)
