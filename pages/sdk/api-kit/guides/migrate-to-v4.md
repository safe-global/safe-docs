# Migrate to v4

This guide references the major changes between v3 and v4 to help those migrating an existing app.

## Use API key for default services

Public unauthenticated endpoints will be deprecated. A new `apiKey` parameter was added to the constructor so you can set your API key when running on Safe default services.

Follow [our guide](../../../core-api/how-to-use-api-keys.mdx) to get an API key.

Once you get your API key, simply pass it to the constructor:
```js
// old:
import SafeApiKit from '@safe-global/api-kit'

const chainId: bigint = 1n
const apiKit = new SafeApiKit({
chainId
})

//new:
import SafeApiKit from '@safe-global/api-kit'

const chainId: bigint = 1n
const apiKit = new SafeApiKit({
chainId,
apiKey: 'YOUR_API_KEY'
})
```

## Updated type

Endpoints returning `SafeMultisigTransactionListResponse` or types based in this one, have been updated to use the latest version. The following methods are affected:
 - `getTransaction()`
 - `getMultisigTransactions()`
 - `getPendingTransactions()`
 - `getAllTransactions()`
 - `proposeTransaction()`


You can expect the following type changes:
 - `nonce`: from `number` to `string`
 - `safeTxGas`: from `number` to `string`
 - `baseGas`: from `number` to `string`

