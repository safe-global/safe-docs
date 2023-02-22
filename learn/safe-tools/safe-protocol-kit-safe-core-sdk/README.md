# Safe Protocol Kit (Safe Core SDK)

The Safe Protocol Kit uses the [Safe Core S](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk)DK to interact with [Safe contracts](https://github.com/safe-global/safe-contracts) using a Typescript interface. This SDK can be used to create Safe accounts, and propose and execute transactions.

## Quickstart

In this quickstart, you will create a 2 of 3 multi-sig Safe and propose and execute a transaction to send some ETH out of this Safe.

For a more detailed guide, including how to integrate with safe-service-client and web3js, see [Safe Core SDK: Detailed Guide](https://www.notion.so/learn/safe-tools/safe-protocol-kit-safe-core-sdk/safe-core-sdk-detailed-guide.md).

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm)
2. [3 Signing Accounts with testnet ETH in at least one account](https://docs.gnosis-safe.io/learn/quickstart)

### Install Dependencies

To interact with Ethereum and other EVM blockchains in Node, we can either use: web3.js or ethers.js.

In this tutorial, we’ll use the ethers.js library because it's newer and has an easier developer experience.

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

Install the core SDKs. We will use ethers for this tutorial. To use `web3js`, see [Safe Core SDK: Detailed Guide](https://www.notion.so/learn/safe-tools/safe-protocol-kit-safe-core-sdk/safe-core-sdk-detailed-guide.md).

```bash
yarn add @safe-global/safe-core-sdk-types @safe-global/safe-core-sdk @safe-global/safe-ethers-lib

```

### Initialize Signers, Providers, and EthAdapter

The provider is the object that connects to the Ethereum blockchain. The signers are objects that trigger transactions to the Ethereum blockchain or off-chain transactions (explained later).

To get the list of RPC URLs, chainlist was chosen but RPC URLs can be unreliable so you can also try a dedicated provider like Infura or Alchemy or pick another RPC URL from the list.

```tsx
import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'

const owner_1 = process.env.OWNER_1_PRIVATE_KEY;
const owner_2 = process.env.OWNER_2_PRIVATE_KEY;
const onwer_3 = process.env.OWNER_3_PRIVATE_KEY;

// <https://chainlist.org/?search=goerli&testnets=true>
const RPC_URL='<https://eth-goerli.public.blastapi.io>'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// initialize signers
const owner_1_signer = provider.getSigner(owner_1);
const owner_2_signer = provider.getSigner(owner_2);
const owner_3_signer = provider.getSigner(owner_3);

const safeOwner = owner_1_signer;
const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: safeOwner
})

```

### Initialize the Safe Service Client

TODO: can we remove this from the quickstart?

As stated in the introduction, the [Safe Service Client](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-service-client) consumes the [Safe Transaction Service API](https://github.com/safe-global/safe-transaction-service). To start using this library, create a new instance of the `SafeServiceClient` class, imported from `@safe-global/safe-service-client` and pass the URL to the constructor of the Safe Transaction Service you want to use depending on the network.

```tsx
import SafeServiceClient from '@safe-global/safe-service-client'

// TODO: get Goerli transaction URL
// TODO: add link to all service urls
const txServiceUrl = '<https://safe-transaction-mainnet.safe.global>'
const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })

```

TODO: specify typescript in the code snippets

### **Initialize the Safe Core SDK**

TODO: Do we need to specify the `contractnetworks` for Goerli?

```
 const id = await ethAdapter.getChainId();
  const contractNetworks = {
    [id]: {
      multiSendAddress: process.env.MULTI_SEND_ADDRESS,
      safeMasterCopyAddress: process.env.SAFE_MASTER_COPY_ADDRESS,
      safeProxyFactoryAddress: process.env.SAFE_PROXY_FACTORY_ADDRESS
    }
  }

const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter_ceo, contractNetworks: contractNetworks });

```

TODO: Where did `safeAddress` come from here?

[https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#initialize-the-safe-core-sdk](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#initialize-the-safe-core-sdk)

```
import Safe, { SafeFactory } from '@safe-global/safe-core-sdk'

const safeFactory = await SafeFactory.create({ ethAdapter })

const safeSdk = await Safe.create({ ethAdapter, safeAddress })

```

### Deploy a Safe

```
import { SafeAccountConfig } from '@safe-global/safe-core-sdk'

const safeAccountConfig: SafeAccountConfig = {
  owners: [owner_1, owner_2, owner_3]
  threshold: 2,
  // ... (optional params)
}
const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })

```

Calling the method `deploySafe`will deploy the desired Safe and return a Safe Core SDK initialized instance ready to be used. Check the [API Reference](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk#deploysafe) for more details on additional configuration parameters and callbacks.

### Send ETH to The Safe

We will need some ETH to deploy to this Safe. We can send 0.1 Goerli ETH to this Safe from our Faucet following the instructions in Quickstart.

```
const treasury = safeSdk.getAddress();

const treasury_amount = ethers.utils.parseUnits("0.1", 'ether').toHexString();

const params = [{
      from: owner_1,
      to: treasury,
      value: treasury_amount
}];

await provider.send("eth_sendTransaction", params);
console.log("Fundraising.");

```

### Propose and Send a Transaction

Owner 2 will propose a transaction to send 0.1 Ether out of the account and then owner 3 will add their own proposal and execute the transaction since it meets the 2 of 3 threshold.

Create the transaction:

```

withdraw_destination = '0x..'

const withdraw_amount = ethers.utils.parseUnits("0.05", 'ether').toHexString();

const transaction = {
  to: withdraw_destination,
  data: '0x',
  value: withdraw_amount
};

const safeTransaction = await safeSdk.createTransaction(transaction);
const hash = await safeSdk.getTransactionHash(safeTransaction);

```

Owner 2 approves the transaction:

```
const ethAdapterOwner2 = new EthersAdapter({
  ethers,
  signerOrProvider: safeOwner
})

const safeSdkOwner2 = await Safe.create({ ethAdapter: ethAdapterOwner2,
                                          safeAddress: treasury,
                                          contractNetworks: contractNetworks });

const safeTransactionOwner2 = await safeSdkOwner2.createTransaction(transaction);
const hashOwner2 = await safeSdk.getTransactionHash(safeTransaction);
const txResponseOwner2= await safeSdk_cto.approveTransactionHash(hashOwner2);
await txResponseOwner2.transactionResponse?.wait();

```

Owner 2 needs a different Safe object. But you don’t need to create it with the safe factory; you can create it with the `create` method of the Safe object. Because your safe smart contract is live already on the blockchain, you just passed the treasury address when you created the Safe object.

Next, you pass the transaction to Owner 2 either by chatting or via email. What the transaction means in this context is the `transaction` object in the code. Remember, you’ve already created this object:

```
const transaction = {
    to: treasury,
    data: '0x',
    value: withdraw_amount
  };

```

You need another signature. Owner 3 approves the signature and because you now have 2 signers and your threshold is 2, the transaction gets executed.

```
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
