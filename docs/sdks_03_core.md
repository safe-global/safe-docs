---
id: sdks_core
title: Safe Core SDK
sidebar_label: Safe Core SDK
---

## Introduction

The Safe Core SDK facilitates the interaction with the [Gnosis Safe contracts](https://github.com/gnosis/safe-contracts).

It only supports Safe contracts `v1.2.0` and `ethers.js` `v5` so far.


## Adding the dependencies

The Safe Core SDK is available as a TS library via npm and can be added to your project with

```bash
npm install @gnosis.pm/safe-core-sdk
```

or

```bash
yarn add @gnosis.pm/safe-core-sdk
```

## Getting Started

### 1. Set up the SDK using `Ethers` or `Web3`

If the app integrating the SDK is using `Ethers` `v5`, create an instance of the `EthersAdapter`. `owner1` is the Ethereum account we are connecting and the one who will sign the transactions.

```js
import { ethers } from 'ethers'
import { EthersAdapter } from '@gnosis.pm/safe-core-sdk'

const web3Provider = // ...
const provider = new ethers.providers.Web3Provider(web3Provider)
const owner1 = provider.getSigner(0)

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signer: owner1
})
```

If the app integrating the SDK is using `Web3` `v1`, create an instance of the `Web3Adapter`.

```js
import Web3 from 'web3'
import { Web3Adapter } from '@gnosis.pm/safe-core-sdk'

const ethAdapterOwner1 = new Web3Adapter({
  web3,
  signerAddress: await owner1.getAddress()
})
```

### 2. Deploy a new Safe

To deploy a new Safe account instantiate the `SafeFactory` class and call the method `deploySafe` with the right params to configure the new Safe. This includes defining the list of owners and the threshold of the Safe. A Safe account with three owners and threshold equal three will be used as the starting point for this example but any Safe configuration is valid.

```js
import { Safe, SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-code-sdk'

const safeFactory = await SafeFactory.create({ ethAdapter })

const owners = ['0x<address>', '0x<address>', '0x<address>']
const threshold = 3
const safeAccountConfig: SafeAccountConfig = { owners, threshold }

const safeSdk: Safe = await safeFactory.deploySafe(safeAccountConfig)
```

The method `deploySafe` executes a transaction from `owner1` account, deploys a new Safe and returns an instance of the Safe Core SDK connected to the new Safe.

Call the method `getAddress`, for example, to check the address of the newly deployed Safe.

```js
const newSafeAddress = safeSdk.getAddress()
```

To instantiate the Safe Core SDK from an existing Safe just pass to it an instance of the `EthAdapter` class and the Safe address. 

```js
import Safe from '@gnosis.pm/safe-core-sdk'

const safeSdk: Safe = await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress })
```

### 3. Create a Safe transaction

```js
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk'

const transactions: SafeTransactionDataPartial[] = [{
  to: '0x<address>',
  value: '<eth_value_in_wei>',
  data: '0x<data>'
}]
const safeTransaction = await safeSdk.createTransaction(...transactions)
```

Before executing this transaction, it must be signed by the owners and this can be done off-chain or on-chain. In this example `owner1` will sign it off-chain, `owner2` will sign it on-chain and `owner3` will execute it (the executor also signs the transaction transparently).

### 3.a. Off-chain signatures

The `owner1` account signs the transaction off-chain.

```js
const owner1Signature = await safeSdk.signTransaction(safeTransaction)
```

Because the signature is off-chain, there is no interaction with the contract and the signature becomes available at `safeTransaction.signatures`.

### 3.b. On-chain signatures

To connect `owner2` to the Safe we need to create a new instance of the class `EthAdapter` passing to its constructor the owner we would like to connect. After `owner2` account is connected to the SDK as a signer the transaction hash will be approved on-chain.

```js
const ethAdapterOwner2 = new EthersAdapter({ ethers, signer: owner2 })
const safeSdk2 = await safeSdk.connect({ ethAdapter: ethAdapterOwner2, safeAddress })
const txHash = await safeSdk2.getTransactionHash(safeTransaction)
const approveTxResponse = await safeSdk2.approveTransactionHash(txHash)
await approveTxResponse.wait()
```

### 4. Transaction execution

Lastly, `owner3` account is connected to the SDK as a signer and executor of the Safe transaction to execute it.

```js
const ethAdapterOwner3 = new EthersAdapter({ ethers, signer: owner3 })
const safeSdk3 = await safeSdk2.connect({ ethAdapter: ethAdapterOwner3, safeAddress })
const executeTxResponse = await safeSdk3.executeTransaction(safeTransaction)
await executeTxResponse.wait()
```

All the signatures used to execute the transaction are now available at `safeTransaction.signatures`.

## Advanced features

For extensive documentation and the API Reference check the [GitHub repository](https://github.com/gnosis/safe-core-sdk).
