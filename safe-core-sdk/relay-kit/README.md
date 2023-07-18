# Relay Kit

The [Relay Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/relay-kit) allows users to pay transaction fees (gas fees) using the native blockchain token or ERC-20 tokens. This allows you to pay gas fees using any ERC-20 token in your Safe, even if you don't have ETH.

## Quickstart

In this quickstart guide, you will send some tokens to another address using the Relay Kit to pay for the gas fees. For full effect, you can try this with an externally-owned account that has no tokens. See the full code example [here](https://github.com/safe-global/safe-docs/blob/main/examples/relay-kit/index.ts).

### Prerequisites

1. [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm).
2. Have a Safe where only 1 signature is needed to execute transactions.
3. For using Gelato 1Balance [you will need an API key](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance).

### Install dependencies

```bash
yarn add ethers @safe-global/relay-kit @safe-global/protocol-kit @safe-global/safe-core-sdk-types
```

### Relay Kit Options

Currently, the Relay Kit is only compatible with the [Gelato relay](https://docs.gelato.network/developer-services/relay). There are 2 ways to use the Gelato relay:
1. [Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance)
2. [Gelato SyncFee](https://docs.gelato.network/developer-services/relay/quick-start/callwithsyncfee)

## Gelato 1Balance

[Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance) allows you to execute transactions using a prepaid deposit. This can be used to sponsor transactions to other Safes or even to use a deposit on Polygon to pay the fees for a wallet on another chain.

For the 1Balance quickstart tutorial, you will use the Gelato relayer to pay for the gas fees on BNB Chain using the Polygon USDC you've deposited into your Gelato 1Balance account.

For this tutorial you will need a Safe with a threshold of 1 deployed on BNB Chain. You can create one using [Safe{Wallet}](https://app.safe.global/) or the [Protocol Kit](./protocol-kit/).


### Summary

1. Start with a [1/1 Safe on BNB Chain](https://app.safe.global/transactions/history?safe=bnb:0x6651FD6Abe0843f7B6CB9047b89655cc7Aa78221)
1. [Deposit Polygon USDC into Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance#how-can-i-use-1balance) ([transaction 0xa5f38](https://polygonscan.com/tx/0xa5f388c2d6e0d1bb32e940fccddf8eab182ad191644936665a54bf4bb1bac555))
1. Safe owner [0x6Dbd](https://bscscan.com/address/0x6Dbd26Bca846BDa60A90890cfeF8fB47E7d0f22c) signs a [Safe Transaction 0xd94a](https://safe-transaction-bsc.safe.global/api/v1/multisig-transactions/0xd94abf947f2b14333edff2cbf96e9d26bee9d8357f06c0da7d0849eab97013d8/
) to send 0.0005 BNB and submits it to Gelato
1. [Track the relay request](https://docs.gelato.network/developer-services/relay/quick-start/tracking-your-relay-request) of [Gelato Task ID 0x1bf7](https://relay.gelato.digital/tasks/status/0x1bf7664a1e176472f604bb3840d3d2a5bf56f98b60307961c3f8cee099f1eeb8)
1. [Transaction 0x814d3](https://bscscan.com/tx/0x814d385c0ec036be65663b5fbfb0d8d4e0d35af395d4d96b13f2cafaf43138f9) is executed on the blockchain

### Deposit Polygon USDC into Gelato 1Balance

See: [How Can I use 1Balance?](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance#how-can-i-use-1balance)

### Using a Safe Smart Contract as the Relay App

While using Gelato, you can specify that you only want your relayer to allow transations from specific smart contracts. If one of those smart contracts is a Safe smart contract, you will need to either verify the contract on a block explorer or get the ABI of the contract implementation (not the ABI of the smart contract address). This is because the Safe smart contracts use the [Proxy Pattern](https://medium.com/coinmonks/proxy-pattern-and-upgradeable-smart-contracts-45d68d6f15da), so the implementation logic for your smart contract exists on a different address.


### Option 1: Verify Contract in Block Explorer
Note: If you go with the contract verification method, you will likely need to make sure that the smart contract has at least one transaction in order for the verification to work.

1. Go to the [contract tab for your smart contract in your block explorer](https://bscscan.com/address/0x6651fd6abe0843f7b6cb9047b89655cc7aa78221#code)
2. Click on Is this a proxy?

![Screen Shot 2023-04-07 at 8 18 10 AM](https://user-images.githubusercontent.com/9806858/230553070-0b246b75-263a-411b-a0f4-aa8e46f7a524.png)


3. Verify your contract and click Save

![Screen Shot 2023-04-07 at 8 16 38 AM](https://user-images.githubusercontent.com/9806858/230553089-4631a188-5df8-474d-8a3b-54bdfa842af0.png)

The verification step will also give you an [implementation address](https://bscscan.com/address/0x3e5c63644e683549055b9be8653de26e0b4cd36e#code). The ABI of this implementation smart contract can also be used to add this smart contract to Gelato (explained more in next step).

Once the contract has been verified, you can go back to [Relay Apps in Gelato](https://relay.gelato.network/apps/create), paste your contract adress and it should work.

![Screen Shot 2023-04-07 at 8 22 20 AM](https://user-images.githubusercontent.com/9806858/230553527-da97855a-0bd7-4b48-8bdb-adfeb8fba80e.png)


### Option 2: Use Implementation Contract ABI

1. To find the implementation address of your contract, you can use the Chain ID to locate the corresponding implementation address in [safe deployments](https://github.com/safe-global/safe-deployments). 
2. For example, our [Safe on BNB chain](https://bscscan.com/address/0x6651fd6abe0843f7b6cb9047b89655cc7aa78221) has a chain ID of 56 and the implementation contract it uses is gnosis_safe_l2. So we will check the file, [`gnosis_safe_l2.json`](https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/gnosis_safe_l2.json) for Chain ID 56, which gives us an address of `0x3E5c63644E683549055b9Be8653de26E0B4CD36E`.
3. Find [this address on the block explorer](https://bscscan.com/address/0x3e5c63644e683549055b9be8653de26e0b4cd36e#code), scroll to the bottom of the contract tab and copy the ABI.
4. If you've also verified your smart contract in the previous step, you can double check that both addresses are the same.

![Screen Shot 2023-04-07 at 8 34 09 AM](https://user-images.githubusercontent.com/9806858/230555050-7a397c91-a98b-44da-92d7-3a30ed498b86.png)

5. Go to [Relay Apps in Gelato](https://relay.gelato.network/apps/create), switch to custom ABI paste your contract ABI and it should work.

![Screen Shot 2023-04-07 at 8 34 20 AM](https://user-images.githubusercontent.com/9806858/230555032-4256f4c0-22fb-444a-8ba0-6dbd017fe2db.png)


### Import Packages

```typescript
import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter, getSafeContract } from '@safe-global/protocol-kit'
import { MetaTransactionData, MetaTransactionOptions, OperationType } from '@safe-global/safe-core-sdk-types'
```
### Initialize your Transaction Settings

Modify the variables to customize to match your desired transaction settings.

```typescript
// https://chainlist.org
const RPC_URL='https://endpoints.omniatech.io/v1/bsc/mainnet/public'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const safeAddress = '0x...' // Safe from which the transaction will be sent
const chainId = 100
const gasLimit = '100000' // Depends on the contract interaction

// Any address can be used for destination. In this example, we use vitalik.eth
const destinationAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const withdrawAmount = ethers.utils.parseUnits('0.005', 'ether').toString()
```

### Create your Transaction Object

```typescript
// Create a transaction object
const safeTransactionData: MetaTransactionData = {
  to: destinationAddress,
  data: '0x',
  value: withdrawAmount,
  operation: OperationType.Call
}
const options: MetaTransactionOptions = {
  gasLimit,
  isSponsored: true
}
```

### Create the Protocol and Relay kits instances

```typescript
const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer
})

const safeSDK = await Safe.create({
  ethAdapter,
  safeAddress
})

const relayKit = new GelatoRelayPack(process.env.GELATO_RELAY_API_KEY!)
```

### Prepare the Transaction

```typescript
const safeTransaction = await safeSDK.createTransaction({ safeTransactionData })

const signedSafeTx = await safeSDK.signTransaction(safeTransaction)
const safeSingletonContract = await getSafeContract({
  ethAdapter,
  safeVersion: await safeSDK.getContractVersion()
})

const encodedTx = safeSingletonContract.encode('execTransaction', [
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
const response = await relayKit.relayTransaction(relayTransaction)

console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)
```

## Gelato SyncFee

[Gelato SyncFee](https://docs.gelato.network/developer-services/relay/quick-start/callwithsyncfee) allows you to execute a transaction and pay the gas fees directly with funds in your Safe, even if you don't have ETH or the native blockchain token.

```typescript
import { GelatoRelayPack } from '@safe-global/relay-kit'

const relayKit = new GelatoRelayPack()

relayKit.relayTransaction({
  target: '0x...', // The Safe address
  encodedTransaction: '0x...', // Encoded Safe transaction data
  chainId: '100'
})
```
