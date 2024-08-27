# Reference

The [API Kit](https://github.com/safe-global/safe-core-sdk/tree/main/packages/api-kit) facilitates the interaction with the [Safe Transaction Service API](https://github.com/safe-global/safe-transaction-service).

## Install dependencies

To add the API Kit to your project, run:

```bash
yarn add @safe-global/api-kit
```

## Reference

The `SafeApiKit` class is the entrypoint for any interaction with the Transaction Service.

```typescript

const safeApiKitConfig: SafeApiKitConfig = {
  txServiceUrl: 'https://safe-transaction-mainnet.safe.global',
  chainId: 11155111n
}
const apiKit = new SafeApiKit(safeApiKitConfig);
```

**Parameters**

- `safeApiKitConfig` - The options to initialize the SDK instance. If `txServiceUrl` is undefined, the `chainId` will be used to select from the public URL list.


### `getServiceInfo`

Returns the information and configuration of the service as well as the ethereum node that its connected to.


```typescript
const serviceInfo: SafeServiceInfoResponse = await apiKit.getServiceInfo()
```

### `getServiceSingletonsInfo`

Returns the list of Safe singletons.

```typescript
const singletons: SafeSingletonResponse = await apiKit.getServiceSingletonsInfo()
```

### `decodeData`

Decodes the specified Safe transaction data.

```typescript
const data = '0x610b592500000000000000000000000090F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const decodedData = await apiKit.decodeData(data)
```

**Parameters**

- `data` - The transaction data as a `0x` prefixed hexadecimal string.

### `getSafesByOwner`

Returns the list of Safes where the address provided is an owner.

```typescript
const ownerAddress = "0x9cCBDE03eDd71074ea9c49e413FA9CDfF16D263B"
const safes: OwnerResponse = await apiKit.getSafesByOwner(ownerAddress)
```

**Parameters**

- `ownerAddress` - The owner's address.

### `getSafesByModule`

Returns the list of Safes where the module address provided is enabled.

```typescript
const moduleAddress = '0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134'
const safes: ModulesResponse = await getSafesByModule(moduleAddress)
```

**Parameters**

- `moduleAddress` - The module's address.

### `getTransaction`

Returns all the information, including confirmations, of a Safe transaction.

```typescript
const safeTxHash = '0x317834aea988fd3cfa54fd8b2be2c96b4fd70a14d8c9470a7110576b01e6480a'
const tx: SafeMultisigTransactionResponse = await apiKit.getTransaction(safeTxHash)
```

**Parameters**

- `safeTxHash` - Hash of the Safe transaction.

### `getTransactionConfirmations`

Returns a paginated list of confirmations for a given a Safe transaction.

```typescript
const safeTxHash = '0x317834aea988fd3cfa54fd8b2be2c96b4fd70a14d8c9470a7110576b01e6480a'
const confirmations: SafeMultisigConfirmationListResponse =
  await apiKit.getTransactionConfirmations(safeTxHash)
```

**Parameters**

- `safeTxHash` - Hash of the Safe transaction.

### `confirmTransaction`

Adds a confirmation for a Safe transaction.

```typescript
const signature = '0x000000000000000000000000Da8dd250065F19f7A29564396D7F13230b9fC5A30000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000082158896fb769f752637525bba1308009cd55a75ade6606955165f13dab77ee2836fd3ded0a69ac5187bb9c9cd8b288519dd5e947d233a4ba07d12dcba94166e141fa18624aad743b76019d4b963ddfe46ef1d13312c874c1db4efa20516f1f583217a215ed112c8a5a8be3f8e91c679aa817e616f1b6cafc3b6663aff9617e2e6dc20'
const safeTxHash = '0x317834aea988fd3cfa54fd8b2be2c96b4fd70a14d8c9470a7110576b01e6480a'
const signature: SignatureResponse = await apiKit.confirmTransaction(safeTxHash, signature)
```

**Parameters**

- `safeTxHash` - Hash of the Safe transaction.
- `signature` - The signature of the owner that is confirming the transaction. Can be obtained, for example, by using [protocol-kit#signHash](../../protocol-kit/reference/safe#signhash).

### `getSafeInfo`

Returns the information and configuration of the provided Safe address.

```typescript
const safeAddress = '0xF8ef84392f7542576F6b9d1b140334144930Ac78'
const safeInfo: SafeInfoResponse = await apiKit.getSafeInfo(safeAddress)
```

**Parameters**

- `safeAddress` - The Safe address.

### `getSafeDelegates`

Returns a paginated list of delegates for a given Safe address.

```typescript
const getSafeDelegateProps: GetSafeDelegateProps = {
  safeAddress: '0xF8ef84392f7542576F6b9d1b140334144930Ac78', // Optional
  delegateAddress: '0x9cCBDE03eDd71074ea9c49e413FA9CDfF16D263B', // Optional
  delegatorAddress, // Optional
  label: 'aLabel', // Optional
  limit: 2, // Optional
  offset: 1 // Optional
}
const delegates: SafeDelegateListResponse = await apiKit.getSafeDelegates(getSafeDelegateProps)
```

**Parameters**

- `getSafeDelegateProps` - Properties to filter the returned list of delegates. All present properties must be satisfied. All properties are optional.
  - `safeAddress` - The Safe address.
  - `delegateAddress` - The previously defined delegate address.
  - `delegatorAddress` - The previously defined delegator address.
  - `label` - The label used to create the delegator.
  - `limit` - Max number of records per call.
  - `offset` - The index used to offset the result.

### `addSafeDelegate`

Adds a new delegate for a given Safe address.

```typescript
const addSafeDelegateProps: AddSafeDelegateProps = {
  safeAddress: '0xF8ef84392f7542576F6b9d1b140334144930Ac78', // Optional
  delegateAddress: '0x9cCBDE03eDd71074ea9c49e413FA9CDfF16D263B',
  delegatorAddress,
  label: 'aLabel',
  limit: 2,
  offset: 1
}
await apiKit.addSafeDelegate(addSafeDelegateProps)
```

**Parameters**

- `addSafeDelegateProps` - Properties to filter the returned list of delegates. All present properties must be satisfied.
  - `safeAddress` - The Safe address.
  - `delegateAddress` - The previously defined delegate address.
  - `delegatorAddress` - The delegator address. Must be an owner of safe (if `safeAddress` is present).
  - `label` - The label used to create the delegator.
  - `limit` - Max number of records per call.
  - `offset` - The index used to offset the result.


### `removeSafeDelegate`

Removes a delegate for a given Safe address.

```typescript
const delegateConfig: DeleteSafeDelegateProps = {
  delegateAddress,
  delegatorAddress,
  signer
}
await apiKit.removeSafeDelegate(delegateConfig)
```

### `getSafeCreationInfo`

Returns the creation information of a Safe.

```typescript
const safeAddress = '0xF8ef84392f7542576F6b9d1b140334144930Ac78'
const safeCreationInfo: SafeCreationInfoResponse = await apiKit.getSafeCreationInfo(safeAddress)
```

**Parameters**
- `safeAddress` - The Safe address.

### `estimateSafeTransaction`

Estimates the safeTxGas for a given Safe multi-signature transaction.

```typescript
const safeAddress = '0xF8ef84392f7542576F6b9d1b140334144930Ac78'
const safeTransaction: SafeMultisigTransactionEstimate = {
  to: '0x9cCBDE03eDd71074ea9c49e413FA9CDfF16D263B',
  value: '0',
  data: '0x', // Optional
  operation: 0
}
const estimateTx: SafeMultisigTransactionEstimateResponse =
  await apiKit.estimateSafeTransaction(safeAddress, safeTransaction)
```

**Parameters**
- `safeAddress` - The Safe address.
- `safeTransaction` - The Safe transaction.

### `proposeTransaction`

Creates a new multi-signature transaction and stores it in the Safe Transaction Service.

```typescript
const proposeTransactionProps: ProposeTransactionProps = {
  safeAddress: '0xF8ef84392f7542576F6b9d1b140334144930Ac78',
  safeTxHash: '0x03f327887f2f3c454620ff4c510e150005d42fe4476723779fe0d93ed2fbe940',
  safeTransactionData: createTransactionData,
  senderAddress: '0x56e2C102c664De6DfD7315d12c0178b61D16F171',
  senderSignature: '0x6338d47f80dd01652fb768586a41fd7c2f2309b33a8aa2d57c87300860f8bb6f61bdd611ef65f7613e04fc738f44871b4d91d767d29d61e4008d97a4d4e29bca1b'
}
await apiKit.proposeTransaction(proposeTransactionProps)
```

**Parameters**
- `proposeTransactionProps` - The transaction to be proposed.
  - `safeAddress`: The Safe address.
  - `safeTransactionData`: The `data` object inside the Safe transaction object returned from the method [`protocol-kit#createTransaction](../../protocol-kit/reference/safe#createtransaction).
  - `safeTxHash`: The Safe transaction hash, calculated by calling the method [`protocol-kit#getTransactionHash`](../../protocol-kit/reference/safe#createtransaction) from the Protocol Kit.
  - `senderAddress`: The Safe owner or delegate proposing the transaction.
  - `senderSignature`: The signature generated by signing the `safeTxHash` with the `senderAddress`.
  - `origin`: Optional string that allows to provide more information about the app proposing the transaction.


### `getIncomingTransactions`

Returns the history of incoming transactions of a Safe account.

```typescript
const safeAddress = '0xF8ef84392f7542576F6b9d1b140334144930Ac78'
const incomingTxs: TransferListResponse = await apiKit.getIncomingTransactions(safeAddress)
```

**Parameters**
- `safeAddress`: The Safe address.

### `getModuleTransactions`

Returns the history of module transactions of a Safe account.

```typescript
const moduleTxs: SafeModuleTransactionListResponse = await apiKit.getModuleTransactions(
  safeAddress
)
```

### `getMultisigTransactions`

Returns the history of multi-signature transactions of a Safe account.

```typescript
const multisigTxs: SafeMultisigTransactionListResponse = await apiKit.getMultisigTransactions(
  safeAddress
)
```

### `getPendingTransactions`

Returns the list of multi-signature transactions that are waiting for the confirmation of the Safe owners.

```typescript
const pendingTxs: SafeMultisigTransactionListResponse = await apiKit.getPendingTransactions(
  safeAddress
)
```

```typescript
const pendingTxs: SafeMultisigTransactionListResponse = await apiKit.getPendingTransactions(
  safeAddress,
  currentNonce
)
```

### `getAllTransactions`

Returns a list of transactions for a Safe. The list has different structures depending on the transaction type.

```typescript
const allTxs: SafeMultisigTransactionListResponse = await apiKit.getAllTransactions(
  safeAddress
)
```

```typescript
const allTxsOptions: AllTransactionsOptions = {
  executed,
  queued,
  trusted
}
const allTxs: SafeMultisigTransactionListResponse = await apiKit.getAllTransactions(
  safeAddress,
  allTxsOptions
)
```

### `getNextNonce`

Returns the right nonce to propose a new transaction right after the last pending transaction.

```typescript
const nextNonce = await apiKit.getNextNonce(safeAddress)
```

### `getTokenList`

Returns the list of all the ERC20 tokens handled by the Safe.

```typescript
const tokens: TokenInfoListResponse = await apiKit.getTokenList()
```

### `getToken`

Returns the information of a given ERC20 token.

```typescript
const token: TokenInfoResponse = await apiKit.getToken(tokenAddress)
```

### `getMessage`

Returns a message from its hash.

```typescript
const message: SafeMessage = await apiKit.getMessage(safeMessageHash)
```

### `getMessages`

Returns the list of messages associated to a Safe account.

```typescript
const messagesResponse: SafeMessageListResponse = await apiKit.getMessages(safeAddress, { ordering, limit, offset })
```

### `addMessage`

Creates a new message with an initial signature.

```typescript
await apiKit.addMessage(safeAddress, { message, signature, safeAppId })
```

### `addMessageSignature`

Adds a signature to an existing message.

```typescript
await apiKit.addMessageSignature(safeMessageHash, signature)
```

### `getSafeOperationsByAddress`

Get the SafeOperations that were sent from a particular Safe address. By default, the result set is ordered by nonce and not the order in which they were added to the Transaction Service.

```typescript
const safeOperationsList: GetSafeOperationListResponse = await apiKit.getSafeOperationsByAddress({ safeAddress, ordering, limit, offset })
```

### `getSafeOperation`

Get a SafeOperation by its hash.

```typescript
const safeOperationResponse: SafeOperationResponse = await apiKit.getSafeOperation(safeOperationHash)
```

### `addSafeOperation`

Adds a new SafeOperation for a given Safe account. A SafeOperation can be created by using [Safe4337Pack#createTransaction](../../relay-kit/reference/safe-4337-pack.mdx#createtransactionsafe4337createtransactionprops).

```typescript
await apiKit.addSafeOperation(safeOperation)
```

### `getSafeOperationConfirmations`

Returns the list of confirmations for a given a SafeOperation.

```typescript
await apiKit.getSafeOperationConfirmations(safeOperationHash, { limit, offset })
```

### `confirmSafeOperation`

Adds a confirmation for a SafeOperation. After enough confirmations, the operation still needs to be executed with [Safe4337Pack#executeTransaction](../../relay-kit/reference/safe-4337-pack.mdx#createtransactionsafe4337createtransactionprops).

```typescript
await apiKit.confirmSafeOperation(safeOperationHash, signature)
```
