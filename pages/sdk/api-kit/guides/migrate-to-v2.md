# Migrate to v2

This guide references the major changes between v1 and v2 to help those migrating an existing app.

## API Kit constructor

It won't be necessary to specify a `txServiceUrl` in environments where Safe has a Transaction Service running. Providing the chain ID will be enough. If you want to use your custom service or the kit in a chain not supported by a Safe Transaction Service, you can add the `txServiceUrl` parameter.

```js
// old:
import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  txServiceUrl: 'https://your-transaction-service-url',
  ethAdapter
})

// new:
import SafeApiKit from '@safe-global/api-kit'

const chainId: bigint = 1n
const apiKit = new SafeApiKit({
  chainId
})

// or set a custom Transaction Service
const apiKit = new SafeApiKit({
  chainId,
  txServiceUrl: 'https://your-transaction-service-url'
})
```

## Use the route you prefer

API Kit v1 forced any custom service to be hosted under the `/api` route of the URL specified in `txServiceUrl`. This isn't the case anymore; you can specify any preferred route or subdomain.

Note that if you use a custom service running under `/api`, you will now need to migrate as follows:

```js
// old:
const txServiceUrl = 'https://your-transaction-service-domain/'
const apiKit = new SafeApiKit({
  txServiceUrl,
  ethAdapter
})
// new:
const chainId: bigint = 1n
const txServiceUrl = 'https://your-transaction-service-domain/api'
const apiKit = new SafeApiKit({
  chainId,
  txServiceUrl
})
```

## MasterCopy to Singleton

To avoid confusion between terms used as synonyms, we aligned all our code to use the word `singleton`.

- Rename type `MasterCopyResponse` to `SafeSingletonResponse`
- Rename method `getServiceMasterCopiesInfo()` to `getServiceSingletonsInfo()`