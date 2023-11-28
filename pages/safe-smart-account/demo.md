This page is taken from https://github.com/5afe/account-abstraction-demo-ui

# Account Abstraction demo app

[The Safe{Core} SDK](https://github.com/safe-global/safe-core-sdk) allows builders to add account abstraction functionality into their apps. This demo is an example on how to use our different packages (Auth Kit, Onramp Kit & Relay Kit).

See the [Safe{Core} Account Abstraction SDK Docs](../safe-core-sdk/overview.md) for more details.

## Installation

To run this project locally:

Install dependencies:

```bash
yarn install
```

Create a `.env` file (see `example.env`)

```
# see https://web3auth.io/docs/developer-dashboard/get-client-id
REACT_APP_WEB3AUTH_CLIENT_ID=

REACT_APP_STRIPE_BACKEND_BASE_URL=https://aa-stripe.safe.global

REACT_APP_STRIPE_PUBLIC_KEY=pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO

```

Run the demo App:

```bash
yarn start
```
