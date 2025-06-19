# Migrate to v2

This guide references the major changes between v1 and v2 to help those migrating an existing app.

**Note:** When upgrading to `protocol-kit` v2, it's necessary to upgrade to `safe-core-sdk-types` v3.

## Mastercopy to Singleton

To avoid confusion between terms used as synonyms, we aligned all our code to use the word `singleton`.

- Rename `isL1SafeMasterCopy` to `isL1SafeSingleton`
```js
// old:
SafeFactory.create({ ethAdapter, isL1SafeMasterCopy: true })

// new:
SafeFactory.create({ ethAdapter, isL1SafeSingleton: true })
```

## Ethers v6

From `protocolKit v2`, `EthersAdapter` will only be compatible with ethers.js v6. If you still need to use v5, we recommend you keep `protocolKit v1`, but we encourage you to migrate to the latest version when you can.

## Protocol Kit createTransaction() accepts only transaction array

In `protocolKit v1`, the `createTransaction()` method accepted either an object or an array as a parameter. To avoid confusion, we changed it to accept only an array. Here is a migration example:

```js
// old:
const safeTransactionData = {
  to: '',
  data: '',
  value: '',
  nonce: '',
  safeTxGas: ''
}
const safeTransaction = protocolKit.createTransaction({ safeTransactionData })

// new:
const safeTransactionData = {
  to: '',
  data: '',
  value: ''
}
const options = {
  nonce: '',
  safeTxGas: ''
}
const safeTransaction = protocolKit.createTransaction({
  transactions: [safeTransactionData],
  options
})
```
