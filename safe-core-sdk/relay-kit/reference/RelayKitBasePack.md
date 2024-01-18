# RelayKitBasePack

To be used as part of the Relay Kit, new packs need to extend the `RelayKitBasePack` class. This abstract class provides a common interface that subclasses must implement. It provides the specific Safe common functionality that any custom implementation can leverage.

## Install dependencies

To use the `RelayKitBasePack`, you need to install the `@safe-global/relay-kit` package.

```bash
yarn add @safe-global/relay-kit
```

## Reference

This class is used to create new packs. Any new pack should extend this class and implement the abstract methods. Extending from the `RelayKitBasePack` class will give the subclass access to common Safe features.

```typescript
class MyPack extends RelayKitBasePack {
  // Implementation of the abstract methods
}
```

## Abstract methods that Relay packs must implement

These methods are the common interface for all the Relay packs. Check each pack's documentation to get more details.

### `getEstimateFee(chainId, gasLimit, gasToken?)`

Get an estimation of the fee that will be paid for a transaction.

### `createRelayedTransaction({ transactions, options?, onlyCalls? })`

Creates a Safe transaction designed to be executed using the relay.

It returns a Promise that resolves with a SafeTransaction object.

### `executeRelayTransaction(safeTransaction, options?)`

Sends the Safe transaction to the relay for execution.

If the Safe isn't deployed, it will create a transaction batch including the Safe deployment.

It returns a Promise that resolves with a RelayResponse object.

## Specific `RelayKitBasePack` methods

These methods provide the functionality associated with Safe so they can be used in the implementation of the packs.

> To be defined
