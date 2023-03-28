# Relay Kit

The [Relay Kit](https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/relay-kit) allows users to pay transaction fees (gas fees) using the native blockchain token or ERC-20 tokens. This allows you to pay gas fees using any ERC-20 token in your Safe, even if you don't have ETH.

## Quickstart

In this quickstart guide, you will send some tokens to another address using the Relay Kit to pay for the gas fees. For full effect, you can try this with a Signing Account/EOA that has no tokens. See the [full code example](../../../examples/relay-kit/index.ts) for a full working example.

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

For the 1Balance quickstart tutorial, you will use the Gelato relayer to pay for the gas fees on BNB Chain using the Polygon USDC you've deposited into your Gelato 1Balance account.

For this tutorial you will need a Safe with a threshold of 1 deployed on BNB Chain. You can create one using [Safe UI](../../quickstart) or [Protocol Kit](./protocol-kit/).


### Summary

1. Start with a [1/1 Safe on BNB Chain](https://app.safe.global/transactions/history?safe=bnb:0x6651FD6Abe0843f7B6CB9047b89655cc7Aa78221)
1. Safe owner [0x6Dbd](https://bscscan.com/address/0x6Dbd26Bca846BDa60A90890cfeF8fB47E7d0f22c) signs a [Safe Transaction 0xd94a](https://safe-transaction-bsc.safe.global/api/v1/multisig-transactions/0xd94abf947f2b14333edff2cbf96e9d26bee9d8357f06c0da7d0849eab97013d8/
) to send 0.0005 BNB and submits it to Gelato
1. [Track the relay request](https://docs.gelato.network/developer-services/relay/quick-start/tracking-your-relay-request) of [Gelato Task ID 0x1bf7](https://relay.gelato.digital/tasks/status/0x1bf7664a1e176472f604bb3840d3d2a5bf56f98b60307961c3f8cee099f1eeb8)
1. [Transaction 0x814d3](https://bscscan.com/tx/0x814d385c0ec036be65663b5fbfb0d8d4e0d35af395d4d96b13f2cafaf43138f9) executed on the blockchain

### Deposit Polygon USDC into Gelato 1Balance

See: [How Can I use 1Balance?](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance#how-can-i-use-1balance)

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
const safeTransactionData: MetaTransactionData = {
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

### Prepare the Transaction

```typescript
const safeTransaction = await safeSDK.createTransaction({ safeTransactionData })

const signedSafeTx = await safeSDK.signTransaction(safeTransaction)

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

### Send Transaction to Relayer

```typescript
const relayTransaction: RelayTransaction = {
  target: safeAddress,
  encodedTransaction: encodedTx,
  chainId,
  options
}
const response = await relayAdapter.relayTransaction(relayTransaction)

console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)
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
