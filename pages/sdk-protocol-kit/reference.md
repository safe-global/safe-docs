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

const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
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

const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, saltNonce })
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
const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, safeDeploymentConfig, options })
```

It can also take an optional callback which receives the `txHash` of the Safe deployment transaction prior to returning a new instance of the Protocol Kit:

```typescript
const callback = (txHash: string): void => {
  console.log({ txHash })
}

const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, callback })
```

## Safe reference

### `create`

Returns an instance of the Protocol Kit connected to a Safe. The provided Safe must be a `safeAddress` or a `predictedSafe`.

Initialization of a deployed Safe using the `safeAddress` property:

```typescript
import Safe from '@safe-global/protocol-kit'

const safeSdk = await Safe.create({ ethAdapter, safeAddress })
```

Initialization of a not deployed Safe using the `predictedSafe` property. Because Safes are deployed in a deterministic way, passing a `predictedSafe` will allow to initialize the SDK with the Safe configuration and use it to some extent before it's deployed:

```typescript
import Safe, { PredictedSafeProps } from '@safe-global/protocol-kit'

const predictedSafe: PredictedSafeProps = {
  safeAccountConfig,
  safeDeploymentConfig
}

const safeSdk = await Safe.create({ ethAdapter, predictedSafe })
```

- The `isL1SafeSingleton` flag

  Two versions of the Safe contracts are available: [Safe.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/Safe.sol) that doesn't trigger events in order to save gas and [SafeL2.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/SafeL2.sol) that does, which is more appropriate for L2 networks.

  By default `Safe.sol` will be only used on Ethereum Mainnet. For the rest of the networks where the Safe contracts are already deployed, the `SafeL2.sol` contract will be used unless you add the `isL1SafeSingleton` flag to force the use of the `Safe.sol` contract.

  ```typescript
  const safeSdk = await Safe.create({ ethAdapter, safeAddress, isL1SafeSingleton: true })
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

  const safeSdk = await Safe.create({ ethAdapter, safeAddress, contractNetworks })
  ```

### `connect`

Returns a new instance of the Protocol Kit connected to a new Safe or a new Signer. The new connected signer can be passed via the `ethAdapter` property while the new connected Safe can be passed using a `safeAddress` or a `predictedSafe`.

Connection of a deployed Safe using the `safeAddress` property:

```typescript
const safeSdk = await safeSdk.connect({ ethAdapter, safeAddress })
```

Connection of a not deployed Safe using the `predictedSafe` property. Because Safes are deployed in a deterministic way, passing a `predictedSafe` will allow to connect a Safe to the SDK with the Safe configuration:

```typescript
import { PredictedSafeProps } from '@safe-global/protocol-kit'

const predictedSafe: PredictedSafeProps = {
  safeAccountConfig,
  safeDeploymentConfig
}

const safeSdk = await safeSdk.connect({ ethAdapter, predictedSafe })
```

- The `isL1SafeSingleton` flag

  Two versions of the Safe contracts are available: [Safe.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/Safe.sol) that doesn't trigger events in order to save gas and [SafeL2.sol](https://github.com/safe-global/safe-contracts/blob/v1.4.1/contracts/SafeL2.sol) that does, which is more appropriate for L2 networks.

  By default `Safe.sol` will be only used on Ethereum Mainnet. For the rest of the networks where the Safe contracts are already deployed, the `SafeL2.sol` contract will be used unless you add the `isL1SafeSingleton` flag to force the use of the `Safe.sol` contract.

  ```typescript
  const safeSdk = await Safe.connect({ ethAdapter, safeAddress, isL1SafeSingleton: true })
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
  const safeSdk = await Safe.connect({ ethAdapter, safeAddress, contractNetworks })
  ```

### `getAddress`

Returns the address of the current SafeProxy contract.

```typescript
const safeAddress = await safeSdk.getAddress()
```

### `getContractVersion`

Returns the Safe singleton contract version.

```typescript
const contractVersion = await safeSdk.getContractVersion()
```

### `getOwners`

Returns the list of Safe owner accounts.

```typescript
const ownerAddresses = await safeSdk.getOwners()
```

### `getNonce`

Returns the Safe nonce.

```typescript
const nonce = await safeSdk.getNonce()
```

### `getThreshold`

Returns the Safe threshold.

```typescript
const threshold = await safeSdk.getThreshold()
```

### `getChainId`

Returns the chain ID of the connected network.

```typescript
const chainId = await safeSdk.getChainId()
```

### `getBalance`

Returns the ETH balance of the Safe.

```typescript
const balance = await safeSdk.getBalance()
```

### `getGuard`

Returns the enabled Safe Guard or 0x address if no guards are enabled.

```typescript
const guardAddress = await safeSdk.getGuard()
```

### `getModules`

Returns the list of addresses of all the enabled Safe Modules.

```typescript
const moduleAddresses = await safeSdk.getModules()
```

### `isModuleEnabled`

Checks if a specific Safe Module is enabled for the current Safe.

```typescript
const isEnabled = await safeSdk.isModuleEnabled(moduleAddress)
```

### `isOwner`

Checks if a specific address is an owner of the current Safe.

```typescript
const isOwner = await safeSdk.isOwner(address)
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
const safeTransaction = await safeSdk.createTransaction({ transactions })
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
const safeTransaction = await safeSdk.createTransaction({ transactions, options })
```

In addition, the optional `callsOnly` parameter, which is `false` by default, allows to force the use of the `MultiSendCallOnly` instead of the `MultiSend` contract when sending a batch transaction:

```typescript
const callsOnly = true
const safeTransaction = await safeSdk.createTransaction({
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
const safeTransaction = await safeSdk.createTransaction({ transactions })
const rejectionTransaction = await safeSdk.createRejectionTransaction(safeTransaction.data.nonce)
```

### `copyTransaction`

Copies a Safe transaction.

```typescript
const safeTransaction1 = await safeSdk.createTransaction({ transactions })
const safeTransaction2 = await copyTransaction(safeTransaction1)
```

### `getTransactionHash`

Returns the transaction hash of a Safe transaction.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await safeSdk.createTransaction({ transactions })
const txHash = await safeSdk.getTransactionHash(safeTransaction)
```

### `signHash`

Signs a hash using the current owner account.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await safeSdk.createTransaction({ transactions })
const txHash = await safeSdk.getTransactionHash(safeTransaction)
const signature = await safeSdk.signHash(txHash)
```

### `signTypedData`

Signs a transaction according to the EIP-712 using the current signer account.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await safeSdk.createTransaction({ transactions })
const signature = await safeSdk.signTypedData(safeTransaction)
```

### `signTransaction`

Returns a new `SafeTransaction` object that includes the signature of the current owner. `eth_sign` will be used by default to generate the signature.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await safeSdk.createTransaction({ transactions })
const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction)
```

Optionally, an additional parameter can be passed to specify a different way of signing:

```typescript
const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction, 'eth_signTypedData')
```

```typescript
const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction, 'eth_sign') // default option.
```

### `approveTransactionHash`

Approves a hash on-chain using the current owner account.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await safeSdk.createTransaction({ transactions })
const txHash = await safeSdk.getTransactionHash(safeTransaction)
const txResponse = await safeSdk.approveTransactionHash(txHash)
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
const txResponse = await safeSdk.approveTransactionHash(txHash, options)
```

### `getOwnersWhoApprovedTx`

Returns a list of owners who have approved a specific Safe transaction.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await safeSdk.createTransaction({ transactions })
const txHash = await safeSdk.getTransactionHash(safeTransaction)
const ownerAddresses = await safeSdk.getOwnersWhoApprovedTx(txHash)
```

### `createEnableFallbackHandlerTx`

Returns the Safe transaction to enable the fallback handler.

```typescript
const safeTransaction = await safeSdk.createEnableFallbackHandlerTx(fallbackHandlerAddress)
const txResponse = await safeSdk.executeTransaction(safeTransaction)
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
const safeTransaction = await safeSdk.createEnableFallbackHandlerTx(fallbackHandlerAddress, options)
```

### `createDisableFallbackHandlerTx`

Returns the Safe transaction to disable the fallback handler.

```typescript
const safeTransaction = await safeSdk.createDisableFallbackHandlerTx()
const txResponse = await safeSdk.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await safeSdk.createDisableFallbackHandlerTx(options)
```

### `createEnableGuardTx`

Returns the Safe transaction to enable a Safe Guard.

```typescript
const safeTransaction = await safeSdk.createEnableGuardTx(guardAddress)
const txResponse = await safeSdk.executeTransaction(safeTransaction)
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
const safeTransaction = await safeSdk.createEnableGuardTx(guardAddress, options)
```

### `createDisableGuardTx`

Returns the Safe transaction to disable a Safe Guard.

```typescript
const safeTransaction = await safeSdk.createDisableGuardTx()
const txResponse = await safeSdk.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await safeSdk.createDisableGuardTx(options)
```

### `createEnableModuleTx`

Returns a Safe transaction ready to be signed that will enable a Safe Module.

```typescript
const safeTransaction = await safeSdk.createEnableModuleTx(moduleAddress)
const txResponse = await safeSdk.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await safeSdk.createEnableModuleTx(moduleAddress, options)
```

### `createDisableModuleTx`

Returns a Safe transaction ready to be signed that will disable a Safe Module.

```typescript
const safeTransaction = await safeSdk.createDisableModuleTx(moduleAddress)
const txResponse = await safeSdk.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await safeSdk.createDisableModuleTx(moduleAddress, options)
```

### `createAddOwnerTx`

Returns the Safe transaction to add an owner and optionally change the threshold.

```typescript
const params: AddOwnerTxParams = {
  ownerAddress,
  threshold // Optional. If `threshold` isn't provided the current threshold won't change.
}
const safeTransaction = await safeSdk.createAddOwnerTx(params)
const txResponse = await safeSdk.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await safeSdk.createAddOwnerTx(params, options)
```

### `createRemoveOwnerTx`

Returns the Safe transaction to remove an owner and optionally change the threshold.

```typescript
const params: RemoveOwnerTxParams = {
  ownerAddress,
  newThreshold // Optional. If `newThreshold` isn't provided, the current threshold will be decreased by one.
}
const safeTransaction = await safeSdk.createRemoveOwnerTx(params)
const txResponse = await safeSdk.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await safeSdk.createRemoveOwnerTx(params, options)
```

### `createSwapOwnerTx`

Returns the Safe transaction to replace an owner of the Safe with a new one.

```typescript
const params: SwapOwnerTxParams = {
  oldOwnerAddress,
  newOwnerAddress
}
const safeTransaction = await safeSdk.createSwapOwnerTx(params)
const txResponse = await safeSdk.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await safeSdk.createSwapOwnerTx(params, options)
```

### `createChangeThresholdTx`

Returns the Safe transaction to change the threshold.

```typescript
const safeTransaction = await safeSdk.createChangeThresholdTx(newThreshold)
const txResponse = await safeSdk.executeTransaction(safeTransaction)
await txResponse.transactionResponse?.wait()
```

This method can optionally receive the `options` parameter:

```typescript
const options: SafeTransactionOptionalProps = { ... }
const safeTransaction = await safeSdk.createChangeThresholdTx(newThreshold, options)
```

### `isValidTransaction`

Checks if a Safe transaction can be executed successfully with no errors.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await safeSdk.createTransaction({ transactions })
const isValidTx = await safeSdk.isValidTransaction(safeTransaction)
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
const isValidTx = await safeSdk.isValidTransaction(safeTransaction, options)
```

### `executeTransaction`

Executes a Safe transaction.

```typescript
const transactions: MetaTransactionData[] = [{
  // ...
}]
const safeTransaction = await safeSdk.createTransaction({ transactions })
const txResponse = await safeSdk.executeTransaction(safeTransaction)
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
const txResponse = await safeSdk.executeTransaction(safeTransaction, options)
```
