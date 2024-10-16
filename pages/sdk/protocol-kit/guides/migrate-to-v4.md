# Migrate to v4

This guide references the major changes between v3 and v4 to help those migrating an existing app.

**Note:** When upgrading to `protocol-kit` v4, it's necessary to upgrade to `types-kit` v1.

## The create() method was renamed init() in the SafeFactory and Safe classes

We renamed the `create()` method to `init()` to better reflect the method's purpose. The term `create()` was misleading, suggesting a new Safe account would be created and deployed. However, this method only initializes the `Safe` class, so `init()` is a more accurate and descriptive name.

```js
// old
const protocolKit = await Safe.create({ ... })
const safeFactory = await SafeFactory.create({ ... })

// new
const protocolKit = await Safe.init({ ... })
const safeFactory = await SafeFactory.init({ ... })
```

## Remove the adapters

We have removed the concept of adapters from the `protocol-kit` to simplify the library. Instead of using specific library adapters, we use now an internal `SafeProvider` object to interact with the Safe. This `SafeProvider` will be created using:

- An Ethereum provider, an [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) compatible provider, or an RPC URL.
- An optional address of the signer that is connected to the provider or a private key. If not provided, the first account of the provider (`eth_accounts`) will be selected as the signer.

The `EthAdapter` interface, the `EthersAdapter` class, and the `Web3Adapter` class are no longer available. Similarly, `EthersAdapterConfig` and `Web3AdapterConfig` were removed as well.


```js
// old
const ethAdapter = new EthersAdapter({ ethers, signerOrProvider })
// const ethAdapter = new Web3Adapter({ web3, signerAddress })
await Safe.create({
   ethAdapter,
   safeAddress: '0xSafeAddress'
   ...
})

// new
await Safe.init({
   provider: window.ethereum, // Or any compatible EIP-1193 provider
   signer: '0xSignerAddressOrPrivateKey', // Signer address or private key
   safeAddress: '0xSafeAddress'
   ...
})

// ...or...
await Safe.init({
   provider: 'http://rpc.url', // Or websocket
   signer: '0xPrivateKey' // Signer private key
   safeAddress: '0xSafeAddress'
   ...
})
```

## `EthersTransactionOptions` and `Web3TransactionOptions` types are now `TransactionOptions`

Together with the adapters, we also removed the specific transaction options objects for each library, leaving just a single `TransactionOptions` type.

We removed the `gas` property from the `TransactionOptions` object as it was a specific property for the web3.js library. Now, you should use the `gasLimit` property instead.

## `EthersTransactionResult` and `Web3TransactionResult` types are now `TransactionResult`

Together with the adapters, we also removed the specific transaction result objects for each library, leaving just a single `TransactionResult` type.

## Contract classes suffixed with Ethers and Web3

All the contract classes that were suffixed with `Ethers` or `Web3` were renamed to remove the suffix.

```js
SafeBaseContractEthers, SafeBaseContractWeb3 -> SafeBaseContract
MultiSendBaseContractEthers, MultiSendBaseContractWeb3 -> MultiSendBaseContract
MultiSendCallOnlyBaseContractEthers, MultiSendCallOnlyBaseContractWeb3 -> MultiSendCallOnlyBaseContract
SafeProxyFactoryBaseContractEthers, SafeProxyFactoryBaseContractWeb3 -> SafeProxyFactoryBaseContract
SignMessageLibBaseContractEthers, SignMessageLibBaseContractWeb3 -> SignMessageLibBaseContract
CreateCallBaseContractEthers, CreateCallBaseContractWeb3 -> CreateCallBaseContract
```
