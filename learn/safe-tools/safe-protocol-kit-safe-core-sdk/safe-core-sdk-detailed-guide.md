# Safe Core SDK: Detailed Guide

This guide is a follow-up to the [quickstart guide](/learn/safe-tools/safe-protocol-kit-safe-core-sdk) and is meant to go into more detail about the Safe Core SDK functionality. This guide contains instructions for features such as multi-send transactions, custom networks, checking the transaction status and more.

### Initialize Web3Adapter (Optional)

You can instantiate a Web3Adapter instead of the EthersAdapter

```tsx
import Web3 from 'web3'
import Web3Adapter from '@safe-global/safe-web3-lib'

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

const provider = new Web3.providers.HttpProvider(RPC_URL)
const web3 = new Web3(provider)
const safeOwner = owner_1_signer

const ethAdapter = new Web3Adapter({
  web3,
  signerAddress: safeOwner
})

```

## **Initialize the Safe Core SDK**

There are two versions of the Safe contracts: [GnosisSafe.sol](https://github.com/safe-global/safe-contracts/blob/v1.3.0/contracts/GnosisSafe.sol) does not trigger events in order to save gas and [GnosisSafeL2.sol](https://github.com/safe-global/safe-contracts/blob/v1.3.0/contracts/GnosisSafeL2.sol) which does and is more appropriate for L2 networks.

By default `GnosisSafe.sol` will be only used on Ethereum Mainnet. For the rest of the networks where the Safe contracts are already deployed, the `GnosisSafeL2.sol` contract will be used unless you add the property `isL1SafeMasterCopy` to force the use of the `GnosisSafe.sol` contract.

```tsx
const safeFactory = await SafeFactory.create({ ethAdapter, isL1SafeMasterCopy: true })

const safeSdk = await Safe.create({ ethAdapter, safeAddress, isL1SafeMasterCopy: true })

```

If the Safe contracts are not deployed to your current network, the property `contractNetworks`
 will be required to point to the addresses of the Safe contracts previously deployed by you.

```tsx
const chainId = await ethAdapter.getChainId()
const contractNetworks: ContractNetworksConfig = {
  [chainId]: {
    safeMasterCopyAddress: '<MASTER_COPY_ADDRESS>',
    safeProxyFactoryAddress: '<PROXY_FACTORY_ADDRESS>',
    multiSendAddress: '<MULTI_SEND_ADDRESS>',
    multiSendCallOnlyAddress: '<MULTI_SEND_CALL_ONLY_ADDRESS>',
    fallbackHandlerAddress: '<FALLBACK_HANDLER_ADDRESS>',
    signMessageLibAddress: '<SIGN_MESSAGE_LIB_ADDRESS>',
    createCallAddress: '<CREATE_CALL_ADDRESS>',
    safeMasterCopyAbi: '<MASTER_COPY_ABI>', // Optional. Only needed with web3.js
    safeProxyFactoryAbi: '<PROXY_FACTORY_ABI>', // Optional. Only needed with web3.js
    multiSendAbi: '<MULTI_SEND_ABI>', // Optional. Only needed with web3.js
    multiSendCallOnlyAbi: '<MULTI_SEND_CALL_ONLY_ABI>', // Optional. Only needed with web3.js
    fallbackHandlerAbi: '<FALLBACK_HANDLER_ABI>', // Optional. Only needed with web3.js
    signMessageLibAbi: '<SIGN_MESSAGE_LIB_ABI>', // Optional. Only needed with web3.js
    createCallAbi: '<CREATE_CALL_ABI>' // Optional. Only needed with web3.js
  }
}

const safeFactory = await SafeFactory.create({ ethAdapter, isL1SafeMasterCopy: false })

const safeSdk = await Safe.create({ ethAdapter, safeAddress, isL1SafeMasterCopy: false })

```

### Specify Contract Version

The `SafeFactory` constructor also accepts the property `safeVersion` to specify the Safe contract version that will deploy. This string can take the values `1.0.0`, `1.1.1`, `1.2.0` or `1.3.0`. If not specified, the most recent contract version will be used by default.

```
const safeVersion = 'X.Y.Z'
const safeFactory = await SafeFactory.create({ ethAdapter, safeVersion })

```

## Create a Transaction

The Safe Core SDK supports exciting single transactions and MltiSend transactions.

### Create a Single Transaction

```
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'

const safeTransactionData: SafeTransactionDataPartial = {
  to,
  data,
  value,
  operation, // Optional
  safeTxGas, // Optional
  baseGas, // Optional
  gasPrice, // Optional
  gasToken, // Optional
  refundReceiver, // Optional
  nonce // Optional
}

const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })

```

### Create a MultiSend Transaction (Optional)

We can also wrap multiple transactions into 1 transaction using the MultiSend feature.

This method takes an array of `MetaTransactionData` objects that represent the multiple transactions we want to include in our MultiSend transaction. If we want to specify some of the optional properties in our MultiSend transaction, we can pass a second argument to the method `createTransaction`with the `SafeTransactionOptionalProps` object.

```tsx
import { SafeTransactionOptionalProps } from '@safe-global/safe-core-sdk'
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'

const safeTransactionData: MetaTransactionData[] = [
  {
    to,
    data,
    value,
    operation
  },
  {
    to,
    data,
    value,
    operation
  },
  // ...
]

const options: SafeTransactionOptionalProps = {
  safeTxGas, // Optional
  baseGas, // Optional
  gasPrice, // Optional
  gasToken, // Optional
  refundReceiver, // Optional
  nonce // Optional
}

const safeTransaction = await safeSdk.createTransaction({ safeTransactionData, options })

```

We can specify the `nonce` of our Safe transaction as long as it is not lower than the current Safe nonce. If multiple transactions are created but not executed they will share the same `nonce` if no `nonce` is specified, validating the first executed transaction and invalidating all the rest. We can prevent this by calling the method `getNextNonce` from the Safe Service Client instance. This method takes all queued/pending transactions into account when calculating the next nonce, creating a unique one for all different transactions.

`const nonce = await safeService.getNextNonce(safeAddress)`

## Propose the transaction to the service

Once we have the Safe transaction object we can share it with the other owners of the Safe so they can sign it. To send the transaction to the Safe Transaction Service we need to call the method `proposeTransaction` from the Safe Service Client instance and pass an object with the properties:

- `safeAddress`: The Safe address.
- `safeTransactionData`: The `data` object inside the Safe transaction object returned from the method `createTransaction`.
- `safeTxHash`: The Safe transaction hash, calculated by calling the method `getTransactionHash` from the Safe Core SDK.
- `senderAddress`: The Safe owner or delegate proposing the transaction.
- `senderSignature`: The signature generated by signing the `safeTxHash` with the `senderAddress`.
- `origin`: Optional string that allows to provide more information about the app proposing the transaction.

```tsx
const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
await safeService.proposeTransaction({
  safeAddress,
  safeTransactionData: safeTransaction.data,
  safeTxHash,
  senderAddress,
  senderSignature: senderSignature.data,
  origin
})

```

## Get the Transaction from the Service

The transaction is then available on the Safe Transaction Service and the owners can retrieve it by finding it in the pending transaction list, or by getting its Safe transaction hash.

Get a list of pending transactions:

`const pendingTxs = await safeService.getPendingTransactions(safeAddress)`

Get a specific transaction given its Safe transaction hash:

`const tx = await safeService.getTransaction(safeTxHash)`

The retrieved transaction will have this type:

```tsx
type SafeMultisigTransactionResponse = {
  safe: string
  to: string
  value: string
  data?: string
  operation: number
  gasToken: string
  safeTxGas: number
  baseGas: number
  gasPrice: string
  refundReceiver?: string
  nonce: number
  executionDate: string
  submissionDate: string
  modified: string
  blockNumber?: number
  transactionHash: string
  safeTxHash: string
  executor?: string
  isExecuted: boolean
  isSuccessful?: boolean
  ethGasPrice?: string
  gasUsed?: number
  fee?: number
  origin: string
  dataDecoded?: string
  confirmationsRequired: number
  confirmations?: [
    {
      owner: string
      submissionDate: string
      transactionHash?: string
      confirmationType?: string
      signature: string
      signatureType?: string
    },
    // ...
  ]
  signatures?: string
}

```

## Confirm or Reject the Transaction

The owners of the Safe can now sign the transaction obtained from the Safe Transaction Service by calling the method `signTransactionHash` from the Safe Core SDK to generate the signature and by calling the method `confirmTransaction` from the Safe Service Client to add the signature to the service.

```tsx
// transaction: SafeMultisigTransactionResponse

const hash = transaction.safeTxHash
let signature = await safeSdk.signTransactionHash(hash)
await safeService.confirmTransaction(hash, signature.data)
```

## Execute the Transaction

Once there are enough confirmations in the service the transaction is ready to be executed. The account that will execute the transaction needs to retrieve it from the service with all the required signatures and call the method `executeTransaction` from the Safe Core SDK.

The method `executeTransaction` accepts an instance of the class `SafeTransaction` so the transaction needs to be transformed from the type `SafeMultisigTransactionResponse`.

```tsx
const safeTransaction = await safeService.getTransaction(...)
const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())

```

Optionally, the `isValidTransaction` method, that returns a boolean value, could be called right before the `executeTransaction` method to check if the transaction will be executed successfully or not.

```tsx
const isValidTx = await safeSdk.isValidTransaction(safeTransaction)

```

### Check Transaction Status

During the process of collecting the signatures/executing transactions, some useful checks can be made in the interface to display or hide a button to confirm or execute the transaction depending on the current number of confirmations, the address of accounts that confirmed the transaction and the Safe threshold:

Check if a Safe transaction is already signed by an owner:

```tsx
const isTransactionSignedByAddress = (signerAddress: string, transaction: SafeMultisigTransactionResponse) => {
  const confirmation = transaction.confirmations.find(confirmation => confirmation.owner === signerAddress)
  return !!confirmation
}

```

Check if a Safe transaction is ready to be executed:
