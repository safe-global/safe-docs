# Safe Core SDK Monorepo

### Introduction

It is a set of software developer tools written in TypeScript that facilitate the interaction with the Gnosis Safe [contracts](https://github.com/safe-global/safe-contracts) and [services](https://github.com/safe-global/safe-transaction-service).

The Safe Core SDK facilitates the interaction with the [Safe contracts](https://github.com/gnosis/safe-contracts).

It only supports Safe contracts `v1.2.0` and `ethers.js` `v5` so far.

### Guides <a href="#guides" id="guides"></a>

### Adding the dependencies

The Safe Core SDK is available as a TS library via npm and can be added to your project with

```
npm install @gnosis.pm/safe-core-sdk
```

or

```
yarn add @gnosis.pm/safe-core-sdk
```

| Guide                                                                                                                                      | Content                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ​[Integrating the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/main/packages/guides/integrating-the-safe-core-sdk.md)​ | This guide shows how to use the [Safe Core SDK](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk) together with the [Safe Service Client](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-service-client) to deploy new Safes, propose transactions, collect the required signatures off-chain and execute them. |

### Packages <a href="#packages" id="packages"></a>

### Getting Started

#### 1. Set up the SDK using `Ethers` or `Web3`

| Package                                                                                                                                                         | Release                                                                                                                                                                                                                                                                                                      | Description                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [safe-core-sdk](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk)                                                                  | ​​​[​![](https://camo.githubusercontent.com/19147c4a75d901dba6558ccfee53e26ba37f8a3a5cd712dc9af7850e31669428/68747470733a2f2f62616467652e667572792e696f2f6a732f253430676e6f7369732e706d253246736166652d636f72652d73646b2e737667)​](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-core-sdk)​                   | TypeScript library that facilitates the interaction with the [Gnosis Safe contracts](https://github.com/safe-global/safe-contracts)​​                                                      |
| [safe-core-sdk-types](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk-types)                                                      | ​​[​![](https://camo.githubusercontent.com/04b0bf621b96568b581a78cb15b14e7c41ebd0f63e8bd30923cd5002dc7643f7/68747470733a2f2f62616467652e667572792e696f2f6a732f253430676e6f7369732e706d253246736166652d636f72652d73646b2d74797065732e737667)​](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-core-sdk-types)   | Common types extracted from the [Safe Core SDK](https://github.com/safe-global/safe-core-sdk/tree/main/packages) packages​                                                                 |
| ​[safe-core-sdk-utils](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk-utils)                                                     | ​​[​![](https://camo.githubusercontent.com/80f6ae8a9a238a7945715a801c7b175dc1935bd7c2ba107af195add19f9cccf5/68747470733a2f2f62616467652e667572792e696f2f6a732f253430676e6f7369732e706d253246736166652d636f72652d73646b2d7574696c732e737667)​](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-core-sdk-utils)​  | Utilities for the [Safe Core SDK](https://github.com/safe-global/safe-core-sdk/tree/main/packages) packages​                                                                               |
| [safe-ethers-lib](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-ethers-lib)[​](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-ethers-lib)​ | ​​[​![](https://camo.githubusercontent.com/d66876aabb982598d1b45cfb1f189152c6ce3b21c80a70294407a6643fff8388/68747470733a2f2f62616467652e667572792e696f2f6a732f253430676e6f7369732e706d253246736166652d6574686572732d6c69622e737667)](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-ethers-lib)                | Ethers.js utilities and Safe contracts types (typechain ethers-v5) used to initialize the [Safe Core SDK](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk)​​ |
| [safe-web3-lib](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-web3-lib)                                                                  | ​​[​![](https://camo.githubusercontent.com/384c10c1be148ea5f3064e34fcf65961a5995632b487027f70564fd0c4960b98/68747470733a2f2f62616467652e667572792e696f2f6a732f253430676e6f7369732e706d253246736166652d776562332d6c69622e737667)​](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-web3-lib)​                    | Web3.js utilities and Safe contracts types (typechain web3-v1) used to initialize the [Safe Core SDK](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk)       |
| ​​[safe-service-client](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-service-client)                                                    | ​​[​![](https://camo.githubusercontent.com/0029846ff55fff05d4984771dc5f22ad3af526fdee0c91409286d5c53d08aefa/68747470733a2f2f62616467652e667572792e696f2f6a732f253430676e6f7369732e706d253246736166652d736572766963652d636c69656e742e737667)​](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-service-client)​​ | [Safe Transaction Service API](https://github.com/safe-global/safe-transaction-service) client library                                                                                     |
| ​[safe-ethers-adapters](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-ethers-adapters)                                                   | ​​[​![](https://camo.githubusercontent.com/62da84e05b7e25aa7458a90df1f07d50689d95dbce8e012cad4f1aa4c60b7fa4/68747470733a2f2f62616467652e667572792e696f2f6a732f253430676e6f7369732e706d253246736166652d6574686572732d61646170746572732e737667)](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-ethers-adapters) | [Ethers](https://docs.ethers.io/v5/single-page/) adapter that facilitates the interaction with the [Gnosis Safe Services](https://github.com/safe-global/safe-transaction-service)         |

[​](https://badge.fury.io/js/%40gnosis.pm%2Fsafe-ethers-adapters)​​

If the app integrating the SDK is using `Ethers` `v5`, create an instance of the `EthersAdapter`. `owner1` is the Ethereum account we are connecting and the one who will sign the transactions.

```
import { ethers } from 'ethers'
import { EthersAdapter } from '@gnosis.pm/safe-core-sdk'

const web3Provider = // ...
const provider = new ethers.providers.Web3Provider(web3Provider)
const owner1 = provider.getSigner(0)

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signer: owner1
})
```

If the app integrating the SDK is using `Web3` `v1`, create an instance of the `Web3Adapter`.

```
import Web3 from 'web3'
import { Web3Adapter } from '@gnosis.pm/safe-core-sdk'

const ethAdapterOwner1 = new Web3Adapter({
  web3,
  signerAddress: await owner1.getAddress()
})
```

#### 2. Deploy a new Safe

To deploy a new Safe account instantiate the `SafeFactory` class and call the method `deploySafe` with the right params to configure the new Safe. This includes defining the list of owners and the threshold of the Safe. A Safe account with 3 owners and threshold equal 3 will be used as the starting point for this example but any Safe configuration is valid.

```
import { Safe, SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-code-sdk'

const safeFactory = await SafeFactory.create({ ethAdapter })

const owners = ['0x<address>', '0x<address>', '0x<address>']
const threshold = 3
const safeAccountConfig: SafeAccountConfig = { owners, threshold }

const safeSdk: Safe = await safeFactory.deploySafe(safeAccountConfig)
```

The method `deploySafe` executes a transaction from `owner1` account, deploys a new Safe and returns an instance of the Safe Core SDK connected to the new Safe.

Call the method `getAddress`, for example, to check the address of the newly deployed Safe.

```
const newSafeAddress = safeSdk.getAddress()
```

To instantiate the Safe Core SDK from an existing Safe just pass to it an instance of the `EthAdapter` class and the Safe address.

```
import Safe from '@gnosis.pm/safe-core-sdk'

const safeSdk: Safe = await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress })
```

#### 3. Create a Safe transaction

```
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk'

const transactions: SafeTransactionDataPartial[] = [{
  to: '0x<address>',
  value: '<eth_value_in_wei>',
  data: '0x<data>'
}]
const safeTransaction = await safeSdk.createTransaction(...transactions)
```

Before executing this transaction, it must be signed by the owners and this can be done off-chain or on-chain. In this example `owner1` will sign it off-chain, `owner2` will sign it on-chain and `owner3` will execute it (the executor also signs the transaction transparently).

#### 3.a. Off-chain signatures

The `owner1` account signs the transaction off-chain.

```
const owner1Signature = await safeSdk.signTransaction(safeTransaction)
```

Because the signature is off-chain, there is no interaction with the contract and the signature becomes available at `safeTransaction.signatures`.

#### 3.b. On-chain signatures

To connect `owner2` to the Safe we need to create a new instance of the class `EthAdapter` passing to its constructor the owner we would like to connect. After `owner2` account is connected to the SDK as a signer the transaction hash will be approved on-chain.

```
const ethAdapterOwner2 = new EthersAdapter({ ethers, signer: owner2 })
const safeSdk2 = await safeSdk.connect({ ethAdapter: ethAdapterOwner2, safeAddress })
const txHash = await safeSdk2.getTransactionHash(safeTransaction)
const approveTxResponse = await safeSdk2.approveTransactionHash(txHash)
await approveTxResponse.wait()
```

#### 4. Transaction execution

Lastly, `owner3` account is connected to the SDK as a signer and executor of the Safe transaction to execute it.

```
const ethAdapterOwner3 = new EthersAdapter({ ethers, signer: owner3 })
const safeSdk3 = await safeSdk2.connect({ ethAdapter: ethAdapterOwner3, safeAddress })
const executeTxResponse = await safeSdk3.executeTransaction(safeTransaction)
await executeTxResponse.wait()
```

All the signatures used to execute the transaction are now available at `safeTransaction.signatures`.

### Advanced features

For extensive documentation and the API Reference check the [GitHub repository](https://github.com/gnosis/safe-core-sdk).
