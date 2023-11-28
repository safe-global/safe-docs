# Migrate to v2

This guide references the major changes between v1 and v2 to help those migrating an existing app.

## GelatoRelayPack

- The `GelatoRelayPack` constructor now includes a mandatory `protocolKit` parameter. It's required for any new pack extending the `RelayKitBasePack`.

```js
constructor({ apiKey, protocolKit }: GelatoOptions)
```

- We removed the `protocolKit` parameter from the `createTransactionWithHandlePayment()`, `createTransactionWithTransfer()`, and `executeRelayTransaction()` methods in the `GelatoRelayPack` as now it's included in the constructor.

- Removed the `export interface RelayPack` type as we now use an abstract class.