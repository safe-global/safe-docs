# Safe4337Pack reference

# Safe4337Pack

Safe4337 Pack provides an implementation of the `RelayKitBasePack` enabling Safe accounts to operate with `UserOperations` so to work woth the [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) standard proposal.

## Install Dependencies

To use `Safe4337Pack` in your project, first, install our relay-kit package using the following command:

```bash
yarn add @safe-global/relay-kit@2.1.0-alpha.0
```

## Reference

The `Safe4337Pack` class enables the use of the [Safe 4337 Module](https://github.com/safe-global/safe-modules/tree/main/modules/4337/contracts/Safe4337Module.sol) with your Safe. This allows to create, sign, and execute transactions bundled in User Operations

```typescript
const safe4337Pack = await Safe4337Pack.init({
  ethersAdapter,
  rpcUrl,
  bundlerUrl,
  options,
});
```

### static async init(initOptions)

The static method `init()` creates an instance of the `Safe4337Pack`. This method should be used to create the initial instance instead the regula constructor.

**Parameters**

The `Safe4337InitOptions` used with the `init()` method are:

```
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
  paymasterOptions?: paymasterOptions
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
```

- **`ethersAdapter`** : An instance of the `EthersAdapter` class.
- **`rpcUrl`** : The URL of the Ethereum node.
- **`bundlerUrl`** : The URL of the bundler.
- **`safeModulesVersion`** : The version of the Safe modules.
- **`customContracts`** : An object containing custom contract addresses.
  - **`entryPointAddress`** : The address of the entry point.
  - **`safe4337ModuleAddress`** : The address of the Safe4337 module.
  - **`addModulesLibAddress`** : The address of the AddModules library.
- **`options`** : The options for the Safe.
  - **`safeAddress`** : The address of the Safe.
  - **`owners`** : An array of Safe owners.
  - **`threshold`** : The Safe threshold.
  - **`safeVersion`** : The Safe version.
  - **`saltNonce`** : The Safe nonce.
- **`paymasterOptions`** : The options for the paymaster.

**Returns**
A promise that resolves to an instance of the `Safe4337Pack`.

**Caveats**
// TODO: Important method with lot of logic so this section should be exposed

### new Safe4337Pack({protocolKit, bundlerClient, publicClient, bundlerUrl, paymasterOptions, entryPointAddress, safe4337ModuleAddress})

The Safe4337 constructor is used inside the `init()` method and initializes the class properties.

### async getEstimateFee({ safeOperation, feeEstimator }

Estimates gas for `SafeOperation`. This is called from the createTransaction method so is not intended to be used directly.

**Parameters**

- **`safeOperation`** : Object that contains the Safe user operation.
- **`feeEstimator`** : A custom estimator depending on the provider.

**Returns**
A promise that resolves to the `SafeOperation`.

### async createTransaction(safe4337CreateTransactionProps)

Creates a relayed transaction using a batch of transactions.

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
  - **`amountToApprove`** : The amount to approve.
  - **`validUntil`** : The valid until timestamp.
  - **`validAfter`** : The valid after timestamp.
  - **`feeEstimator`** : The fee estimator.

**Returns**
A promise that resolves to the `SafeOperation`.

### async signSafeOperation(safeOperation, signingMethod)

Signs a safe operation and returns the `SafeOperation`.

**Parameters**

- **`safeOperation`** : The `SafeOperation` to sign.
- **`signingMethod`** : The method to use for signing the transaction. The default is `SigningMethod.ETH_SIGN_TYPED_DATA_V4`.

**Returns**
A promise that resolves to the signed `SafeOperation`.

### async executeTransaction(safe4337ExecutableProps)

Executes a given `safeOperation`.

**Parameters**
The Safe4337ExecutableProps

```typescript
Safe4337ExecutableProps = {
  executable: SafeOperation,
};
```

- **`executable`** : A `SafeOperation` to execute.

**Returns**
A promise, resolves to user operation hash string.

### async sendUserOperation(userOpWithSignature)

Sends a `UserOperation` with a signature to the bundler. This is called from the executeTransaction method so is not intended to be used directly.

**Parameters**

- **`userOpWithSignature`** : The `UserOperation` with a signature.

**Returns**
The user operation hash

### async getUserOperationByHash(userOpHash)

Get `UserOperation` by its hash.

**Parameters**

- **`userOpHash`** : Unique identifier for the `UserOperation`

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

### async getUserOperationReceipt(userOpHash)

Get `UserOperation` receipt by a hash.

**Parameters**

- **`userOpHash`** : Unique identifier for the `UserOperation`

**Returns**
A Promise that resolves to `UserOperationReceipt`.

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

### async getSupportedEntryPoints()

Get all supported entry points.

**Returns**
A Promise that resolves to an array of the entry point addresses (strings) supported by the client.

### async getChainId()

Get the EIP-155 Chain ID.

**Returns**
A Promise that resolves to the EIP-155 Chain ID string.

## Quick example

The following is a simple example of how to use the Safe4337Pack:

```typescript

```
