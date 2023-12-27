# GelatoRelayPack

Gelato Relay Pack enables using Safe with [Gelato Relay](https://www.gelato.network/relay), that enables a convenient way to pay transaction gas using ERC20 tokens, or funds on a different chain.

## Install dependencies

To use the `GelatoRelayPack`, you must install the `@safe-global/relay-kit` package.

```bash
yarn add @safe-global/relay-kit
```

## Reference

The `GelatoRelayPack` class enables the use of [Gelato relay](https://docs.gelato.network/developer-services/relay) services with Safe. To use it, create an instance of the pack setting the correct options for each case.

There are 2 different ways to use the Gelato relay:
1. [Gelato 1Balance](https://docs.gelato.network/developer-services/relay/payment-and-fees#1balance)
2. [Gelato SyncFee](https://docs.gelato.network/developer-services/relay/payment-and-fees#syncfee)

To use Gelato 1Balance an [API key](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance-and-relay) is required.

```typescript
import { GelatoRelayPack } from '@safe-global/relay-kit'

const gelatoRelayPack = new GelatoRelayPack({
  protocolKit,
  apiKey: 'YOUR API KEY. ONLY MANDATORY FOR 1BALANCE.'
})
```

### `new GelatoRelayPack(gelatoConfig)`

**Parameters**

- `gelatoConfig` - The configuration for the Gelato relay pack. The options are:

```typescript
GelatoConfig {
  protocolKit: Safe
  apiKey?: string
}
```

The `protocolKit` is an instance of `@safe-global/protocolKit`. Please refer to [it's docs section](../../protocol-kit/reference/README.md#create-1).

You need to [get an API key](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance-and-relay) only if you want to use 1Balance.

### `createRelayedTransaction(createTransactionOptions)`

This method mimics the [`createTransaction`](../../protocol-kit/reference/README.md#createtransaction) from `@safe-global/protocol-kit`. It returns a Safe transaction ready to be signed by the owners and executed, but with the extra configuration to use Gelato relay.

**Parameters**

The `createTransactionOptions` options to be passed to the `createRelayedTransaction` method are:

```typescript
CreateTransactionOptions {
  transactions: MetaTransactionData[]
  onlyCalls?: boolean
  options?: MetaTransactionOptions
}
```

- `transactions` - an array of `MetaTransactionData` objects that represent the individual transactions we want to include in our MultiSend transaction.
- `onlyCalls` - the optional `callsOnly` parameter, which is `false` by default, allows to force the use of the `MultiSendCallOnly` instead of the `MultiSend` contract when sending a batch transaction.
- `options` - 

**Returns**

A `SafeTransaction` object that can be used directly with `@safe-global/protocol-kit`.

```typescript
SafeTransaction {
  data: SafeTransactionData
  signatures: Map<string, SafeSignature>
  addSignature(signature: SafeSignature): void
  encodedSignatures(): string
}
```

**Caveats**
- You can use the returned `SafeTransaction` object directly with `@safe-global/protocol-kit`:
```typescript
const safeTransaction = await relayKit.createRelayedTransaction({ transactions })

const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction)
```

### `executeRelayTransaction(executeTransactionOptions)`

This method mimics the [`executeTransaction`](../../protocol-kit/reference/README.md#executetransaction) from `@safe-global/protocol-kit`. It sends a signed Safe transaction and returns the Gelato relay taskId.

**Parameters**

The `executeTransactionOptions` options to be passed to the `executeRelayTransaction` method are:

```typescript
ExecuteTransactionOptions {
  safeTransaction: SafeTransaction[]
  options?: MetaTransactionOptions
}
```

**Returns**

An object with the Gelato relay response.

```typescript
RelayResponse {
  taskId: string
}
```

**Caveats**

- The `taskId` returned can be used to retrieve the task status.
```typescript
console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)
```
