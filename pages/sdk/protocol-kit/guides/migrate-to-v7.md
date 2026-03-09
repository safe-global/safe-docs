# Migrate to v7

## Overview

This release adds support for Safe v1.5.0 smart contracts across the SDK suite (`types-kit`, `protocol-kit`, `api-kit`, and `sdk-starter-kit`). It includes breaking changes that require attention when upgrading.

## Breaking Changes

### 1. `DEFAULT_SAFE_VERSION` changed from `1.3.0` to `1.4.1`

**Affected package:** `protocol-kit`

The default Safe version used when no explicit version is provided has changed from `1.3.0` to `1.4.1`. This affects Safe creation, deployment, and address prediction.

**Before:**

```typescript
// Implicitly deployed a Safe v1.3.0
const protocolKit = await Safe.init({
  provider,
  signer,
  predictedSafe: {
    safeAccountConfig: { owners, threshold }
  }
})
```

**After:**

```typescript
// Now implicitly deploys a Safe v1.4.1
const protocolKit = await Safe.init({
  provider,
  signer,
  predictedSafe: {
    safeAccountConfig: { owners, threshold }
  }
})
```

**How to migrate:**

If your application depends on deploying Safe v1.3.0 contracts, explicitly set the version:

```typescript
const protocolKit = await Safe.init({
  provider,
  signer,
  predictedSafe: {
    safeAccountConfig: { owners, threshold },
    safeDeploymentConfig: {
      safeVersion: '1.3.0'
    }
  }
})
```

### 2. `encodeTransactionData` removed from the Safe contract in v1.5.0

**Affected packages:** `protocol-kit`, `types-kit`

In Safe v1.5.0, the `encodeTransactionData` function has been removed from the Safe contract and relocated to the `CompatibilityFallbackHandler`.

**Before (≤ v1.4.1):**

```typescript
// Called directly on the Safe contract
const data = await safeContract.encodeTransactionData(
  to,
  value,
  data,
  operation,
  safeTxGas,
  baseGas,
  gasPrice,
  gasToken,
  refundReceiver,
  nonce
)
```

**After (v1.5.0):**

Calling `encodeTransactionData` on a Safe v1.5.0 contract will **revert on-chain**.

**How to migrate:**

For Safe v1.5.0, use the `CompatibilityFallbackHandler` contract instead:

```typescript
import { getCompatibilityFallbackHandlerContract } from '@safe-global/protocol-kit'

const fallbackHandler = await getCompatibilityFallbackHandlerContract({
  safeProvider,
  safeVersion: '1.5.0'
})

const data = await fallbackHandler.encodeTransactionData(
  to,
  value,
  data,
  operation,
  safeTxGas,
  baseGas,
  gasPrice,
  gasToken,
  refundReceiver,
  nonce
)
```

If you need to support multiple Safe versions, add a version check:

```typescript
import { semverSatisfies } from '@safe-global/protocol-kit'

if (semverSatisfies(safeVersion, '>=1.5.0')) {
  // Use CompatibilityFallbackHandler
} else {
  // Use Safe contract directly
}
```

### 3. Legacy `isValidSignature(bytes, bytes)` removed in v1.5.0

**Affected package:** `protocol-kit`

The `CompatibilityFallbackHandler` in Safe v1.5.0 no longer exposes the legacy `isValidSignature(bytes, bytes)` overload. Only the modern EIP-1271 overload `isValidSignature(bytes32, bytes)` is supported.

**Before (≤ v1.4.1):**

The SDK called both overloads in parallel during signature validation:

- `isValidSignature(bytes32, bytes)` — EIP-1271 standard
- `isValidSignature(bytes, bytes)` — Legacy overload

**After (v1.5.0):**

Only the modern overload is called. The legacy call would **revert or return invalid data** against a v1.5.0 Safe.

**How to migrate:**

If you are calling `isValidSignature` directly, ensure you use the `bytes32` overload:

```typescript
// ✅ Correct for all versions
const result = await safeContract.isValidSignature(messageHash, signature)
// where messageHash is bytes32

// ❌ Will fail on v1.5.0
const result = await safeContract.isValidSignature(messageBytes, signature)
// where messageBytes is raw bytes
```

> **Note:** The SDK handles this internally. If you rely on the SDK's `isValidSignature` method in the `Safe` class, no changes are needed — the SDK now conditionally skips the legacy call for v1.5.0+.

### 4. `SafeVersion` type extended with `'1.5.0'`

**Affected package:** `types-kit`

The `SafeVersion` union type now includes `'1.5.0'` as a valid value.

**Before:**

```typescript
type SafeVersion = '1.0.0' | '1.1.1' | '1.2.0' | '1.3.0' | '1.4.1'
```

**After:**

```typescript
type SafeVersion = '1.0.0' | '1.1.1' | '1.2.0' | '1.3.0' | '1.4.1' | '1.5.0'
```

**How to migrate:**

If your code performs exhaustive checks on `SafeVersion`, add a case for `'1.5.0'`:

```typescript
// Before — will cause a TypeScript compilation error
switch (version) {
  case '1.0.0': // ...
  case '1.1.1': // ...
  case '1.2.0': // ...
  case '1.3.0': // ...
  case '1.4.1': // ...
  default:
    const \_exhaustive: never = version // ❌ TS error
}

// After — add the new version
switch (version) {
  case '1.0.0': // ...
  case '1.1.1': // ...
  case '1.2.0': // ...
  case '1.3.0': // ...
  case '1.4.1': // ...
  case '1.5.0': // ...
  default:
    const \_exhaustive: never = version // ✅
}
```

## New Features (non-breaking)

### ExtensibleFallbackHandler contract

A new `ExtensibleFallbackHandler` contract is available for Safe v1.5.0 with read and write methods:

```typescript
import { getExtensibleFallbackHandlerContract } from '@safe-global/protocol-kit'

const handler = await getExtensibleFallbackHandlerContract({
  safeProvider,
  safeVersion: '1.5.0'
})

// Read methods
await handler.domainVerifiers(safe, domainSeparator)
await handler.safeMethods(safe, selector)
await handler.safeInterfaces(safe, interfaceId)

// Write methods (executed as Safe transactions)
await handler.setSafeMethod(selector, newMethod)
await handler.setDomainVerifier(domainSeparator, verifier)
await handler.setSupportedInterface(interfaceId, supported)
```

### `checkNSignatures` with executor parameter

Safe v1.5.0 adds a new overload of `checkNSignatures` and `checkSignatures` that accepts an explicit `executor` address:

```typescript
// Original (all versions)
await safeContract.checkNSignatures(dataHash, signatures, requiredSignatures)

// New overload (v1.5.0 only)
await safeContract.checkNSignaturesWithExecutor(
  executor,
  dataHash,
  signatures,
  requiredSignatures
)
```

### Module Guard support

Safe v1.5.0 introduces module guards. New methods are available in the `Safe` class:

```typescript
// Enable a module guard
const tx = await protocolKit.createEnableModuleGuardTx(moduleGuardAddress)

// Disable the module guard
const tx = await protocolKit.createDisableModuleGuardTx()
```

> **Note:** Module guard functionality is only available for Safe v1.5.0+. Calling these methods on earlier versions will throw an error.

## Deprecations

### zkSync EraVM support in `predictSafeAddress`

The zkSync EraVM-specific logic in `predictSafeAddress` has been deprecated for Safe v1.5.0. If you are predicting Safe addresses on zkSync with v1.5.0 contracts, be aware that this path is no longer supported.

## Quick Reference

| Change                            | Action Required                                  | Packages                    |
| --------------------------------- | ------------------------------------------------ | --------------------------- |
| Default version → `1.4.1`         | Pin `safeVersion` explicitly if you need `1.3.0` | `protocol-kit`              |
| `encodeTransactionData` moved     | Use `CompatibilityFallbackHandler` for v1.5.0    | `protocol-kit`, `types-kit` |
| Legacy `isValidSignature` removed | Use `bytes32` overload only for v1.5.0           | `protocol-kit`              |
| `SafeVersion` type extended       | Add `'1.5.0'` case to exhaustive switches        | `types-kit`                 |
| ERC-4337 not yet supported        | Do not use `SafeOperation` with v1.5.0           | `sdk-starter-kit`           |
