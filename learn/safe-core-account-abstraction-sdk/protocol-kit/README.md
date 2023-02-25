# Protocol Kit

The Protocol Kit uses the [Safe Core SDK](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk) to interact with [Safe contracts](https://github.com/safe-global/safe-contracts) using a Typescript interface. This SDK can be used to create new Safe accounts, update the configuration of existing Safes, and propose and execute transactions.

## Quickstart

In this quickstart, you will create a 2 of 3 multi-sig Safe and propose and execute a transaction to send some ETH out of this Safe.

For a more detailed guide, including how to integrate with web3js and more Safe transaction configuration options, see [Guide: Integrating the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md) and [Safe Core SDK API Reference](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk#sdk-api).

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. [3 Signing Accounts with testnet ETH in at least one account](https://docs.gnosis-safe.io/learn/quickstart)

### Install Dependencies

To interact with Ethereum and other EVM blockchains in Node, we can either use: web3.js or ethers.js. In this tutorial, we’ll use the ethers.js library. To use `web3js`, see [Instantiate an ETHAdapter section in Guide: Integrating the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#instantiate-an-ethadapter).

The Safe Core SDK is compatible with ethers v4 and v5, not the latest v6 version so make sure you specify this when installing the SDK.

```bash
yarn add ethers@5.7.2
```

We'll store our environment variables such as Ethereum addresses in `.env` files so let's use `dotenv`:

```bash
yarn add dotenv
touch .env
```

Put your signing key private keys into the `.env` file you just created

```bash
export OWNER_1_PRIVATE_KEY='<PRIVATE_KEY>'
export OWNER_2_PRIVATE_KEY='<PRIVATE_KEY>'
export OWNER_3_PRIVATE_KEY='<PRIVATE_KEY>'
```

Install the core SDKs.

```bash
yarn add @safe-global/safe-core-sdk-types @safe-global/safe-core-sdk @safe-global/safe-service-client @safe-global/safe-ethers-lib
```

Create an `index.js` file that you will use to run the following code snippets:

```bash
touch index.ts
```


Tip: Use [ts-node](https://github.com/TypeStrong/ts-node) to run a Typescript file in Node.js

```bash
npx ts-node src/foo.ts
```
### Initialize Signers, Providers, and EthAdapter

The provider is the object that connects to the Ethereum blockchain. The signers are objects that trigger transactions to the Ethereum blockchain or off-chain transactions.

You can get a public RPC URL from [Chainlist](https://chainlist.org), however, public RPC URLs can be unreliable so you can also try a dedicated provider like Infura or Alchemy.

For this tutorial, we will be creating a Safe on the Goerli testnet. 

```tsx
import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'

// <https://chainlist.org/?search=goerli&testnets=true>
const RPC_URL='https://eth-goerli.public.blastapi.io'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

// Initialize signers
const owner1Signer = provider.getSigner(process.env.OWNER_1_PRIVATE_KEY)
const owner2Signer = provider.getSigner(process.env.OWNER_2_PRIVATE_KEY)
const owner3Signer = provider.getSigner(process.env.OWNER_3_PRIVATE_KEY)

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})
```

### Initialize the Safe Service Client

The [Safe Service Client](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-service-client) consumes the [Safe Transaction Service API](https://github.com/safe-global/safe-transaction-service). To start using this library, create a new instance of the `SafeServiceClient` class, imported from `@safe-global/safe-service-client`, and pass the URL to the constructor of the Safe Transaction Service you want to use depending on the network.

We will be using Goerli for this tutorial, however, you can also get [service URLs for different networks](https://docs.gnosis-safe.io/learn/infrastructure/available-services).

```tsx
import SafeServiceClient from '@safe-global/safe-service-client'

const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter: ethAdapterOwner1 })
```

### **Initialize the Safe Core SDK**

Goerli is a supported network so we don’t need to specify the contract addresses, however, to see how to create a safe on a local or unsupported network, see [Guide: Integrating the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#instantiate-an-ethadapter).

Safe Factory is used to create a new Safe. While Safe class represents an instance of a particular Safe account.

```tsx
import { SafeFactory } from '@safe-global/safe-core-sdk'

const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
```

### Deploy a Safe

```tsx
import { SafeAccountConfig } from '@safe-global/safe-core-sdk'

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

console.log('Your Safe has been deployed:')
console.log(`https://goerli.etherscan.io/address/${safeSdkOwner1.getAddress()}`)
```

Calling the `deploySafe` method will deploy the desired Safe and return a Safe Core SDK initialized instance ready to be used. Check the [API Reference](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk#deploysafe) for more details on additional configuration parameters and callbacks.

### Send ETH to the Safe

We will send some ETH to this Safe (treasury). Owner 1 will deposit 0.1 Goerli ETH to this Safe from our personal account following the [instructions in Quickstart](https://docs.gnosis-safe.io/learn/quickstart).

```tsx
const treasury = safeSdk.getAddress()

const treasuryAmount = ethers.utils.parseUnits('0.1', 'ether').toHexString()

const transactionParameters = [{
  to: treasury,
  value: treasuryAmount
}]

const tx = await owner1Signer.sendTransaction(transactionParameters)

console.log('Fundraising.')
console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`))
```

## Making a Transaction from a Safe

Owner 1 will sign and propose a transaction to send 0.05 ETH out of the Safe. Then, owner 2 will add their own proposal and execute the transaction since it meets the 2 of 3 thresholds.

At a high level, making a transaction from the Safe requires the following steps:

### Overview

1. Owner 1 creates a transaction
    1. Defines the amount, destination, and any additional data to include in the transaction
2. Owner 1 proposes a transaction
    1. Performs an off-chain signature of the transaction before proposing
    2. Submits the transaction and signature to the Safe Transaction Service
3. Owner 2  gets pending transactions from the Safe service
4. Owner 2  confirms the transaction
    1. Performs an off-chain signature
    2. Submits the signature to the service
5. Anyone can execute the transaction (Owner 1 in this example)

### Create a Transaction

For more details on what to include in a transaction see, [Create a Transaction in the Safe Core SDK Guide](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#4-create-a-transaction).

```tsx
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'

// Any address can be used. In this example we will use vitalik.eth
const destination = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const amount = ethers.utils.parseUnits('0.05', 'ether').toString()

const safeTransactionData: SafeTransactionDataPartial = {
  to: destination,
  data: '0x',
  value: amount
}
// Create a Safe transaction with the provided parameters
const safeTransaction = await safeSdkOwner1.createTransaction({ safeTransactionData })
```
### Propose a Transaction

To send the transaction to the Safe Transaction Service we need to call the method proposeTransaction from the Safe Service Client instance.

For a full list and description of the properties that `proposeTransaction` accepts, see [Propose the transaction to the service](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#propose-transaction) in the Safe Core SDK guide.

```tsx
// Deterministic hash based on transaction parameters
const safeTxHash = await safeSdkOwner1.getTransactionHash(safeTransaction)

// Sign transaction to verify that the transaction is coming from owner 1
const senderSignature = await safeSdkOwner1.signTransactionHash(safeTxHash)

await safeService.proposeTransaction({
  safeAddress: treasury,
  safeTransactionData: safeTransaction.data,
  safeTxHash,
  senderAddress: await owner1Signer.getAddress(),
  senderSignature: senderSignature.data,
})
```

### Get Pending Transactions

Recall that we created the `safeService` in [Initialize the Safe Service Client](#initialize-the-safe-service-client).

```tsx
const pendingTxs = await safeService.getPendingTransactions(treasury)
```

### Confirm the Transaction: Second Confirmation

Owner 2 needs a different Safe object. However, you don’t need to create it with the Safe factory. You can create it with the `create` method of the Safe object. The Safe smart contract is already live on the blockchain so you can just pass the treasury address used when you created the Safe.

```tsx
// Assuming that the first pending transaction is the one proposed by owner 1
const transaction = pendingTxs[0]
const safeTxHash = transaction.safeTxHash

const ethAdapterOwner2 = new EthersAdapter({
  ethers,
  signerOrProvider: owner2Signer
})

const safeSdkOwner2 = await Safe.create({
  ethAdapter: ethAdapterOwner2,
  safeAddress: treasury
})

const signature = await safeSdkOwner2.signTransactionHash(hash)
const response = await safeService.confirmTransaction(hash, signature.data)
```

### Execute Transaction

Anyone can execute the Safe transaction once it has the required number of signatures. In this example, owner 1 will execute the transaction and pay for the gas fees.

```tsx
const safeTransaction = await safeService.getTransaction(safeTxHash)
const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
```

### Confirm that the Transaction was Executed

We know that the transaction was executed if the balance in our Safe changed.

```tsx
const afterBalance = await safeSdk.getBalance()

console.log(`The final balance of the treasury: ${ethers.utils.formatUnits(afterBalance, 'ether')} ETH`)
```

```bash
$ node index.js

Fundraising.

Initial balance of the treasury: 0.1 ETH
Buying a car.
The final balance of the treasury: 0.05 ETH
```

### Conclusion

In this quickstart, you learned how to create, configure and deploy a Safe and propose and execute a transaction for the safe.
