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

A Safe account with three owners and threshold equal three will be used as the starting point for this example but any Safe configuration is valid.

```js
import { ethers } from 'ethers'
import EthersSafe, { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk'

const web3Provider = // ...
const provider = new ethers.providers.Web3Provider(web3Provider)
const signer1 = provider.getSigner(0)
const signer2 = provider.getSigner(1)
const signer3 = provider.getSigner(2)

// Existing Safe address (e.g. Safe created via https://app.gnosis-safe.io)
// Where signer1, signer2 and signer3 are the Safe owners
const safeAddress = "0x<safe_address>"
```

Create an instance of the Safe Core SDK with `signer1` connected as the signer.

```js
const safeSdk = await EthersSafe.create(ethers, safeAddress, signer1)
```

### 1. Create a Safe transaction

```js
const partialTx: SafeTransactionDataPartial = {
  to: '0x<address>',
  data: '0x<data>',
  value: '<eth_value_in_wei>'
}
const safeTransaction = await safeSdk.createTransaction(partialTx)
```

Before executing this transaction, it must be signed by the owners and this can be done off-chain or on-chain. In this example the owner `signer1` will sign it off-chain, the owner `signer2` will sign it on-chain and the owner `signer3` will execute it (the executor also signs the transaction transparently).

### 2.a. Off-chain signatures

The owner `signer1` signs the transaction off-chain.

```js
const signer1Signature = await safeSdk.signTransaction(safeTransaction)
```

Because the signature is off-chain, there is no interaction with the contract and the signature becomes available at `safeTransaction.signatures`.

### 2.b. On-chain signatures

After `signer2` account is connected to the SDK as the signer the transaction hash will be approved on-chain.

```js
const safeSdk2 = await safeSdk.connect(signer2)
const txHash = await safeSdk2.getTransactionHash(safeTransaction)
const approveTxResponse = await safeSdk2.approveTransactionHash(txHash)
await approveTxResponse.wait()
```

### 3. Transaction execution

Lastly, `signer3` account is connected to the SDK as the signer and executor of the Safe transaction to execute it.

```js
const safeSdk3 = await safeSdk2.connect(signer3)
const executeTxResponse = await safeSdk3.executeTransaction(safeTransaction)
await executeTxResponse.wait()
```

All the signatures used to execute the transaction are now available at `safeTransaction.signatures`.

### Who approved the transaction hash?

At any point during this process, calling the method `getOwnersWhoApprovedTx` will return a list of the owners who approved the transaction hash on-chain.

```js
const owners: string[] = await safeSdk.getOwnersWhoApprovedTx(txHash)
```

## Advanced features

For extensive documentation check the [GitHub repository](https://github.com/gnosis/safe-core-sdk).
