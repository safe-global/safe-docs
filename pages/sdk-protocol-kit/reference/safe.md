# Safe reference

## Initialization

### `connect`

Returns a new instance of the Protocol Kit connected to a new Safe or a new Signer. The new connected signer can be passed via the `ethAdapter` property while the new connected Safe can be passed using a `safeAddress` or a `predictedSafe`.

Connection of a deployed Safe using the `safeAddress` property:

```typescript
let protocolKit = await Safe.create({ ethAdapter, safeAddress })
protocolKit = await protocolKit.connect({ ethAdapter: anotherEthAdapter, safeAddress: anotherSafeAddress })
```

Connection of an undeployed Safe using the `predictedSafe` property. Because Safes are deployed in a deterministic way, passing a `predictedSafe` will allow to connect a Safe to the SDK with the Safe configuration:

```typescript
import { PredictedSafeProps } from '@safe-global/protocol-kit'

const predictedSafe: PredictedSafeProps = {
  safeAccountConfig,
  safeDeploymentConfig
}

let protocolKit = await Safe.create({ ethAdapter, safeAddress })
...
protocolKit = await protocolKit.connect({ predictedSafe })
```

- The `isL1SafeSingleton` flag

  Two versions of the Safe contracts are available: [Safe.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/Safe.sol) that doesn't trigger events to save gas and [SafeL2.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/SafeL2.sol) that does, which is more appropriate for L2 networks.

  By default `Safe.sol` will only be used on Ethereum Mainnet. For the rest of the networks where the Safe contracts are already deployed, the `SafeL2.sol` contract will be used unless you add the `isL1SafeSingleton` flag to force using the `Safe.sol` contract.

  ```typescript
  protocolKit = await protocolKit.connect({ ethAdapter, safeAddress, isL1SafeSingleton: true })
  ```

- The `contractNetworks` property

  If the Safe contracts aren't deployed to your current network, the `contractNetworks` property will be required to point to the addresses of the Safe contracts previously deployed by you.

  ```typescript
  import { ContractNetworksConfig } from '@safe-global/protocol-kit'

  const chainId = await ethAdapter.getChainId()
  const contractNetworks: ContractNetworksConfig = {
    [chainId]: {
      safeSingletonAddress: '<SINGLETON_ADDRESS>',
      safeProxyFactoryAddress: '<PROXY_FACTORY_ADDRESS>',
      multiSendAddress: '<MULTI_SEND_ADDRESS>',
      multiSendCallOnlyAddress: '<MULTI_SEND_CALL_ONLY_ADDRESS>',
      fallbackHandlerAddress: '<FALLBACK_HANDLER_ADDRESS>',
      signMessageLibAddress: '<SIGN_MESSAGE_LIB_ADDRESS>',
      createCallAddress: '<CREATE_CALL_ADDRESS>',
      simulateTxAccessorAddress: '<SIMULATE_TX_ACCESSOR_ADDRESS>',
      safeSingletonAbi: '<SINGLETON_ABI>', // Optional. Only needed with web3.js
      safeProxyFactoryAbi: '<PROXY_FACTORY_ABI>', // Optional. Only needed with web3.js
      multiSendAbi: '<MULTI_SEND_ABI>', // Optional. Only needed with web3.js
      multiSendCallOnlyAbi: '<MULTI_SEND_CALL_ONLY_ABI>', // Optional. Only needed with web3.js
      fallbackHandlerAbi: '<FALLBACK_HANDLER_ABI>', // Optional. Only needed with web3.js
      signMessageLibAbi: '<SIGN_MESSAGE_LIB_ABI>', // Optional. Only needed with web3.js
      createCallAbi: '<CREATE_CALL_ABI>', // Optional. Only needed with web3.js
      simulateTxAccessorAbi: '<SIMULATE_TX_ACCESSOR_ABI>' // Optional. Only needed with web3.js
    }
  }
  let protocolKit = await Safe.create({ ethAdapter, safeAddress })
  ...
  protocolKit = await protocolKit.connect({ contractNetworks })
  ```

### `create`

Returns an instance of the Protocol Kit connected to a Safe. The provided Safe must be a `safeAddress` or a `predictedSafe`.

Initialization of a deployed Safe using the `safeAddress` property:

```typescript
import Safe from '@safe-global/protocol-kit'

const protocolKit = await Safe.create({ ethAdapter, safeAddress })
```

Initialization of an undeployed Safe using the `predictedSafe` property. Because Safes are deployed in a deterministic way, passing a `predictedSafe` will allow to initialize the SDK with the Safe configuration and use it to some extent before it's deployed:

```typescript
import Safe, { PredictedSafeProps } from '@safe-global/protocol-kit'

const predictedSafe: PredictedSafeProps = {
  safeAccountConfig,
  safeDeploymentConfig
}

const protocolKit = await Safe.create({ ethAdapter, predictedSafe })
```

- The `isL1SafeSingleton` flag

  Two versions of the Safe contracts are available: [Safe.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/Safe.sol) that doesn't trigger events to save gas and [SafeL2.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/SafeL2.sol) that does, which is more appropriate for L2 networks.

  By default `Safe.sol` will only be used on Ethereum Mainnet. For the rest of the networks where the Safe contracts are already deployed, the `SafeL2.sol` contract will be used unless you add the `isL1SafeSingleton` flag to force using the `Safe.sol` contract.

  ```typescript
  const protocolKit = await Safe.create({ ethAdapter, safeAddress, isL1SafeSingleton: true })
  ```

- The `contractNetworks` property

  If the Safe contracts aren't deployed to your current network, the `contractNetworks` property will be required to point to the addresses of the Safe contracts previously deployed by you.

  ```typescript
  import { ContractNetworksConfig } from '@safe-global/protocol-kit'

  const chainId = await ethAdapter.getChainId()
  const contractNetworks: ContractNetworksConfig = {
    [chainId]: {
      safeSingletonAddress: '<SINGLETON_ADDRESS>',
      safeProxyFactoryAddress: '<PROXY_FACTORY_ADDRESS>',
      multiSendAddress: '<MULTI_SEND_ADDRESS>',
      multiSendCallOnlyAddress: '<MULTI_SEND_CALL_ONLY_ADDRESS>',
      fallbackHandlerAddress: '<FALLBACK_HANDLER_ADDRESS>',
      signMessageLibAddress: '<SIGN_MESSAGE_LIB_ADDRESS>',
      createCallAddress: '<CREATE_CALL_ADDRESS>',
      simulateTxAccessorAddress: '<SIMULATE_TX_ACCESSOR_ADDRESS>',
      safeSingletonAbi: '<SINGLETON_ABI>', // Optional. Only needed with web3.js
      safeProxyFactoryAbi: '<PROXY_FACTORY_ABI>', // Optional. Only needed with web3.js
      multiSendAbi: '<MULTI_SEND_ABI>', // Optional. Only needed with web3.js
      multiSendCallOnlyAbi: '<MULTI_SEND_CALL_ONLY_ABI>', // Optional. Only needed with web3.js
      fallbackHandlerAbi: '<FALLBACK_HANDLER_ABI>', // Optional. Only needed with web3.js
      signMessageLibAbi: '<SIGN_MESSAGE_LIB_ABI>', // Optional. Only needed with web3.js
      createCallAbi: '<CREATE_CALL_ABI>', // Optional. Only needed with web3.js
      simulateTxAccessorAbi: '<SIMULATE_TX_ACCESSOR_ABI>' // Optional. Only needed with web3.js
    }
  }

  const protocolKit = await Safe.create({ ethAdapter, safeAddress, contractNetworks })
  ```

## Safe Info

### `getAddress`

Returns the address of the current SafeProxy contract.

```typescript
const safeAddress = await protocolKit.getAddress()
```

### `getBalance`

Returns the ETH balance of the Safe.

```typescript
const balance = await protocolKit.getBalance()
```

### `getChainId`

Returns the chain ID of the connected network.

```typescript
const chainId = await protocolKit.getChainId()
```

### `getContractVersion`

Returns the Safe singleton contract version.

```typescript
const contractVersion = await protocolKit.getContractVersion()
```

### `getNonce`

Returns the Safe nonce.

```typescript
const nonce = await protocolKit.getNonce()
```

## Transactions

### `copyTransaction`

Copies a Safe transaction.

```typescript
const safeTransaction1 = await protocolKit.createTransaction({ transactions })
const safeTransaction2 = await copyTransaction(safeTransaction1)
```

### `createRejectionTransaction`

Returns a Safe transaction ready to be signed by the owners that invalidates the pending Safe transaction(s) with a specific nonce.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const rejectionTransaction = await protocolKit.createRejectionTransaction(safeTransaction.data.nonce)
```

### `createTransaction`

Returns a Safe transaction ready to be signed by the owners and executed. The Protocol Kit supports the creation of single Safe transactions but also MultiSend transactions.

This method takes an array of `MetaTransactionData` objects representing the individual transactions we want to include in our MultiSend transaction.

When the array contains only one transaction, it's not wrapped in the MultiSend.

```typescript
const transactions: MetaTransactionData[] = [
  {
    to,
    data,
    value,
    operation // Optional
  },
  {
    to,
    data,
    value,
    operation // Optional
  }
  // ...
]
const safeTransaction = await protocolKit.createTransaction({ transactions })
```

This method can also receive the `options` parameter to set the optional properties in the MultiSend transaction:

```typescript
const transactions: MetaTransactionData[] = [
  {
    to,
    data,
    value,
    operation // Optional
  },
  {
    to,
    data,
    value,
    operation // Optional
  }
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
const safeTransaction = await protocolKit.createTransaction({ transactions, options })
```

In addition, the optional `callsOnly` parameter, which is `false` by default, allows forcing the use of the `MultiSendCallOnly` instead of the `MultiSend` contract when sending a batch transaction:

```typescript
const callsOnly = true
const safeTransaction = await protocolKit.createTransaction({
  transactions,
  options,
  callsOnly
})
```

If the optional properties aren't manually set, the Safe transaction returned will have the default value for each one:

- `operation`: `OperationType.Call` (0) is the default value.
- `safeTxGas`: The right gas estimation is the default value.
- `baseGas`: 0 is the default value.
- `gasPrice`: 0 is the default value.
- `gasToken`: 0x address is the default value.
- `refundReceiver`: 0x address is the default value.
- `nonce`: The current Safe nonce is the default value.

### `executeTransaction`

Executes a Safe transaction.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

Optionally, some properties can be passed as execution options:

```typescript
const options: Web3TransactionOptions = {
  from, // Optional
  gas, // Optional
  gasPrice, // Optional
  maxFeePerGas, // Optional
  maxPriorityFeePerGas // Optional
  nonce // Optional
}
```

```typescript
const options: EthersTransactionOptions = {
  from, // Optional
  gasLimit, // Optional
  gasPrice, // Optional
  maxFeePerGas, // Optional
  maxPriorityFeePerGas // Optional
  nonce // Optional
}
```

```typescript
const txResponse = await protocolKit.executeTransaction(safeTransaction, options)
```

### `getTransactionHash`

Returns the transaction hash of a Safe transaction.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const txHash = await protocolKit.getTransactionHash(safeTransaction)
```

### `isValidTransaction`

Checks if a Safe transaction can be executed successfully with no errors.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const isValidTx = await protocolKit.isValidTransaction(safeTransaction)
```

Optionally, some properties can be passed as execution options:

```typescript
const options: Web3TransactionOptions = {
  from, // Optional
  gas, // Optional
  gasPrice, // Optional
  maxFeePerGas, // Optional
  maxPriorityFeePerGas // Optional
  nonce // Optional
}
```

```typescript
const options: EthersTransactionOptions = {
  from, // Optional
  gasLimit, // Optional
  gasPrice, // Optional
  maxFeePerGas, // Optional
  maxPriorityFeePerGas // Optional
  nonce // Optional
}
```

```typescript
const isValidTx = await protocolKit.isValidTransaction(safeTransaction, options)
```

## Transaction signatures

### `approveTransactionHash`

Approves a hash on-chain using the current owner account.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const txHash = await protocolKit.getTransactionHash(safeTransaction)
const txResponse = await protocolKit.approveTransactionHash(txHash)
await txResponse.transactionResponse?.wait()
```

Optionally, some properties can be passed as execution options:

```typescript
const options: Web3TransactionOptions = {
  from, // Optional
  gas, // Optional
  gasPrice, // Optional
  maxFeePerGas, // Optional
  maxPriorityFeePerGas // Optional
  nonce // Optional
}
```

```typescript
const options: EthersTransactionOptions = {
  from, // Optional
  gasLimit, // Optional
  gasPrice, // Optional
  maxFeePerGas, // Optional
  maxPriorityFeePerGas // Optional
  nonce // Optional
}
```

```typescript
const txResponse = await protocolKit.approveTransactionHash(txHash, options)
```

### `signHash`

Signs a hash using the current owner account.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const txHash = await protocolKit.getTransactionHash(safeTransaction)
const signature = await protocolKit.signHash(txHash)
```

### `signTransaction`

Returns a new `SafeTransaction` object that includes the signature of the current owner. 

You can use multiple signing methods, such as:

- ETH_SIGN (`eth_sign`): Regular hash signature
- ETH_SIGN_TYPED_DATA_V4 (`eth_signTypedData_v4`): Typed data signature v4, The default method if no signing method is passed
- ETH_SIGN_TYPED_DATA_V3 `eth_signTypedData_v3`: Typed data signature v3
- ETH_SIGN_TYPED_DATA `eth_signTypedData`: Typed data signature
- SAFE_SIGNATURE: Signing with another Safe contract as signer

The third parameter (optional) is the preImageSafeAddress. If the preimage is required, this is the address of the Safe that will be used to calculate the preimage. It's a mandatory parameter for 1.3.0 and 1.4.1 contract versions. This is because the safe uses the old EIP-1271 interface, which uses `bytes` instead of `bytes32` for the message; we need to use the pre-image of the message to calculate the message hash. This parameter is used in conjunction with the SAFE_SIGNATURE signing method.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction)
```

Optionally, an additional parameter can be passed to specify a different way of signing:

```typescript
const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction, SigningMethod.ETH_SIGN_TYPED_DATA_V4) // Default option
const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction, SigningMethod.ETH_SIGN)
const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction, SigningMethod.SAFE_SIGNATURE, parentSafeAddress).
```

### `signTypedData`

Signs a transaction according to the EIP-712 using the current signer account.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const signature = await protocolKit.signTypedData(safeTransaction)
```

## Owners

### `createAddOwnerTx`

Returns the Safe transaction to add an owner and optionally change the threshold.

```typescript
const params: AddOwnerTxParams = {
  ownerAddress,
  threshold // Optional. If `threshold` isn't provided the current threshold won't change.
}
const safeTransaction = await protocolKit.createAddOwnerTx(params)
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await protocolKit.createAddOwnerTx(params, options)
```

### `createRemoveOwnerTx`

Returns the Safe transaction to remove an owner and optionally change the threshold.

```typescript
const params: RemoveOwnerTxParams = {
  ownerAddress,
  newThreshold // Optional. If `newThreshold` isn't provided, the current threshold will be decreased by one.
}
const safeTransaction = await protocolKit.createRemoveOwnerTx(params)
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await protocolKit.createRemoveOwnerTx(params, options)
```

### `createSwapOwnerTx`

Returns the Safe transaction to replace an owner of the Safe with a new one.

```typescript
const params: SwapOwnerTxParams = {
  oldOwnerAddress,
  newOwnerAddress
}
const safeTransaction = await protocolKit.createSwapOwnerTx(params)
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await protocolKit.createSwapOwnerTx(params, options)
```

### `getOwners`

Returns the list of Safe owner accounts.

```typescript
const ownerAddresses = await protocolKit.getOwners()
```

### `getOwnersWhoApprovedTx`

Returns a list of owners who have approved a specific Safe transaction.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const txHash = await protocolKit.getTransactionHash(safeTransaction)
const ownerAddresses = await protocolKit.getOwnersWhoApprovedTx(txHash)
```

### `isOwner`

Checks if a specific address is an owner of the current Safe.

```typescript
const isOwner = await protocolKit.isOwner(address)
```

## Threshold

### `createChangeThresholdTx`

Returns the Safe transaction to change the threshold.

```typescript
const safeTransaction = await protocolKit.createChangeThresholdTx(newThreshold)
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await protocolKit.createChangeThresholdTx(newThreshold, options)
```

### `getThreshold`

Returns the Safe threshold.

```typescript
const threshold = await protocolKit.getThreshold()
```

## Safe Guards

### `createDisableGuardTx`

Returns the Safe transaction to disable a Safe Guard.

```typescript
const safeTransaction = await protocolKit.createDisableGuardTx()
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await protocolKit.createDisableGuardTx(options)
```

### `createEnableGuardTx`

Returns the Safe transaction to enable a Safe Guard.

```typescript
const safeTransaction = await protocolKit.createEnableGuardTx(guardAddress)
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = {
  safeTxGas, // Optional
  baseGas, // Optional
  gasPrice, // Optional
  gasToken, // Optional
  refundReceiver, // Optional
  nonce // Optional
}
const safeTransaction = await protocolKit.createEnableGuardTx(guardAddress, options)
```

### `getGuard`

Returns the enabled Safe Guard or 0x address if no guards are enabled.

```typescript
const guardAddress = await protocolKit.getGuard()
```

## Safe Modules

### `createDisableModuleTx`

Returns a Safe transaction ready to be signed that will disable a Safe Module.

```typescript
const safeTransaction = await protocolKit.createDisableModuleTx(moduleAddress)
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await protocolKit.createDisableModuleTx(moduleAddress, options)
```

### `createEnableModuleTx`

Returns a Safe transaction ready to be signed that will enable a Safe Module.

```typescript
const safeTransaction = await protocolKit.createEnableModuleTx(moduleAddress)
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await protocolKit.createEnableModuleTx(moduleAddress, options)
```

### `getModules`

Returns the list of addresses of all the enabled Safe Modules.

```typescript
const moduleAddresses = await protocolKit.getModules()
```

### `isModuleEnabled`

Checks if a specific Safe Module is enabled for the current Safe.

```typescript
const isEnabled = await protocolKit.isModuleEnabled(moduleAddress)
```

## FallbackHandler

### `createDisableFallbackHandlerTx`

Returns the Safe transaction to disable the fallback handler.

```typescript
const safeTransaction = await protocolKit.createDisableFallbackHandlerTx()
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await protocolKit.createDisableFallbackHandlerTx(options)
```

### `createEnableFallbackHandlerTx`

Returns the Safe transaction to enable the fallback handler.

```typescript
const safeTransaction = await protocolKit.createEnableFallbackHandlerTx(fallbackHandlerAddress)
const txResponse = await protocolKit.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = {
  safeTxGas, // Optional
  baseGas, // Optional
  gasPrice, // Optional
  gasToken, // Optional
  refundReceiver, // Optional
  nonce // Optional
}
const safeTransaction = await protocolKit.createEnableFallbackHandlerTx(fallbackHandlerAddress, options)
```

## Messages

### `createMessage`

Returns a SafeMessage ready to be signed by the owners.

```typescript
const rayMessage: string | EIP712TypedData = "I am the owner of this Safe"
const message = protocolKit.createMessage(rawMessage)
```

### `getSafeMessageHash`

Retrieve the Safe message hash of a string, or EIP-712 typed data. It produces the identical hash as invoking the CompatibilityFallbackHandler's getMessageHash method.

```typescript
const rawMessage = ... // String or EIP-712 typed data
const messageHash = hashSafeMessage(rawMessage)

const safeMessageHash = await protocolKit.getSafeMessageHash(messageHash)
```

### `isValidSignature`

Calls the CompatibilityFallbackHandler isValidSignature method (EIP-1271).

It requires two parameters:

- messageHash: The hash of the message
- signature: The signature to be validated or '0x'. You can send as signature one of the following:
  1) An array of SafeSignature. In this case the signatures are concatenated for validation (buildSignatureBytes())
  2) The concatenated signatures as string
  3) '0x' if you want to validate an onchain message (Approved hash)

The method returns if the signature is valid

```typescript
const rawMessage = ... // String or EIP-712 typed data
const messageHash = hashSafeMessage(rawMessage)
const safeMessageHash = await protocolKit.getSafeMessageHash(messageHash)

const isValidSignature = await protocolKit.isValidSignature(safeMessageHash, signature)
...
const isValidSignature = await protocolKit.isValidSignature(safeMessageHash, [signature1, signature2])
...
const isValidSignature = await protocolKit.isValidSignature(safeMessageHash, '0x')
```

### `signMessage`

Returns a new `SafeMessage` object that includes the signature of the current owner. 

You can use multiple signing methods, such as:

- ETH_SIGN (`eth_sign`): Regular hash signature
- ETH_SIGN_TYPED_DATA_V4 (`eth_signTypedData_v4`): Typed data signature v4, The default method if no signing method is passed
- ETH_SIGN_TYPED_DATA_V3 `eth_signTypedData_v3`: Typed data signature v3
- ETH_SIGN_TYPED_DATA `eth_signTypedData`: Typed data signature
- SAFE_SIGNATURE: Signing with another Safe contract as signer

The third parameter (optional) is the preImageSafeAddress. If the preimage is required, this is the address of the Safe that will be used to calculate the preimage. It's a mandatory parameter for 1.3.0 and 1.4.1 contract versions. This is because the safe uses the old EIP-1271 interface, which uses `bytes` instead of `bytes32` for the message; we need to use the pre-image of the message to calculate the message hash. This parameter is used in conjunction with the SAFE_SIGNATURE signing method.

```typescript
const rawMessage: string | EIP712TypedData = "I am the owner of this Safe"
const message = protocolKit.createMessage(rawMessage)
const signedMessage = await protocolKit.signMessage(message)
```

Optionally, an additional parameter can be passed to specify a different way of signing:

```typescript
const signedMessage = await protocolKit.signMessage(signedMessage, SigningMethod.ETH_SIGN_TYPED_DATA_V4) // Default option
const signedMessage = await protocolKit.signMessage(signedMessage, SigningMethod.ETH_SIGN)
const signedMessage = await protocolKit.signMessage(signedMessage, SigningMethod.SAFE_SIGNATURE, parentSafeAddress).
```
