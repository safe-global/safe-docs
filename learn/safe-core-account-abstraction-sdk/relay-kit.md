# Relay Kit

The [Relay Kit](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/relay-kit) allows to abstract users from the transaction fees payment (gas fees) allowing the use of native token or ERC-20 tokens. This will enable you to pay transaction fees directly from funding available in a Safe.

## Quickstart

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm).
2. Have a Safe where only 1 signature is needed to execute transactions.
3. For using Gelato 1Balance [you will need an API key](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance).

### Install dependencies

```bash
yarn add @safe-global/relay-kit
```

### How to use

Currently, the Relay Kit is compatible only with the [Gelato relay](https://docs.gelato.network/developer-services/relay). Gelato provides two ways in order to use their relay, [Gelato SyncFee](https://docs.gelato.network/developer-services/relay/quick-start/callwithsyncfee), and [Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance).

#### Gelato SyncFee

[Gelato SyncFee](https://docs.gelato.network/developer-services/relay/quick-start/callwithsyncfee) is one of the most straightforward ways to use relaying. Using this method you will be able to execute a transaction paying the gas fees directly with funding available in the Safe.

```typescript
import { GelatoRelayAdapter } from '@safe-global/relay-kit'

const relayAdapter = new GelatoRelayAdapter()

relayAdapter.relayTransaction({
  target: '0x...', // the Safe address
  encodedTransaction: '0x...', // Encoded Safe transaction data
  chainId: 5
})
```

#### Gelato 1Balance

[Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance) allows you to execute transactions using a prepaid deposit. This can be used to sponsor transactions to other Safes or even to use a deposit on Polygon to pay the fees for a wallet on another chain.

```typescript
import { GelatoRelayAdapter, MetaTransactionOptions } from '@safe-global/relay-kit'

const relayAdapter = new GelatoRelayAdapter(GELATO_RELAY_API_KEY)

const options: MetaTransactionOptions = {
  isSponsored: true // This parameter is mandatory to use the 1Balance method
}
relayAdapter.relayTransaction({
  target: '0x...', // the Safe address
  encodedTransaction: '0x...', // Encoded Safe transaction data
  chainId: 5,
  options
})
```
