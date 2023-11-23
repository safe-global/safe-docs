# API Kit

The [API Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/api-kit) facilitates the interaction with the [Safe Transaction Service API](https://github.com/safe-global/safe-transaction-service).

## Install dependencies

To add the API Kit to your project, run:

```bash
yarn add @safe-global/api-kit
```

## Reference

### `getServiceInfo`

Returns the information and configuration of the service.

```typescript
const serviceInfo: SafeServiceInfoResponse = await safeService.getServiceInfo()
```

### `getServiceMasterCopiesInfo`

Returns the list of Safe master copies.

```typescript
const masterCopies: MasterCopyResponse = await safeService.getServiceMasterCopiesInfo()
```

### `decodeData`

Decodes the specified Safe transaction data.

```typescript
const decodedData = await safeService.decodeData(data)
```

### `getSafesByOwner`

Returns the list of Safes where the address provided is an owner.

```typescript
const safes: OwnerResponse = await safeService.getSafesByOwner(ownerAddress)
```

### `getSafesByModule`

Returns the list of Safes where the module address provided is enabled.

```typescript
const safes: ModulesResponse = await getSafesByModule(moduleAddress)
```

### `getTransaction`

Returns all the information of a Safe transaction.

```typescript
const tx: SafeMultisigTransactionResponse = await safeService.getTransaction(safeTxHash)
```

### `getTransactionConfirmations`

Returns the list of confirmations for a given a Safe transaction.

```typescript
const confirmations: SafeMultisigConfirmationListResponse =
  await safeService.getTransactionConfirmations(safeTxHash)
```

### `confirmTransaction`

Adds a confirmation for a Safe transaction.

```typescript
const signature: SignatureResponse = await safeService.confirmTransaction(safeTxHash, signature)
```

### `getSafeInfo`

Returns the information and configuration of the provided Safe address.

```typescript
const safeInfo: SafeInfoResponse = await safeService.getSafeInfo(safeAddress)
```

### `getSafeDelegates`

Returns the list of delegates for a given Safe address.

```typescript
const delegateConfig: GetSafeDelegateProps = {
  safeAddress, // Optional
  delegateAddress, // Optional
  delegatorAddress, // Optional
  label, // Optional
  limit, // Optional
  offset // Optional
}
const delegates: SafeDelegateListResponse = await safeService.getSafeDelegates(delegateConfig)
```

### `addSafeDelegate`

Adds a new delegate for a given Safe address.

```typescript
const delegateConfig: AddSafeDelegateProps = {
  safeAddress, // Optional
  delegateAddress,
  delegatorAddress,
  label,
  signer
}
await safeService.addSafeDelegate(delegateConfig)
```

### `removeSafeDelegate`

Removes a delegate for a given Safe address.

```typescript
const delegateConfig: DeleteSafeDelegateProps = {
  delegateAddress,
  delegatorAddress,
  signer
}
await safeService.removeSafeDelegate(delegateConfig)
```

### `getSafeCreationInfo`

Returns the creation information of a Safe.

```typescript
const safeCreationInfo: SafeCreationInfoResponse = await safeService.getSafeCreationInfo(
  safeAddress
)
```

### `estimateSafeTransaction`

Estimates the safeTxGas for a given Safe multi-signature transaction.

```typescript
const estimateTx: SafeMultisigTransactionEstimateResponse =
  await safeService.estimateSafeTransaction(safeAddress, safeTransaction)
```

### `proposeTransaction`

Creates a new multi-signature transaction and stores it in the Safe Transaction Service.

```typescript
const transactionConfig: ProposeTransactionProps = {
  safeAddress,
  safeTxHash,
  safeTransactionData,
  senderAddress,
  senderSignature,
  origin
}
await safeService.proposeTransaction(transactionConfig)
```

### `getIncomingTransactions`

Returns the history of incoming transactions of a Safe account.

```typescript
const incomingTxs: TransferListResponse = await safeService.getIncomingTransactions(safeAddress)
```

### `getModuleTransactions`

Returns the history of module transactions of a Safe account.

```typescript
const moduleTxs: SafeModuleTransactionListResponse = await safeService.getModuleTransactions(
  safeAddress
)
```

### `getMultisigTransactions`

Returns the history of multi-signature transactions of a Safe account.

```typescript
const multisigTxs: SafeMultisigTransactionListResponse = await safeService.getMultisigTransactions(
  safeAddress
)
```

### `getPendingTransactions`

Returns the list of multi-signature transactions that are waiting for the confirmation of the Safe owners.

```typescript
const pendingTxs: SafeMultisigTransactionListResponse = await safeService.getPendingTransactions(
  safeAddress
)
```

```typescript
const pendingTxs: SafeMultisigTransactionListResponse = await safeService.getPendingTransactions(
  safeAddress,
  currentNonce
)
```

### `getAllTransactions`

Returns a list of transactions for a Safe. The list has different structures depending on the transaction type.

```typescript
const allTxs: SafeMultisigTransactionListResponse = await safeService.getAllTransactions(
  safeAddress
)
```

```typescript
const allTxsOptions: AllTransactionsOptions = {
  executed,
  queued,
  trusted
}
const allTxs: SafeMultisigTransactionListResponse = await safeService.getAllTransactions(
  safeAddress,
  allTxsOptions
)
```

### `getNextNonce`

Returns the right nonce to propose a new transaction right after the last pending transaction.

```typescript
const nextNonce = await safeService.getNextNonce(safeAddress)
```

### `getTokenList`

Returns the list of all the ERC20 tokens handled by the Safe.

```typescript
const tokens: TokenInfoListResponse = await safeService.getTokenList()
```

### `getToken`

Returns the information of a given ERC20 token.

```typescript
const token: TokenInfoResponse = await safeService.getToken(tokenAddress)
```
