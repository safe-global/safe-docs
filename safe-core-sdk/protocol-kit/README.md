# Protocol Kit

The [Protocol Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit) enables developers to interact with the [Safe contracts](https://github.com/safe-global/safe-contracts) using a TypeScript interface. This Kit can be used to create new Safe accounts, update the configuration of existing Safes, propose and execute transactions, among other features.

## Quickstart

In this quickstart guide, you will create a 2 of 3 multi-sig Safe and propose and execute a transaction to send some ETH out of this Safe.

For a more detailed guide, including how to integrate with `web3.js`` and more Safe transaction configuration options, see [Guide: Integrating the Protocol Kit and API Kit](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md) and [Protocol Kit Reference](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit#sdk-api).

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. 3 externally-owned accounts with testnet ETH in at least one account

### Install dependencies

First, we'll need to install some dependences from `safe-core-sdk` and the `ethers` library.

To interact with Ethereum and other EVM blockchains in Node, we can either use: web3.js or ethers.js. In this tutorial, we’ll use the ethers.js library. To use `web3js`, see [Instantiate an EthAdapter section in Guide: Integrating the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#instantiate-an-ethadapter).

The Protocol Kit is compatible with ethers v4 and v5, not the latest v6 version so make sure you specify this when installing the SDK.

You can store your environment variables such as private keys in a `.env` file. To read easily from `.env` files, use the `dotenv` library.

```bash
yarn add ethers@5.7.2 @safe-global/protocol-kit \
  @safe-global/api-kit \
  @safe-global/safe-core-sdk-types \
  dotenv
```

Create the `.env` file:

```bash
touch .env
```

Put your signing account private keys into the `.env` file you just created.

```bash
export OWNER_1_PRIVATE_KEY='<PRIVATE_KEY>'
export OWNER_2_PRIVATE_KEY='<PRIVATE_KEY>'
export OWNER_3_PRIVATE_KEY='<PRIVATE_KEY>'
```

Create an `index.ts` file that you will use to run the following code snippets.

```bash
touch index.ts
```

Tip: Use [ts-node](https://github.com/TypeStrong/ts-node) to run a Typescript file in Node.js.

```bash
npx ts-node examples/protocol-kit/index.ts
```

### Initialize Signers, Providers, and EthAdapter

The signers trigger transactions to the Ethereum blockchain or off-chain transactions. The provider connects to the Ethereum blockchain.

You can get a public RPC URL from [Chainlist](https://chainlist.org), however, public RPC URLs can be unreliable so you can also try a dedicated provider like Infura or Alchemy.

For this tutorial, we will be creating a Safe on the Goerli testnet.

```tsx
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'

// https://chainlist.org/?search=goerli&testnets=true
const RPC_URL='https://eth-goerli.public.blastapi.io'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY!, provider)
const owner3Signer = new ethers.Wallet(process.env.OWNER_3_PRIVATE_KEY!, provider)

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})
```

### Initialize the API Kit

The [API Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/api-kit) consumes the [Safe Transaction Service API](https://github.com/safe-global/safe-transaction-service). To start using this library, create a new instance of the `SafeApiKit` class, imported from `@safe-global/api-kit`, and pass the Safe Transaction Service URL for your desired network to the constructor of the `SafeApiKit`.

You will be using Goerli for this tutorial, however, you can also get [service URLs for different networks](https://docs.safe.global/safe-core-api/infrastructure/available-services).

```tsx
import SafeApiKit from '@safe-global/api-kit'

const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 })
```

### Initialize the Protocol Kit

Goerli is a supported network so you don’t need to specify the contract addresses, however, to see how to create a safe on a local or unsupported network, see [Instantiate an EthAdapter](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#instantiate-an-ethadapter).

Safe Factory is used to create Safes. While Safe class represents an instance of a specific Safe account.

```tsx
import { SafeFactory } from '@safe-global/protocol-kit'

const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
```

### Deploy a Safe

Calling the `deploySafe` method will deploy the desired Safe and return a Protocol Kit initialized instance ready to be used. Check the [API Reference](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit#deploysafe) for more details on additional configuration parameters and callbacks.

```tsx
import { SafeAccountConfig } from '@safe-global/protocol-kit'

const safeAccountConfig: SafeAccountConfig = {
  owners: [
    await owner1Signer.getAddress(),
    await owner2Signer.getAddress(),
    await owner3Signer.getAddress()
  ],
  threshold: 2,
  // ... (Optional params)
}

/* This Safe is tied to owner 1 because the factory was initialized with
an adapter that had owner 1 as the signer. */
const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })

const safeAddress = await safeSdkOwner1.getAddress()

console.log('Your Safe has been deployed:')
console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
console.log(`https://app.safe.global/gor:${safeAddress}`)
```

### Send ETH to the Safe

You will send some ETH to this Safe.

```tsx
const safeAddress = safeSdk.getAddress()

const safeAmount = ethers.utils.parseUnits('0.01', 'ether').toHexString()

const transactionParameters = {
  to: safeAddress,
  value: safeAmount
}

const tx = await owner1Signer.sendTransaction(transactionParameters)

console.log('Fundraising.')
console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`)
```

## Making a transaction from a Safe

The first signer will sign and propose a transaction to send 0.005 ETH out of the Safe. Then, the second signer will add their own proposal and execute the transaction since it meets the 2 of 3 thresholds.

At a high level, making a transaction from the Safe requires the following steps:

### Overview

The high-level overview of a multi-sig transaction is PCE: Propose. Confirm. Execute.

1. **First signer proposes a transaction**
   1. Create transaction: define the amount, destination, and any additional data
   2. Perform an off-chain signature of the transaction before proposing
   3. Submit the transaction and signature to the Safe Transaction Service
2. **Second signer confirms the transaction**
   1. Get pending transactions from the Safe service
   2. Perform an off-chain signature of the transaction
   3. Submit the signature to the service
3. **Anyone executes the transaction**
   1. In this example, the first signer executes the transaction
   2. Anyone can get the pending transaction from the Safe service
   3. Account executing the transaction pays the gas fee

### Create a transaction

For more details on what to include in a transaction see [Create a Transaction in the Safe Core SDK Guide](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#4-create-a-transaction).

```tsx
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'

// Any address can be used. In this example you will use vitalik.eth
const destination = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const amount = ethers.utils.parseUnits('0.005', 'ether').toString()

const safeTransactionData: SafeTransactionDataPartial = {
  to: destination,
  data: '0x',
  value: amount
}
// Create a Safe transaction with the provided parameters
const safeTransaction = await safeSdkOwner1.createTransaction({ safeTransactionData })
```

### Propose the transaction

To propose a transaction to the Safe Transaction Service we need to call the `proposeTransaction` method from the API Kit instance.

For a full list and description of the properties that `proposeTransaction` accepts, see [Propose the transaction to the service](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#propose-transaction) in the Safe Core SDK guide.

```tsx
// Deterministic hash based on transaction parameters
const safeTxHash = await safeSdkOwner1.getTransactionHash(safeTransaction)

// Sign transaction to verify that the transaction is coming from owner 1
const senderSignature = await safeSdkOwner1.signTransactionHash(safeTxHash)

await safeService.proposeTransaction({
  safeAddress,
  safeTransactionData: safeTransaction.data,
  safeTxHash,
  senderAddress: await owner1Signer.getAddress(),
  senderSignature: senderSignature.data,
})
```

### Get pending transactions

Recall that you created the `safeService` in [Initialize the API Kit](./#initialize-the-safe-api-kit).

```tsx
const pendingTransactions = await safeService.getPendingTransactions(safeAddress).results
```

### Confirm the transaction: second confirmation

When owner 2 is connected to the application, the Protocol Kit should be initialized again with the existing Safe address the address of the owner 2 instead of the owner 1.

```tsx
// Assumes that the first pending transaction is the transaction you want to confirm
const transaction = pendingTransactions[0]
const safeTxHash = transaction.safeTxHash

const ethAdapterOwner2 = new EthersAdapter({
  ethers,
  signerOrProvider: owner2Signer
})

const safeSdkOwner2 = await Safe.create({
  ethAdapter: ethAdapterOwner2,
  safeAddress
})

const signature = await safeSdkOwner2.signTransactionHash(safeTxHash)
const response = await safeService.confirmTransaction(safeTxHash, signature.data)
```

### Execute the transaction

Anyone can execute the Safe transaction once it has the required number of signatures. In this example, owner 1 will execute the transaction and pay for the gas fees.

```tsx
const safeTransaction = await safeService.getTransaction(safeTxHash)
const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
const receipt = await executeTxResponse.transactionResponse?.wait()

console.log('Transaction executed:')
console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`)
```

### Confirm that the transaction was executed

You know that the transaction was executed if the balance in your Safe changes.

```tsx
const afterBalance = await safeSdk.getBalance()

console.log(`The final balance of the Safe: ${ethers.utils.formatUnits(afterBalance, 'ether')} ETH`)
```

```bash
$ node index.js

Fundraising.

Initial balance of Safe: 0.01 ETH
Buying a car.
The final balance of the Safe: 0.005 ETH
```

### Conclusion

In this quickstart, you learned how to create and deploy a Safe and to propose and then execute a transaction for the Safe.
