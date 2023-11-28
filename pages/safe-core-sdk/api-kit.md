# API Kit

The [API Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/api-kit) facilitates the interaction with the [Safe Transaction Service API](https://github.com/safe-global/safe-transaction-service), allowing to propose and share transactions with the other signers of a Safe, sending the signatures to the service to collect them, getting information about a Safe (like reading the transaction history, pending transactions, enabled Modules and Guards, etc.), among other features.

## Quickstart

In this guide we will see how to propose transactions to the service and collect the signatures from the owners so they become executable.

For more detailed information, see the guide [Integrating the Protocol Kit and API Kit](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md) and the [API Kit Reference](./reference/README.md).

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. A Safe with several signers


## Install dependencies

To add the API Kit to your project, run:

```bash
yarn add @safe-global/api-kit
```

## Instantiate an EthAdapter

First of all, we need to create an `EthAdapter`, which contains all the required utilities for the SDKs to interact with the blockchain. It acts as a wrapper for [web3.js](https://web3js.readthedocs.io/) or [ethers.js](https://docs.ethers.org/v6/) Ethereum libraries.

Depending on the library used by the dapp, there are two options:

- [Create an `EthersAdapter` instance](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit/src/adapters/ethers)
- [Create a `Web3Adapter` instance](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit/src/adapters/web3)

Once the instance of `EthersAdapter` or `Web3Adapter` is created, it can be used in the initialization of the API Kit.

```typescript
import { EthersAdapter } from '@safe-global/protocol-kit'

const provider = new ethers.JsonRpcProvider(config.RPC_URL)
const signer = new ethers.Wallet(config.SIGNER_ADDRESS_PRIVATE_KEY, provider)

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer
})
```

## Initialize the API Kit

We need to create an instance of the API Kit. In chains where Safe provides a Transaction Service, it's enough to specify the `chainId`. You can set your own service using the optional `txServiceUrl` parameter.

```typescript
import SafeApiKit from '@safe-global/api-kit'

const safeApiKit = new SafeApiKit({
  chainId: 1n
})


// or using a custom service
const safeApiKit = new SafeApiKit({
  chainId: 1n, // set the correct chainId
  txServiceUrl: 'https://url-to-your-custom-service'
})
```

## Propose a transaction to the service

Before a transaction can be executed, any of the Safe signers needs to initiate the process by creating a proposal of a transaction. We send this transaction to the service to make it accessible by the other owners so they can give their approval and sign the transaction as well.

```typescript
import Safe from '@safe-global/protocol-kit'

// Create Safe instance
const protocolKit = await Safe.create({
  ethAdapter,
  safeAddress: config.SAFE_ADDRESS
})

// Create transaction
const safeTransactionData: MetaTransactionData = {
  to: '0x',
  value: '1', // 1 wei
  data: '0x',
  operation: OperationType.Call
}

const safeTransaction = await protocolKit.createTransaction({ transactions: [safeTransactionData] })

const senderAddress = await signer.getAddress()
const safeTxHash = await protocolKit.getTransactionHash(safeTransaction)
const signature = await protocolKit.signTransactionHash(safeTxHash)

// Propose transaction to the service
await safeApiKit.proposeTransaction({
  safeAddress: await protocolKit.getAddress(),
  safeTransactionData: safeTransaction.data,
  safeTxHash,
  senderAddress,
  senderSignature: signature.data
})
```

## Retrieve the pending transactions

Different methods in the API Kit are available to retrieve pending transactions depending on the situation. To retrieve a transaction given the Safe transaction hash use the uncommented method.

```typescript
const transaction = await service.getTransaction("<SAFE_TX_HASH>")
// const transactions = await service.getPendingTransactions()
// const transactions = await service.getIncomingTransactions()
// const transactions = await service.getMultisigTransactions()
// const transactions = await service.getModuleTransactions()
// const transactions = await service.getAllTransactions()
```

## Confirm the transaction

In this step we need to sign the transaction with the Protocol Kit and submit the signature to the Safe Transaction Service using the `confirmTransaction` method.

```typescript
const safeTxHash = transaction.transactionHash
const signature = await protocolKit.signTransactionHash(safeTxHash)

// Confirm the Safe transaction
const signatureResponse = await safeApiKit.confirmTransaction(safeTxHash, signature.data)
```

The Safe transaction is now ready to be executed. This can be done using the Safe{Wallet} web interface, the Protocol Kit or any other tool that's available.
