# Integration with Gelato

The [Gelato relay](https://docs.gelato.network/developer-services/relay) allows developers to execute gasless transactions.

## Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm).
2. Have a Safe configured with threshold equal to 1, where only 1 signature is needed to execute transactions.
3. To use Gelato 1Balance an [API key](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance) is required.

## Install dependencies

```bash
yarn add ethers @safe-global/relay-kit @safe-global/protocol-kit @safe-global/safe-core-sdk-types
```

## Relay Kit options

Currently, the Relay Kit is only compatible with the [Gelato relay](https://docs.gelato.network/developer-services/relay). There are 2 different ways to use the Gelato relay:
1. [Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance)
2. [Gelato SyncFee](https://docs.gelato.network/developer-services/relay/quick-start/callwithsyncfee)

## Gelato 1Balance

[Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance) allows you to execute transactions using a prepaid deposit. This can be used to sponsor transactions to other Safes or even to use a deposit on Polygon to pay the fees for a wallet on another chain.

For the 1Balance quickstart tutorial, you will use the Gelato relayer to pay for the gas fees on BNB Chain using the Polygon USDC you've deposited into your Gelato 1Balance account.

For this tutorial you will need a Safe with a threshold of 1 deployed on BNB Chain. You can create one using [Safe{Wallet}](https://app.safe.global/) or the [Protocol Kit](../../protocol-kit/README.md).

### Summary

1. Start with a [1/1 Safe on BNB Chain](https://app.safe.global/transactions/history?safe=bnb:0x6651FD6Abe0843f7B6CB9047b89655cc7Aa78221)
1. [Deposit Polygon USDC into Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance#how-can-i-use-1balance) ([transaction 0xa5f38](https://polygonscan.com/tx/0xa5f388c2d6e0d1bb32e940fccddf8eab182ad191644936665a54bf4bb1bac555))
1. Safe owner [0x6Dbd](https://bscscan.com/address/0x6Dbd26Bca846BDa60A90890cfeF8fB47E7d0f22c) signs a [Safe Transaction 0xd94a](https://safe-transaction-bsc.safe.global/api/v1/multisig-transactions/0xd94abf947f2b14333edff2cbf96e9d26bee9d8357f06c0da7d0849eab97013d8/
) to send 0.0005 BNB and submits it to Gelato
1. [Track the relay request](https://docs.gelato.network/developer-services/relay/quick-start/tracking-your-relay-request) of [Gelato Task ID 0x1bf7](https://relay.gelato.digital/tasks/status/0x1bf7664a1e176472f604bb3840d3d2a5bf56f98b60307961c3f8cee099f1eeb8)
1. [Transaction 0x814d3](https://bscscan.com/tx/0x814d385c0ec036be65663b5fbfb0d8d4e0d35af395d4d96b13f2cafaf43138f9) is executed on the blockchain

### Deposit Polygon USDC into Gelato 1Balance

See: [How can I use 1Balance?](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance#how-can-i-use-1balance)

### Using a Safe account as the Relay App

While using Gelato, you can specify that you only want the relay to allow transactions from specific smart contracts. If one of those smart contracts is a Safe smart contract, you will need to either verify the contract on a block explorer or get the ABI of the contract implementation (not the ABI of the smart contract address). This is because the Safe smart contracts use the [Proxy Pattern](https://medium.com/coinmonks/proxy-pattern-and-upgradeable-smart-contracts-45d68d6f15da), so the implementation logic for your smart contract exists on a different address.

### Import the packages

```typescript
import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'
```
### Initialize the transaction settings

Modify the variables to customize to match your desired transaction settings.

```typescript
// https://chainlist.org
const RPC_URL='https://endpoints.omniatech.io/v1/bsc/mainnet/public'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const safeAddress = '0x...' // Safe from which the transaction will be sent

// Any address can be used for destination. In this example, we use vitalik.eth
const destinationAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const withdrawAmount = ethers.utils.parseUnits('0.005', 'ether').toString()
```

### Create the transaction object

```typescript
// Create a transactions array with one transaction object
const transactions: MetaTransactionData[] = [{
  to: destinationAddress,
  data: '0x',
  value: withdrawAmount
}]
const options: MetaTransactionOptions = {
  isSponsored: true
}
```

### Create the Protocol Kit and Relay Kit instances

```typescript
const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer
})

const safeSDK = await Safe.create({
  ethAdapter,
  safeAddress
})

const relayKit = new GelatoRelayPack(process.env.GELATO_RELAY_API_KEY!)
```

### Prepare the transaction

```typescript
const safeTransaction = await relayKit.createRelayedTransaction({
  safe: safeSDK,
  transactions,
  options
})

const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction)
```

### Send the transaction to the relay

```typescript
const response = await relayKit.executeRelayTransaction(signedSafeTransaction, safeSDK, options)

console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)
```

## Gelato SyncFee

[Gelato SyncFee](https://docs.gelato.network/developer-services/relay/quick-start/callwithsyncfee) allows you to execute a transaction and pay the gas fees directly with funds in your Safe, even if you don't have ETH or the native blockchain token.

For the SyncFee quickstart tutorial, you will use the Gelato relayer to pay for the gas fees on the BNB Chain using the BNB you hold in your Safe. No need to have funds on your signer.

For this tutorial, you will need a Safe with a threshold of one deployed on the BNB Chain. You can create one using [Safe{Wallet}](https://app.safe.global/) or the [Protocol Kit](../../protocol-kit/README.md).

### Import the packages

```typescript
import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'
```

### Initialize the transaction settings

Modify the variables to customize to match your desired transaction settings.

```typescript
// https://chainlist.org
const RPC_URL='https://endpoints.omniatech.io/v1/bsc/mainnet/public'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const safeAddress = '0x...' // Safe from which the transaction will be sent

// Any address can be used for destination. In this example, we use vitalik.eth
const destinationAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const withdrawAmount = ethers.utils.parseUnits('0.005', 'ether').toString()
```

### Create the transaction object

```typescript
// Create a transactions array with one transaction object
const transactions: MetaTransactionData[] = [{
  to: destinationAddress,
  data: '0x',
  value: withdrawAmount
}]
```

### Create the Protocol Kit and Relay Kit instances

```typescript
const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer
})

const safeSDK = await Safe.create({
  ethAdapter,
  safeAddress
})

const relayKit = new GelatoRelayPack()
```

### Prepare the transaction

```typescript
const safeTransaction = await relayKit.createRelayedTransaction({ safe: safeSDK, transactions })

const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction)
```

### Send the transaction to the relay

```typescript
const response = await relayKit.executeRelayTransaction(signedSafeTransaction, safeSDK)

console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)
```
