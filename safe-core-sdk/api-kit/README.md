# API Kit

The [API Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/api-kit) facilitates the interaction with the [Safe Transaction Service API](https://github.com/safe-global/safe-transaction-service), allowing to propose and share transactions with the other signers of a Safe, sending the signatures to the service to collect them, getting information about a Safe (like reading the transaction history, pending transactions, enabled Safe modules and guards, etc.), among other features.

## Quickstart

In this guide we will see how to propose transactions to the service and collect the signatures from the owners so they become executable.

For more detailed information, see the guide [Integrating the Protocol Kit and API Kit](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md) and the [API Kit Reference](../../reference/safe-core-sdk//api-kit/).

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. A Safe with several signers


## Install dependencies

To add the API Kit to your project, run:

```bash
yarn add @safe-global/api-kit
```

## Instantiate an EthAdapter

First of all, we need to create an `EthAdapter`, which contains all the required utilities for the SDKs to interact with the blockchain. It acts as a wrapper for [web3.js](https://web3js.readthedocs.io/) or [ethers.js](https://docs.ethers.io/v5/) Ethereum libraries.

Depending on the library used by the Dapp, there are two options:

- [Create an `EthersAdapter` instance](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit/src/adapters/ethers)
- [Create a `Web3Adapter` instance](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit/src/adapters/web3)

Once the instance of `EthersAdapter` or `Web3Adapter` is created, it can be used in the initialization of the API Kit.

```typescript
import { EthersAdapter } from '@safe-global/protocol-kit'

const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL)
const signer = new ethers.Wallet(config.SIGNER_ADDRESS_PRIVATE_KEY, provider)

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer
})
```

## Initialize the API Kit

We need to create an instance of the API Kit.

```typescript
import SafeApiKit from '@safe-global/api-kit'

const safeApiKit = new SafeApiKit({
  txServiceUrl: 'https://safe-transaction-mainnet.safe.global',
  ethAdapter
})
```

## Propose a transaction to the service

Before a transaction can be executed, any of the Safe signers needs to initiate the process by creating a proposal of a transaction. We send this transaction to the service to make it accessible by the other owners so they can give their approbal and sign the transaction as well.

```typescript
import Safe from '@safe-global/protocol-kit'

// Create Safe instance
const safe = await Safe.create({
  ethAdapter,
  safeAddress: config.SAFE_ADDRESS
})

// Create transaction
const safeTransactionData: SafeTransactionDataPartial = {
  to: '0x',
  value: '1', // 1 wei
  data: '0x',
  operation: OperationType.Call
}

const safeTransaction = await safe.createTransaction({ safeTransactionData })

const senderAddress = await signer.getAddress()
const safeTxHash = await safe.getTransactionHash(safeTransaction)
const signature = await safe.signTransactionHash(safeTxHash)

// Propose transaction to the service
await safeApiKit.proposeTransaction({
  safeAddress: await safe.getAddress(),
  safeTransactionData: safeTransaction.data,
  safeTxHash,
  senderAddress,
  senderSignature: signature.data
})
```

## Retrieve the pending transactions

There are different methods in the API Kit available to retrieve pending transactions depending on the situation. To retrieve a transaction given the Safe transaction hash use the uncommented method.

```typescript
const transaction = await service.getTransaction("<SAFE_TX_HASH>")
// const transactions = await service.getPendingTransactions()
// const transactions = await service.getIncomingTransactions()
// const transactions = await service.getMultisigTransactions()
// const transactions = await service.getModuleTransactions()
// const transactions = await service.getAllTransactions()
```

## Confirm the transaction

In this step we need to sing the transaction with the Protocol Kit and submit the signature the the Safe Transaction Service using the `confirmTransaction` method.

```typescript
const safeTxHash = transaction.transactionHash
const signature = await safe.signTransactionHash(safeTxHash)

// Confirm the Safe transaction
const signatureResponse = await service.confirmTransaction(safeTxHash, signature.data)
```

The Safe transaction is now ready to be executed. This can be done using the Safe{Wallet} web interface, the Protocol Kit or any other tool that is available.
