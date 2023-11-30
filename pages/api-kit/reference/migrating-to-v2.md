# Migrating to v2

This guide references the major changes between v1 and v2 to help those migrating an existing app.

## API Kit constructor

It won't be necessary to specify a `txServiceUrl` in environments where Safe has a Transaction Service running. Providing the chain ID will be enough. If you want to use your custom service or the kit in a chain not supported by a Safe Transaction Service, you can add the `txServiceUrl` parameter.

```js
// old:
constructor({ txServiceUrl, ethAdapter }: SafeApiKitConfig)

// new:
constructor({ chainId, txServiceUrl? }: SafeApiKitConfig)
```

## Use the route you prefer

API Kit v1 forced any custom service to be hosted under the `/api` route of the URL specified in `txServiceUrl`. This isn't the case anymore; you can specify any preferred route or subdomain.

Note that if you use a custom service running under `/api`, you will now need to migrate as follows:

```js
// old:
const txServiceUrl = 'https://your-transaction-service-domain/'
constructor({ txServiceUrl, ethAdapter }: SafeApiKitConfig)

// new:
const txServiceUrl = 'https://your-transaction-service-domain/api'
constructor({ chainId, txServiceUrl? }: SafeApiKitConfig)
```

## MasterCopy to Singleton

To avoid confusion between terms used as synonyms, we aligned all our code to use the word `singleton`.

- Rename type `MasterCopyResponse` to `SafeSingletonResponse`
- Rename method `getServiceMasterCopiesInfo()` to `getServiceSingletonsInfo()`