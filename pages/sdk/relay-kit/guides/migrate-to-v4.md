# Migrate to v4

This guide references the major changes between v3 and v4 to help those migrating an existing app.

## Default `safeModuleVersion` is 0.3.0

This is an important change, not in terms of code but in the behavior of the `Safe4337Pack`. We have added support for version 0.7 of the Entrypoint and are defaulting to `safeModuleVersion` 0.3.0, which is compatible only with this v0.7. If you are using version 0.6 of the Entrypoint, you need to set the `safeModuleVersion` to `0.2.0`.

```typescript
const safe4337Pack = await Safe4337Pack.init({
  provider: window.ethereum, // Or any compatible EIP-1193 provider,
  signer: 'signerAddressOrPrivateKey',
  safeModuleVersion: '0.2.0' // If you are using the v0.6 of the EntryPoint
  // ...
})
```

## FeeEstimator interface updated

The `IFeeEstimator` interface originally included three methods for users to hook into the process to estimate the fees of an User operation. In `relay-kit` version 4, we simplified the interface to feature only two methods that configure or update the User operation fields before and after calling the standard RPC estimation method (`eth_estimateUserOperationGas`). Additionally, we renamed the methods to be more descriptive.

The old interface had this 3 methods:

- `setupEstimation`: This method enable updating the gas related properties as needed before calling the `eth_estimateUserOperationGas` method.
- `adjustEstimation`: This method enable to adjust the gas related properties as needed after calling the `eth_estimateUserOperationGas` method.
- `getPaymasterEstimation`: This method is called to retrieve and adjust the paymaster related fields if we want to use the `paymaster` feature. It is only called in the code when the User Operation is sponsored.

The new interface has only two methods:

- `preEstimateUserOperationGas`: This method enable developers to update the gas or paymaster fields before calling `eth_estimateUserOperationGas`.
- `postEstimateUserOperationGas`: This method enable to adjust the gas or paymaster fields as needed after calling the `eth_estimateUserOperationGas` method.

With this new API, the user can have more control over the gas estimation process and enhance the flexibility of the User operation fields that we can updated after this call.

## `PimlicoCustomRpcSchema` with Pimlico the custom methods

We now have a separated `PimlicoCustomRpcSchema` that is used to define the custom RPC methods that are not part of the standard JSON-RPC methods. This schema is used to define the custom methods that are used in the `Pimlico` module. If you want to create your own estimator and call non-standard methods you should create your own one. Previously the `PimlicoCustomRpcSchema` included both the standard and custom methods.

The former `PimlicoCustomRpcSchema` is now `Safe4337RpcSchema` and includes only the standard JSON-RPC methods.

````typescript
## `paymasterUrl` is now mandatory in `PaymasterOptions`

Previously the `paymasterUrl` was only mandatory to work with sponsored User operations. Now it is mandatory to be set in the `PaymasterOptions` object as we are calling paymaster specific RPC methods (`pm_getPaymasterStubData` and `pm_getPaymasterData`) to fill the paymaster related fields.

## Rename `addModulesLibAddress`

We renamed the `addModulesLibAddress` method to `safeModulesSetupAddress` to reflect the change of the Safe contract name.

```typescript
const safe4337Pack = await Safe4337Pack.init({
  provider: window.ethereum, // Or any compatible EIP-1193 provider,
  signer: 'signerAddressOrPrivateKey',
  bundlerUrl: 'https://...',
  customContracts: {
    safeModulesSetupAddress: '0x1234567890123456789012345678901234567890' // Previously addModulesLibAddress
  }
})
````

## Renamed `EthSafeOperation`

We renamed the `EthSafeOperation` to `BaseSafeOperation` so all the methods using it as a type in the `Safe4337Pack` will reflect this change

