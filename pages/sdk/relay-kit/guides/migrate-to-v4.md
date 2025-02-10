# Migrate to v4

This guide references the major changes between v3 and v4 to help those migrating an existing app.

## FeeEstimator interface updated

The v3 interface included three methods for users to estimate the fees of the User operation. In v4, we simplified the interface to include only two methods that configure or update the User operation fields before and after calling the standard RPC estimation. We also renamed the methods to make them more descriptive.

The old interface had this 3 methods:

- `setupEstimation`: This method updates the gas values as needed before calling the `eth_estimateUserOperationGas` method.
- `adjustEstimation`: This method adjusts the gas values as needed after calling the `eth_estimateUserOperationGas` method.
- `getPaymasterEstimation`: This method estimates the paymaster fees if we want to use the `paymaster` feature. It is only called in the code when the User Operation is sponsored.

The new interface has only two methods:

- `preEstimateUserOperationGas`: This method allows developers to update the gas or paymaster fields before calling `eth_estimateUserOperationGas`.
- `postEstimateUserOperationGas`: This method can adjust the gas or paymaster fields as needed after calling the `eth_estimateUserOperationGas` method.

With this new API, the user can have more control over the gas estimation process.
