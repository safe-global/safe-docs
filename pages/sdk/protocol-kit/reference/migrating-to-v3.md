# Migrate to v3

This guide references the major changes between v2 and v3 to help those migrating an existing app.

**Note:** When upgrading to `protocol-kit` v3, it's necessary to upgrade to `safe-core-sdk-types` v4.

## Method signTransactionHash() renamed to signHash()

The `signTransactionHash()` method was renamed to `signHash()` to align with the method's purpose. The method is not strictly for transactions as the parameter is a hash, so the new name is more accurate.

```js
// old:
protocolKit.signTransactionHash(safeTxHash);

// new:
protocolKit.signHash(safeTxHash);
```

## Type changes

The `SafeTransactionEIP712Args` was renamed to `SafeEIP712Args` as the EIP-712 are not exclusive for transactions.
