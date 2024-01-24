# Migrating to v1

This guide references the major changes between `safe-core-sdk` and `protocol-kit` v1 to help those migrating an existing application.

**Note:** Follow this guide before migrating to `protocol-kit` v2.

You can remove `@safe-global/safe-core-sdk` from your `package.json` after completing this guide.

## Adding the new dependency

To add the Protocol Kit to your project, run the following:

```bash
yarn add @safe-global/protocol-kit@1.3.0
```

If you use the types library, you will need to update to v2.3.0:

```bash
yarn add @safe-global/safe-core-sdk-types@2.3.0
```

## `EthAdapter`

### `EthersAdapter` (safe-ethers-lib)

`EthersAdapter` isn't in a separate package anymore. Now, it's provided inside the `protocol-kit` package.

**`protocol-kit v1` only supports `ethers v5`**

```typescript
// old
import EthersAdapter from '@safe-global/safe-ethers-lib'

// new
import { EthersAdapter } from '@safe-global/protocol-kit'
```

After this change, you can remove `@safe-global/safe-ethers-lib` from your `package.json`.

### `Web3Adapter` (safe-web3-lib)

`Web3Adapter` isn't in a separate package anymore. Now, it's part of the `protocol-kit` package.

**Note:** `protocol-kit` v1 only supports Web3.js v1.

```typescript
// old
import Web3Adapter from '@safe-global/safe-web3-lib'

// new
import { Web3Adapter } from '@safe-global/protocol-kit'
```

After this change, you can remove `@safe-global/safe-web3-lib` from your `package.json`.

### Type changes

Type changes are affecting the web3 and ethers adapter libraries.

`getSafeContract`, `getMultisendContract`, `getMultisendCallOnlyContract`, `getCompatibilityFallbackHandlerContract`, `getSafeProxyFactoryContract`, `getSignMessageLibContract` and `getCreateCallContract` don't need the `chainId` parameter anymore, they will use the chain set on the provider. Also, they return a `Promise` now.

`estimateGas` now returns a `string` instead of a `number`.

## `safeFactory.deploySafe()`

`SafeDeploymentConfig` was simplified. If you were using a `saltNonce` you should set it like this:

```typescript
// old
const safeAccountConfig: SafeAccountConfig = {
  ...
}
const safeDeploymentConfig: SafeDeploymentConfig = { saltNonce }

const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, safeDeploymentConfig })

// new
const safeAccountConfig: SafeAccountConfig = {
  ...
}

const saltNonce = '<YOUR_CUSTOM_VALUE>'

const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, saltNonce })
```

## `getAddress()`

The `getAddress()` method now returns a `Promise`.

```typescript
// old
const safeAddress = safeSdk.getAddress()

// new
const safeAddress = await protocolKit.getAddress()
```

## General type changes

If you set `safeTxGas`, `baseGas`, or `gasPrice`, you must use the type `string` instead of `number`.
