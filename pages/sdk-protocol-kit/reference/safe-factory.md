# Safe Factory reference

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
