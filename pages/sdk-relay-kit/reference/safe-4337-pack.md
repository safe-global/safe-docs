# Safe4337Pack reference

# Safe4337Pack

Safe4337 Pack provides an implementation of the `RelayKitBasePack` enabling Safe accounts to operate with `UserOperations` so to work work with the [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) standard proposal.

## Install Dependencies

To use `Safe4337Pack` in your project, first, install our relay-kit package using the following command:

```bash
yarn add @safe-global/relay-kit@2.1.0-alpha.0
```

## Reference

The `Safe4337Pack` class enables the use of the [Safe 4337 Module](https://github.com/safe-global/safe-modules/tree/main/modules/4337/contracts/Safe4337Module.sol) with your Safe. This allows to create, sign, and execute transactions bundled in User Operations with a chosen provider. You can choose the [bundler](https://www.erc4337.io/docs/bundlers/introduction) or [paymaster](https://www.erc4337.io/docs/paymasters/introduction) of your choice.

```typescript
const safe4337Pack = await Safe4337Pack.init({
  ethersAdapter,
  rpcUrl,
  bundlerUrl,
  safeModulesVersion,
  customContracts,
  options,
  paymasterOptions,
});
```

### static async init(safe4337InitOptions)

The static method `init()` creates an instance of the `Safe4337Pack`. This method should be used to create the initial instance instead the regular constructor.

**Parameters**

The `Safe4337InitOptions` used with the `init()` method are:

```typescript
Safe4337InitOptions = {
  ethersAdapter: EthersAdapter
  bundlerUrl: string
  rpcUrl: string
  safeModulesVersion?: string
  customContracts?: {
    entryPointAddress?: string
    safe4337ModuleAddress?: string
    addModulesLibAddress?: string
  }
  options: ExistingSafeOptions | PredictedSafeOptions
  paymasterOptions?: PaymasterOptions
}

ExistingSafeOptions = {
  safeAddress: string
}

PredictedSafeOptions = {
  owners: string[]
  threshold: number
  safeVersion?: SafeVersion
  saltNonce?: string
}

PaymasterOptions = {
  paymasterUrl?: string
  isSponsored?: boolean
  sponsorshipPolicyId?: string
  paymasterAddress: string
  paymasterTokenAddress?: string
  amountToApprove?: bigint
}
```

- **`ethersAdapter`** : An instance of the `EthersAdapter` class.
- **`rpcUrl`** : The RPC url for the chosen chain.
- **`bundlerUrl`** : The URL of the bundler.
- **`safeModulesVersion`** : The version of the [Safe modules contract](https://github.com/safe-global/safe-modules-deployments/tree/main/src/assets/safe-4337-module).
- **`customContracts`** : An object containing custom contract addresses. This is optional and if no custom contracts are provided we will use some defaults
  - **`entryPointAddress`** : The address of the entry point. The SDK uses a default address calling the `eth_supportedEntryPoints` when not provided.
  - **`safe4337ModuleAddress`** : The address of the Safe4337 module. The SDK uses a default address from the [`safe-modules-deployments`](https://github.com/safe-global/safe-modules-deployments/tree/main/src/assets/safe-4337-module) repo when not provided.
  - **`addModulesLibAddress`** : The address of the AddModules library. The SDK uses a default address from the [`safe-modules-deployments`](https://github.com/safe-global/safe-modules-deployments/tree/main/src/assets/safe-4337-module) repo when not provided.
- **`options`** : The options for the Safe account.
  - **`safeAddress`** : The address of the Safe. You can provide only this prop for using an existing Safe account.
  - **`owners`** : An array of Safe owners.
  - **`threshold`** : The Safe threshold. This is the number of owners required to sign to execute a transaction.
  - **`safeVersion`** : The version of the [Safe contract](https://github.com/safe-global/safe-deployments/tree/main/src/assets).
  - **`saltNonce`** : The Safe salt. Changing this value will create different Safe (predicted) addresses
- **`paymasterOptions`** : The options for the paymaster.
  - **`paymasterUrl`** : The URL of the paymaster. You can get this URL from the management Dashboard of the chosen paymaster services provider. This URL is going to be used to get accurate gas estimations
  - **`isSponsored`** : A boolean to indicate if we want to use a paymaster fo sponsor transactions.
  - **`sponsorshipPolicyId`** : The sponsorship policy ID. You can get this ID from the management Dashboard of the chosen paymaster services provider.
  - **`paymasterAddress`** : The address of the paymaster contract to be used.
  - **`paymasterTokenAddress`** : The address of the paymaster token to be used to pay the transactions.
  - **`amountToApprove`** : The amount of the `paymasterTokenAddress` to approve to be used.

**Returns**
A promise that resolves to an instance of the `Safe4337Pack`.

**Caveats**

- This method should be used to create the initial instance instead of the regular constructor.
- You can use [this](https://github.com/safe-global/safe-core-sdk/tree/main/packages/protocol-kit/src/adapters/ethers) for reference to create `EthersAdapter` instances.
- You can get different url's and contract addresses from the management Dashboards of the chosen provider as the `bundlerUrl`, `paymasterUrl`, `paymasterAddress` and `paymasterTokenAddress`, `sponsorshipPolicyId` and even the `rpcUrl`
- The SDK uses some [default versions](https://github.com/safe-global/safe-core-sdk/blob/924ae56ff707509e561c99296fb5e1fbc2050d28/packages/relay-kit/src/packs/safe-4337/Safe4337Pack.ts#L34-L35) when `safeModulesVersion` or `safeVersion` are not provided.
- The `saltNonce` affects the output Safe address based on the `protocol-kit` way of [generating predicted addresses](https://github.com/safe-global/safe-core-sdk/blob/924ae56ff707509e561c99296fb5e1fbc2050d28/packages/protocol-kit/src/contracts/utils.ts#L245-L315)
- There are two typical ways of initialize the pack. One is using an existing account with the `safeAddress` prop and the other is using the `owners`, `threshold`, `saltNonce`, and `safeVersion` props to predict a new Safe account. You can use this second method as well with existing addresses as the output address generated from the prediction will be the same given the same inputs.
- Using a paymaster to sponsor transactions is optional. You can use the `isSponsored` prop to indicate if you want to use a paymaster to sponsor transactions. If you don't want to use a paymaster to sponsor transactions, you can omit the `paymasterOptions` prop. Some approvals are needed to use a paymaster to sponsor transactions.
- You can use the `amountToApprove` prop to specify the amount of the `paymasterTokenAddress` to approve to be used. You should use this prop when the Safe account does not exist and you want to approve the paymaster token to be used to pay the transactions and the Safe account deployment.

### new Safe4337Pack({protocolKit, bundlerClient, publicClient, bundlerUrl, paymasterOptions, entryPointAddress, safe4337ModuleAddress})

The `Safe4337Pack` constructor method is used inside the `init()` method and should not be used directly. The different params are calculated or provided by the `init()` method.

### async createTransaction(safe4337CreateTransactionProps)

Creates a `SafeOperation` using a batch of transactions. You can send multiple transactions to this method. Internally the SDK will bundle these transactions in a transaction batch that will be sent to the bundler as an `UserOperation`.

**Parameters**

The `Safe4337CreateTransactionProps`

```typescript
Safe4337CreateTransactionProps = {
  transactions: MetaTransactionData[]
  options?: {
    amountToApprove?: bigint
    validUntil?: number
    validAfter?: number
    feeEstimator?: IFeeEstimator
  }
}
```

- **`transactions`** : Array of `MetaTransactionData` to batch in a `SafeOperation`.
- **`options`** : Optional parameters.
  - **`amountToApprove`** : The amount to approve to the `paymasterTokenAddress`.
  - **`validUntil`** : The UserOperation will be valid until this block timestamp.
  - **`validAfter`** : The UserOperation will be valid valid after this block timestamp.
  - **`feeEstimator`** : The IFeeEstimator used to calculate gas requirements.

**Returns**
A promise that resolves to the `SafeOperation`.

**Caveats**

- The `SafeOperation` is similar to a regular `UserOperation` but with some Safe specific fields. We will transform the `SafeOperation` to a `UserOperation` before sending it to the bundler but we need to sign `SafeOperations` in order to be executable by the `Safe4337Module`.
- You can specify the `amountToApprove` in this method to approve the `paymasterTokenAddress` to be used to pay the transactions. Same concept as the `amountToApprove` in the `init()` method.
- We are maintaining the same API we use in the `protocol-kit` to create transactions in order to facilitate the developers the transition to use the`Safe4337Pack`. So we are going to `createTransaction`s and to `executeTransaction`s . Internally in these methods we are dealing with user operations that are going to bundle transactions and send those to the bundler.
- Use `validUntil` and `validAfter` to specify the block timestamp range where the UserOperation will be valid. The UserOperation will be valid until the `validUntil` block timestamp and valid after the `validAfter` block timestamp. The UserOperation will be rejected by the bundler if the block timestamp is outside this range.
- The `feeEstimator` is used to calculate the gas requirements for the UserOperation. We are using a default `feeEstimator` for Pimlico when not provided but if you want to use a different provider or specific estimations you should provide your own one. The IFeeEstimator interface is defined as follows so you should provide an object with the methods:

```typescript
IFeeEstimator {
  setupEstimation?: EstimateFeeFunction
  adjustEstimation?: EstimateFeeFunction
  getPaymasterEstimation?: EstimateSponsoredFeeFunction
}

 EstimateFeeFunctionProps = {
  userOperation: UserOperation
  bundlerUrl: string
  entryPoint: string
}

EstimateSponsoredFeeFunctionProps = {
  userOperation: UserOperation
  paymasterUrl: string
  entryPoint: string
  sponsorshipPolicyId?: string
}
```

All the methods are optional and will be called in the following order if you provide any of them:

1. `setupEstimation` : This method is invocated BEFORE the bundler `eth_estimateUserOperationGas` is called from the pack code. You can use this method to adjust the `UserOperation` before the being estimated by the bundler as each provider has it's own recommendations.
2. `adjustEstimation` : This method is invocated AFTER the `eth_estimateUserOperationGas` is called from the pack code. Use this method to adjust the bundler estimation.
3. `getPaymasterEstimation` : This method is invocated AFTER the bundler `eth_estimateUserOperationGas` is called from the pack code and IF the UserOperation `isSponsored`. Use this method to adjust the bundler estimation when using a paymaster to sponsor the transaction.

### async signSafeOperation(safeOperation, signingMethod)

Signs a `SafeOperation`.

**Parameters**

- **`safeOperation`** : The `SafeOperation` to sign.
- **`signingMethod`** : The method to use for signing the transaction. The default is `SigningMethod.ETH_SIGN_TYPED_DATA_V4`.

**Returns**
A promise that resolves to the signed `SafeOperation`.

**Caveats**

- Use this method after the `SafeOperation` is generated with the `createTransaction` method.
- This method will add the signature of the signer contained in the `EthersAdapter` to the signatures map of the `SafeOperation` object. More signatures can be added when we have more than one owner.
- It works similar to the regular `signTransaction` and `signMessafe` methods in the `protocol-kit` but with a `SafeOperation` instead of a `SafeTransaction` or `SafeMessage`. For reference you can read more on the Safe [docs](https://docs.safe.global/sdk/protocol-kit/guides/signatures)

### async executeTransaction(safe4337ExecutableProps)

This method send the `UserOperation` to the bundler.

**Parameters**
The Safe4337ExecutableProps

```typescript
Safe4337ExecutableProps = {
  executable: SafeOperation,
};
```

- **`executable`** : The `SafeOperation` to execute.

**Returns**
A promise, resolves to `UserOperation` hash string.

**Caveats**

- This method transforms the `SafeOperation` to a regular `UserOperation` and sends it to the bundler. The `SafeOperation` should be previously created and signed by the Safe owner (`EthersAdapter`).
- You can use the `UserOperation` hash to browse the status in `https://jiffyscan.xyz/userOpHash/{userOpHash}`

### async getUserOperationByHash(userOpHash)

Get `UserOperation` by its hash.

**Parameters**

- **`userOpHash`** : The `UserOperation` hash returned by the `executeTransaction` method. The `UserOperation` could be executed or only included by the bundler.

**Returns**
A Promise that resolves to `UserOperationWithPayload`.

```typescript
UserOperationWithPayload = {
  userOperation: UserOperation
  entryPoint: string
  transactionHash: string
  blockHash: string
  blockNumber: string
}
```

**Caveats**

- Use this method to requests information about the `UserOperation` sent to the bundler.

### async getUserOperationReceipt(userOpHash)

Get `UserOperation` receipt by a hash.

**Parameters**

- **`userOpHash`** : Unique identifier for the `UserOperation`

**Returns**
A Promise that resolves to `UserOperationReceipt` after the `UserOperation` is executed.

```typescript
UserOperationReceipt = {
  userOpHash: string
  sender: string
  nonce: string
  actualGasUsed: string
  actualGasCost: string
  success: boolean
  logs: Log[]
  receipt: Receipt
}
```

**Caveats**

- Use this method to get the complete execution trace and status
- You can use this method to determine if the `UserOperation` was executed successfully or not by calling the method until the receipt is available.

### async getSupportedEntryPoints()

Get all supported entry points.

**Returns**
A Promise that resolves to an array of the entry point addresses (strings) supported by the bundler.

**Caveats**
We use this method to get the default entry point when not provided in the `init()` method.

### async getChainId()

Get the EIP-155 Chain ID.

**Returns**
A Promise that resolves to the EIP-155 Chain ID string.
