# Migrating to v1

This guide references the major changes between `safe-service-client` and `api-kit` v1 to help those migrating an existing application.

**Note:** Follow this guide before migrating to `api-kit` v2.

After completing this guide, you can remove `@safe-global/safe-service-client` from your package.json`.

## Adding the new dependency

To add the API Kit to your project, run the following:

```bash
yarn add @safe-global/api-kit@1.3.1
```

Change your initialization like this:

```typescript
// old
import SafeServiceClient from '@safe-global/safe-service-client'

const safeService = new SafeServiceClient({
  txServiceUrl: 'https://your-transaction-service-url',
  ethAdapter
})

// new
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  txServiceUrl: 'https://your-transaction-service-url',
  ethAdapter
})
```

## `getSafeDelegates()`

The `getSafeDelegates` was updated to accept more filtering parameters. Now, it accepts an object with multiple properties instead of only the `safeAddress` parameter.

```typescript
const delegateConfig: GetSafeDelegateProps = {
  safeAddress, // Optional
  delegateAddress, // Optional
  delegatorAddress, // Optional
  label, // Optional
  limit, // Optional
  offset // Optional
}
const delegates: SafeDelegateListResponse =
  await apiKit.getSafeDelegates(delegateConfig)
```

## `addSafeDelegate()`

Parameter object properties were updated as follows:

```typescript
// old
const delegateConfig: SafeDelegateConfig = {
  safe,
  delegate,
  label,
  signer
}
await safeService.addSafeDelegate(delegateConfig)

// new
const delegateConfig: AddSafeDelegateProps = {
  safeAddress, // Optional
  delegateAddress,
  delegatorAddress,
  label,
  signer
}
await apiKit.addSafeDelegate(delegateConfig)
```

## `removeAllSafeDelegates()`

The method was deprecated and removed.

## `removeSafeDelegate()`

Parameter object properties were updated as follows:

```typescript
// old
const delegateConfig: SafeDelegateDeleteConfig = {
  safe,
  delegate,
  signer
}
await safeService.removeSafeDelegate(delegateConfig)

// new
const delegateConfig: DeleteSafeDelegateProps = {
  delegateAddress,
  delegatorAddress,
  signer
}
await apiKit.removeSafeDelegate(delegateConfig)
```

## `getBalances()`

The method was deprecated and removed.

## `getUSDBalances()`

The method was deprecated and removed.

## `getCollectibles()`

The method was deprecated and removed.
