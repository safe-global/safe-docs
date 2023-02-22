The Safe Protocol Kit uses the [Safe Core SDK](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk) to interact with [Safe contracts](https://github.com/safe-global/safe-contracts) using a Typescript interface. This SDK can be used to create Safe accounts, and propose and execute transactions and update the configuration of an existing Safe.

## Quickstart

In this quickstart, you will create a 2 of 3 multi-sig Safe and propose and execute a transaction to send some ETH out of this Safe.

For a more detailed guide, including how to integrate with safe-service-client and web3js, see [Safe Core SDK: Detailed Guide](https://www.notion.so/learn/safe-tools/safe-protocol-kit-safe-core-sdk/safe-core-sdk-detailed-guide.md).

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm)
2. [3 Signing Accounts with testnet ETH in at least one account](https://docs.gnosis-safe.io/learn/quickstart)

### Install Dependencies

To interact with Ethereum and other EVM blockchains in Node, we can either use: web3.js or ethers.js. In this tutorial, we’ll use the ethers.js library. To use `web3js`, see [Safe Core SDK: Detailed Guide](https://www.notion.so/learn/safe-tools/safe-protocol-kit-safe-core-sdk/safe-core-sdk-detailed-guide.md).

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
export OWNER_1_PRIVATE_KEY="<PRIVATE_KEY>"
export OWNER_2_PRIVATE_KEY="<PRIVATE_KEY>"
export OWNER_3_PRIVATE_KEY="<PRIVATE_KEY>"
```

Install the core SDKs.

```bash
yarn add @safe-global/safe-core-sdk-types @safe-global/safe-core-sdk @safe-global/safe-ethers-lib
```

Create an `index.ts` file that you will use to run the following code snippets:

```bash
touch index.ts
```

### Initialize Signers, Providers, and EthAdapter

The provider is the object that connects to the Ethereum blockchain. The signers are objects that trigger transactions to the Ethereum blockchain or off-chain transactions.

You can get a public RPC URL from [Chainlist](https://chainlist.org), however, public RPC URLs can be unreliable so you can also try a dedicated provider like Infura or Alchemy.

For this tutorial, we will be creating a Safe on the Goerli testnet. 

```tsx
import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'

// <https://chainlist.org/?search=goerli&testnets=true>
const RPC_URL='<https://eth-goerli.public.blastapi.io>'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// initialize signers
const owner1Signer = provider.getSigner(process.env.OWNER_1_PRIVATE_KEY);
const owner2Signer = provider.getSigner(process.env.OWNER_2_PRIVATE_KEY);
const owner3Signer = provider.getSigner(process.env.OWNER_3_PRIVATE_KEY);

const ethAdapter = new EthersAdapter({
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
const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
```

### **Initialize the Safe Core SDK**

Goerli is a supported network so we don’t need to specify the contract addresses, however, to see how to create a safe on a local or unsupported network, see Safe Core SDK: Detailed Guide.

Safe Factory is used to create a new Safe. While Safe class represents an instance of a  particular Safe account.

```tsx
import { SafeFactory } from '@safe-global/safe-core-sdk'

const safeFactory = await SafeFactory.create({ ethAdapter })
```

### Deploy a Safe

```tsx
import { SafeAccountConfig } from '@safe-global/safe-core-sdk'

const safeAccountConfig: SafeAccountConfig = {
  owners: [
	  owner1Signer.getAddress(),
		owner2Signer.getAddress(),
 		owner3Signer.getAddress()
	],
  threshold: 2,
  // ... (optional params)
}
const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

console.log("Your Safe has been deployed:")
console.log(`https://goerli.etherscan.io/address/${safeSdk.getAddress()}`))
```

Calling the method `deploySafe`will deploy the desired Safe and return a Safe Core SDK initialized instance ready to be used. Check the [API Reference](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk#deploysafe) for more details on additional configuration parameters and callbacks.

### Send ETH to The Safe

We will send some ETH to this Safe (treasury). Owner 1 will deposit 0.1 Goerli ETH to this Safe from our personal account following the [instructions in Quickstart](https://docs.gnosis-safe.io/learn/quickstart).

```tsx
const treasury = safeSdk.getAddress()

const treasuryAmount = ethers.utils.parseUnits("0.1", 'ether').toHexString()

const params = [{
  to: treasury,
  value: treasuryAmount
}]

const tx = await owner1Signer.sendTransaction(transactionParameters);

console.log("Fundraising.")
console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`))
```

## Making a Transaction from a Safe

Owner 1 will sign and propose a transaction to send 0.05 ETH out of the Safe. Then owner 2 will add their own proposal and execute the transaction since it meets the 2 of 3 thresholds.

At a high level, making a transaction from the Safe requires the following steps:

### Overview

1. Owner 1 creates a transaction
    1. Define the amount, destination, and any additional data to include in the transaction
    2. Deterministically generate a hash
2. Owner 1 proposes a transaction
    1. Performs an off-chain signature of the transaction before proposing
    2. Submits it to the Safe Service
    3. Adds the signature to get 1 of 2 threshold
3. Owner 2  gets pending transactions from the Saf service
4. Owner 2  confirms the transaction
    1. Perform off-chain signature
    2. Submits to service
5. Anyone can execute the transaction
    1. On-chain transaction
    2. Only step that is submitted to the blockchain
    3. Gas is paid

### Create a Transaction

For more details on what to include in a transaction see, [Create a Transaction in the Safe Core SDK Guide](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#4-create-a-transaction).

```tsx
const withdrawAmount = ethers.utils.parseUnits("0.05", 'ether').toHexString();

// We can use any address, in this example, we will use vitalik.eth
const withdrawDestination = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

const transaction = {
  to: withdrawDestination,
  data: '0x',
  value: withdrawAmount
};
// Creates a Safe transaction with the provided parameters
const safeTransaction = await safeSdk.createTransaction(transaction);
```

### Owner 1 Proposes a Transaction to the Safe Service

```tsx
// Deterministic hash based on transaction parameters
const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);

// sign transaction to verify that the transaction is coming from owner 1
const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

await safeService.proposeTransaction({
  safeAddress,
  safeTransactionData: safeTransaction.data,
  safeTxHash,
  senderAddress,
  senderSignature: senderSignature.data,
  origin
});
```

Owner 2 needs a different Safe object. But you don’t need to create it with the safe factory; you can create it with the `create` method of the Safe object. Because your safe smart contract is live already on the blockchain, you just passed the treasury address when you created the Safe object.

```tsx
const ethAdapterOwner2 = new EthersAdapter({
  ethers,
  signerOrProvider: owner2Signer
})

const safeSdkOwner2 = await Safe.create({ ethAdapter: ethAdapterOwner2,
                                          safeAddress: treasury,
                                          contractNetworks: contractNetworks });

const pendingTxs = await safeService.getPendingTransactions(safeAddress);

// Assuming that the first pending transaction is the one proposed by owner 1
const transaction = pendingTxs[0];
const hash = transaction.safeTxHash
let signature = await safeSdkOwner2.signTransactionHash(hash)
const response = await safeService.confirmTransaction(hash, signature.data)
```

Next, you pass the transaction to Owner 2 either by chatting or via email. What the transaction means in this context is the `transaction` object in the code. Remember, you’ve already created this object:

```tsx
const transaction = {
    to: treasury,
    data: '0x',
    value: withdraw_amount
  };
```

You need another signature. Owner 3 approves the signature and because you now have 2 signers and your threshold is 2, the transaction gets executed.

```tsx
const safeSdkOwner3 = await Safe.create({ ethAdapter: ethAdapterOwner3,
                                              safeAddress: treasury,
                                              contractNetworks: contractNetworks });

// TODO verify flow for approve and execute transaction
// approve transaction
const safeTransactionOwner3 = await safeSdkOwner3.createTransaction(transaction);
const hashOwner3 = await safeSdk.getTransactionHash(safeTransaction);
const txResponseOwner3= await safeSdk_cto.approveTransactionHash(hashOwner3);
await txResponseOwner3.transactionResponse?.wait();

//execute transaction
const safeTransactionAdvisor = await safeSdkOwner3.createTransaction(transaction);
const txResponseOwner3 = await safeSdkOwner3.executeTransaction(safeTransactionAdvisor);
await txResponseOwner3.transactionResponse?.wait();
console.log("Withdrawal Amount.");

```

Finally, let’s check our treasury balance:

```
const afterBalance = await safeSdk.getBalance();
console.log(`The final balance of the treasury: ${ethers.utils.formatUnits(afterBalance, "ether")} ETH`);

```

```
$ node index.js

Fundraising.

Initial balance of the treasury: 0.1 ETH
Buying a car.
The final balance of the treasury: 0.05 ETH

```

### Conclusion

In this quickstart, you learned how to create, configure and deploy a Safe and propose and execute a transaction for the safe.
