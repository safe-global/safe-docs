# Relay Kit

The [Relay Kit](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/relay-kit) allows users to pay transaction fees (gas fees) using the native blockchain token or ERC-20 tokens. This allows you to pay gas fees using any ERC-20 token in your Safe, even if you don't have ETH.

## Quickstart

In this quickstart guide you will send some tokens to another address while using the Relay Kit to pay for the gas fees. For full effect, we will be using a Signing Account/EOA that has no tokens. See the [full code example](../../../examples/relay-kit/index.ts).

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm).
2. Have a Safe where only 1 signature is needed to execute transactions.
3. For using Gelato 1Balance [you will need an API key](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance).

### Install dependencies

```bash
yarn add ethers @safe-global/relay-kit @safe-global/safe-core-sdk @safe-global/safe-core-sdk-types @safe-global/safe-ethers-lib
```

### Relay Kit Options

Currently, the Relay Kit is only compatible with the [Gelato relay](https://docs.gelato.network/developer-services/relay). There are 2 ways to use the Gelato relay:
1. [Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance)
2. [Gelato SyncFee](https://docs.gelato.network/developer-services/relay/quick-start/callwithsyncfee)

## Gelato 1Balance

[Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance) allows you to execute transactions using a prepaid deposit. This can be used to sponsor transactions to other Safes or even to use a deposit on Polygon to pay the fees for a wallet on another chain.

For the 1Balance quickstart tutorial, you will use the Gelato relayer to pay for the gas fees on Polygon using the Goerli ETH you've deposited into your Gelato 1Balance account.

For this tutorial you will need a 1/1 Safe deployed on Polygon. You can create one using [Safe UI](../../quickstart) or [Protocol Kit](./protocol-kit/).

### Deposit Goerli ETH into Gelato 1Balance

TODO: Show how to deposit Goerli ETH into 1Balance

### Import Packages

```typescript
import { ethers } from 'ethers'
import { GelatoRelayAdapter, MetaTransactionOptions } from '@safe-global/relay-kit'
import Safe from '@safe-global/safe-core-sdk'
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types'
```
### Initialize your Transaction Settings

Modify the variables to customize to match your desired transaction settings.

```typescript
// https://chainlist.org
const RPC_URL='https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const safeAddress = '0x...' // Safe from which the transaction will be sent
const chainId = 5

// Any address can be used for destination. In this example, we use vitalik.eth
const destinationAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const withdrawAmount = ethers.utils.parseUnits('0.005', 'ether').toString()

// Usually a limit of 21000 is used but for smart contract interactions, you can increase to 100000 because of the more complex interactions.
const gasLimit = '100000'
```

### Create your Transaction Object

```typescript
// Create a transaction object
const safeTransaction: MetaTransactionData = {
  to: destinationAddress,
  data: '0x',// leave blank for ETH transfers
  value: withdrawAmount,
  operation: OperationType.Call
}
const options: MetaTransactionOptions = {
  gasLimit: ethers.BigNumber.from(gasLimit),
  isSponsored: true
}
```

### Create the Protocol and Relay Adapter Instance

```typescript
const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer
})

const safeSDK = await Safe.create({
  ethAdapter,
  safeAddress
})

const relayAdapter = new GelatoRelayAdapter(process.env.GELATO_RELAY_API_KEY!)
```

### Prepare the transaction

```typescript
const standarizedSafeTx = await safeSDK.createTransaction({
  safeTransactionData: safeTransaction
})

const signedSafeTx = await safeSDK.signTransaction(standarizedSafeTx)

const encodedTx = safeSDK.getContractManager().safeContract.encode('execTransaction', [
  signedSafeTx.data.to,
  signedSafeTx.data.value,
  signedSafeTx.data.data,
  signedSafeTx.data.operation,
  signedSafeTx.data.safeTxGas,
  signedSafeTx.data.baseGas,
  signedSafeTx.data.gasPrice,
  signedSafeTx.data.gasToken,
  signedSafeTx.data.refundReceiver,
  signedSafeTx.encodedSignatures()
])
```

### Send transaction to relay

```typescript
const relayTransaction: RelayTransaction = {
  target: safeAddress,
  encodedTransaction: encodedTx,
  chainId,
  options
}
const response = await relayAdapter.relayTransaction(relayTransaction)

console.log(`Relay Transaction Task ID:${response.taskId}`)
```


## Gelato SyncFee

[Gelato SyncFee](https://docs.gelato.network/developer-services/relay/quick-start/callwithsyncfee) allows you to execute a transaction and pay the gas fees directly with funds in your Safe, even if you don't have ETH or the native blockchain token.

```typescript
import { GelatoRelayAdapter } from '@safe-global/relay-kit'

const relayAdapter = new GelatoRelayAdapter()

relayAdapter.relayTransaction({
  target: '0x...', // the Safe address
  encodedTransaction: '0x...', // Encoded Safe transaction data
  chainId: 5
})
```
