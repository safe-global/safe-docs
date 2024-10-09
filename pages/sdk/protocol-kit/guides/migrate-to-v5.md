# Migrate to v5

This guide references the major changes between v4 and v5 to help those migrating an existing app.

## Removing `SafeFactory` class

The `SafeFactory` class, previously used for deploying Safes, has been removed. The functionality to deploy Safes is now directly available in the `Safe` class through the new `createSafeDeploymentTransaction` method.

### Old Method Using `SafeFactory`

```typescript
// old v4 code
import { SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit'

const safeFactory = await SafeFactory.init({
   provider,
   signer,
   safeVersion // Optional
})

const safeAccountConfig: SafeAccountConfig = {
   owners: ['0x...', '0x...', '0x...'],
   threshold: 2
}

const protocolKit = await safeFactory.deploySafe({
  safeAccountConfig,
  saltNonce // Optional
})

// Confirm the Safe is deployed and fetch properties
console.log('Is Safe deployed:', await protocolKit.isSafeDeployed())
console.log('Safe Address:', await protocolKit.getAddress())
console.log('Safe Owners:', await protocolKit.getOwners())
console.log('Safe Threshold:', await protocolKit.getThreshold())
```

### New Method Using `Safe` class

```typescript
// new v5 code
import Safe, { PredictedSafeProps } from '@safe-global/protocol-kit'

const predictSafe: PredictedSafeProps = {
  safeAccountConfig: {
    owners: ['0x...', '0x...', '0x...'],
    threshold: 2
  },
  safeDeploymentConfig: {
    saltNonce, // Optional
    safeVersion // Optional
  }
}

let protocolKit = await Safe.init({
  provider,
  signer,
  predictSafe
})

// you can predict the address of your Safe if the Safe version is `v1.3.0` or above
const safeAddress = await protocolKit.getAddress()

const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()

// Execute this transaction using the integrated signer or your preferred external Ethereum client
const client = await protocolKit.getSafeProvider().getExternalSigner()

const txHash = await client.sendTransaction({
  to: deploymentTransaction.to,
  value: BigInt(deploymentTransaction.value),
  data: deploymentTransaction.data as `0x${string}`,
  chain: sepolia
})

const txReceipt = await client.waitForTransactionReceipt({ hash: txHash })

// Reconnect to the newly deployed Safe using the protocol-kit
protocolKit = await protocolKit.connect({ safeAddress })

// Confirm the Safe is deployed and fetch properties
console.log('Is Safe deployed:', await protocolKit.isSafeDeployed())
console.log('Safe Address:', await protocolKit.getAddress())
console.log('Safe Owners:', await protocolKit.getOwners())
console.log('Safe Threshold:', await protocolKit.getThreshold())
```

### Predict the Safe Address

You can predict the address of a Safe account before its deployment, as long as you are using Safe `v1.3.0` or greater, by replacing the `SafeFactory.predictSafeAddress` method with the `Safe.getAddress` method:

```typescript
// old v4 code
const predictedSafeAddress = await safeFactory.predictSafeAddress(
  safeAccountConfig,
  saltNonce  // optional
)

// new v5 code
const predictedSafeAddress = await protocolKit.getAddress()
```

### Migration Steps

- Remove any import or reference of the `SafeFactory` class from your code.
- Replace the `SafeFactory.deploySafe` method with the `Safe.createSafeDeploymentTransaction` method where necessary. You can use your Ethereum client to execute this deployment transaction.
- To predict the Address of your Safe Account, replace the `SafeFactory.predictSafeAddress` method with the `Safe.getAddress` method.
- After the deployment transaction has been executed, it is necessary to reconnect the Protocol Kit instance to the newly created Safe address by using the `connect` method.

The removal of `SafeFactory` means there’s one less class to initialize and manage within your project. You can now directly use the `Safe` class to handle all operations related to Safes, including their deployment.
