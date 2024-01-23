# Reference

The [Protocol Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit) facilitates the interaction with the [Safe contracts](https://github.com/safe-global/safe-contracts).

## Install dependencies

To add the Protocol Kit to your project, run:

```bash
yarn add @safe-global/protocol-kit
```

## Safe Factory reference

### `create`

Returns an instance of the Safe Factory.

```typescript
import { SafeFactory } from '@safe-global/protocol-kit'

const safeFactory = await SafeFactory.create({ ethAdapter })
```

- The `isL1SafeSingleton` flag

  Two versions of the Safe contracts are available: [Safe.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/Safe.sol) that doesn't trigger events in order to save gas and [SafeL2.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/SafeL2.sol) that does, which is more appropriate for L2 networks.

  By default `Safe.sol` will be only used on Ethereum Mainnet. For the rest of the networks where the Safe contracts are already deployed, the `SafeL2.sol` contract will be used unless you add the `isL1SafeSingleton` flag to force the use of the `Safe.sol` contract.

  ```typescript
  const safeFactory = await SafeFactory.create({ ethAdapter, isL1SafeSingleton: true })
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

  const safeFactory = await SafeFactory.create({ ethAdapter, contractNetworks })
  ```

- The `safeVersion` property

  The `SafeFactory` constructor also accepts the `safeVersion` property to specify the Safe contract version that will be deployed. This string can take the values `1.0.0`, `1.1.1`, `1.2.0`, `1.3.0` or `1.4.1`. If not specified, the `DEFAULT_SAFE_VERSION` value will be used.

  ```typescript
  const safeVersion = 'X.Y.Z'
  const safeFactory = await SafeFactory.create({ ethAdapter, safeVersion })
  ```

### `deploySafe`

Deploys a new Safe and returns an instance of the Protocol Kit connected to the deployed Safe. The address of the singleton, Safe contract version and the contract (`Safe.sol` or `SafeL2.sol`) of the deployed Safe will depend on the initialization of the `safeFactory` instance.

```typescript
const safeAccountConfig: SafeAccountConfig = {
  owners,
  threshold,
  to, // Optional
  data, // Optional
  fallbackHandler, // Optional
  paymentToken, // Optional
  payment, // Optional
  paymentReceiver // Optional
}

const protocolKit = await safeFactory.deploySafe({ safeAccountConfig })
```

This method can optionally receive the `saltNonce` parameter.

```typescript
const safeAccountConfig: SafeAccountConfig = {
  owners,
  threshold,
  to, // Optional
  data, // Optional
  fallbackHandler, // Optional
  paymentToken, // Optional
  payment, // Optional
  paymentReceiver // Optional
}

const saltNonce = '<YOUR_CUSTOM_VALUE>'

const protocolKit = await safeFactory.deploySafe({ safeAccountConfig, saltNonce })
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
const protocolKit = await safeFactory.deploySafe({ safeAccountConfig, safeDeploymentConfig, options })
```

It can also take an optional callback which receives the `txHash` of the Safe deployment transaction prior to returning a new instance of the Protocol Kit:

```typescript
const callback = (txHash: string): void => {
  console.log({ txHash })
}

const protocolKit = await safeFactory.deploySafe({ safeAccountConfig, callback })
```

## Safe reference

### `create`

Returns an instance of the Protocol Kit connected to a Safe. The provided Safe must be a `safeAddress` or a `predictedSafe`.

Initialization of a deployed Safe using the `safeAddress` property:

```typescript
import Safe from '@safe-global/protocol-kit'

const protocolKit = await Safe.create({ ethAdapter, safeAddress })
```

Initialization of a not deployed Safe using the `predictedSafe` property. Because Safes are deployed in a deterministic way, passing a `predictedSafe` will allow to initialize the SDK with the Safe configuration and use it to some extent before it's deployed:

```typescript
import Safe, { PredictedSafeProps } from '@safe-global/protocol-kit'

const predictedSafe: PredictedSafeProps = {
  safeAccountConfig,
  safeDeploymentConfig
}

const protocolKit = await Safe.create({ ethAdapter, predictedSafe })
```

- The `isL1SafeSingleton` flag

  Two versions of the Safe contracts are available: [Safe.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/Safe.sol) that doesn't trigger events in order to save gas and [SafeL2.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/SafeL2.sol) that does, which is more appropriate for L2 networks.

  By default `Safe.sol` will be only used on Ethereum Mainnet. For the rest of the networks where the Safe contracts are already deployed, the `SafeL2.sol` contract will be used unless you add the `isL1SafeSingleton` flag to force the use of the `Safe.sol` contract.

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

### `connect`

Returns a new instance of the Protocol Kit connected to a new Safe or a new Signer. The new connected signer can be passed via the `ethAdapter` property while the new connected Safe can be passed using a `safeAddress` or a `predictedSafe`.

Connection of a deployed Safe using the `safeAddress` property:

```typescript
const protocolKit = await protocolKit.connect({ ethAdapter, safeAddress })
```

Connection of a not deployed Safe using the `predictedSafe` property. Because Safes are deployed in a deterministic way, passing a `predictedSafe` will allow to connect a Safe to the SDK with the Safe configuration:

```typescript
import { PredictedSafeProps } from '@safe-global/protocol-kit'

const predictedSafe: PredictedSafeProps = {
  safeAccountConfig,
  safeDeploymentConfig
}

const protocolKit = await protocolKit.connect({ ethAdapter, predictedSafe })
```

- The `isL1SafeSingleton` flag

  Two versions of the Safe contracts are available: [Safe.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/Safe.sol) that doesn't trigger events in order to save gas and [SafeL2.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/SafeL2.sol) that does, which is more appropriate for L2 networks.

  By default `Safe.sol` will be only used on Ethereum Mainnet. For the rest of the networks where the Safe contracts are already deployed, the `SafeL2.sol` contract will be used unless you add the `isL1SafeSingleton` flag to force the use of the `Safe.sol` contract.

  ```typescript
  const protocolKit = await Safe.connect({ ethAdapter, safeAddress, isL1SafeSingleton: true })
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
  const protocolKit = await Safe.connect({ ethAdapter, safeAddress, contractNetworks })
  ```

### `getAddress`

Returns the address of the current SafeProxy contract.

```typescript
const safeAddress = await protocolKit.getAddress()
```

### `getContractVersion`

Returns the Safe singleton contract version.

```typescript
const contractVersion = await protocolKit.getContractVersion()
```

### `getOwners`

Returns the list of Safe owner accounts.

```typescript
const ownerAddresses = await protocolKit.getOwners()
```

### `getNonce`

Returns the Safe nonce.

```typescript
const nonce = await protocolKit.getNonce()
```

### `getThreshold`

Returns the Safe threshold.

```typescript
const threshold = await protocolKit.getThreshold()
```

### `getChainId`

Returns the chain ID of the connected network.

```typescript
const chainId = await protocolKit.getChainId()
```

### `getBalance`

Returns the ETH balance of the Safe.

```typescript
const balance = await protocolKit.getBalance()
```

### `getGuard`

Returns the enabled Safe Guard or 0x address if no guards are enabled.

```typescript
const guardAddress = await protocolKit.getGuard()
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

### `isOwner`

Checks if a specific address is an owner of the current Safe.

```typescript
const isOwner = await protocolKit.isOwner(address)
```

### `createTransaction`

Returns a Safe transaction ready to be signed by the owners and executed. The Protocol Kit supports the creation of single Safe transactions but also MultiSend transactions.

This method takes an array of `MetaTransactionData` objects that represent the individual transactions we want to include in our MultiSend transaction.

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

In addition, the optional `callsOnly` parameter, which is `false` by default, allows to force the use of the `MultiSendCallOnly` instead of the `MultiSend` contract when sending a batch transaction:

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

### `createRejectionTransaction`

Returns a Safe transaction ready to be signed by the owners that invalidates the pending Safe transaction/s with a specific nonce.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const rejectionTransaction = await protocolKit.createRejectionTransaction(safeTransaction.data.nonce)
```

### `copyTransaction`

Copies a Safe transaction.

```typescript
const safeTransaction1 = await protocolKit.createTransaction({ transactions })
const safeTransaction2 = await copyTransaction(safeTransaction1)
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

### `signTypedData`

Signs a transaction according to the EIP-712 using the current signer account.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const signature = await protocolKit.signTypedData(safeTransaction)
```

### `signTransaction`

Returns a new `SafeTransaction` object that includes the signature of the current owner. `eth_sign` will be used by default to generate the signature.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await protocolKit.createTransaction({ transactions })
const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction)
```

Optionally, an additional parameter can be passed to specify a different way of signing:

```typescript
const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction, 'eth_signTypedData')
```

```typescript
const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction, 'eth_sign') // default option.
```

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

### `getEncodedTransaction`

Returns the Safe Transaction encoded. This method is useful when you don't want to execute the transaction directly but you want to send it to a third party to be executed.

```typescript
const transactionData: MetaTransactionData = { to, value, data }
const transaction = await protocolKit.createTransaction({ transactions: [safeTransactionData] })
const encodedTransaction = await protocolKit.getEncodedTransaction(transaction)
```

### `wrapSafeTransactionIntoDeploymentBatch`

Wraps a Safe transaction into a Safe deployment batch.
This function creates a transaction batch of 2 transactions, which includes the deployment of the Safe and the provided Safe transaction.

```typescript
const transactionData: MetaTransactionData = { to, value, data }
const transaction = await protocolKit.createTransaction({ transactions: [safeTransactionData] })
const wrappedTransaction = await protocolKit.wrapSafeTransactionIntoDeploymentBatch(safeTransaction)
```

### `createSafeDeploymentTransaction`

Creates a Safe deployment transaction.
This function prepares a transaction for the deployment of a Safe. Both the saltNonce and options parameters are optional, and if not provided, default values will be used.

```typescript
const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()
```

### `createTransactionBatch`

This function creates a batch of the provided Safe transactions using the MultiSend contract. It groups the transactions together into a single transaction which can then be executed atomically.

```typescript
const transaction = { to, value, data }
const batchTransaction = await safeSdk.createTransactionBatch([transaction, transaction])
```

### `getSafeMessageHash`

Retrieve the Safe message hash of a string or EIP-712 typed data. It produces the identical hash as invoking the CompatibilityFallbackHandler's getMessageHash method.

```typescript
const rawMessage = ... // String or EIP-712 typed data
const messageHash = hashSafeMessage(rawMessage)

const safeMessageHash = await protocolKit.getSafeMessageHash(messageHash)
```

### `isValidSignature`

Calls the CompatibilityFallbackHandler isValidSignature method (EIP-1271).

It requires 2 parameters:

- messageHash The hash of the message
- signature The signature to be validated or '0x'. You can send as signature one of the following:
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
