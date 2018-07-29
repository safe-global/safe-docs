# Safe Personal Edition Smart Contract

This version is targeted at users that control all keys owning a safe. The transaction hash can be signed with the private keys that manage the safe. 

Once the required number of confirmations is available `execTransactionAndPaySubmitter` can be called with the sending confirmation signatures. This method will pay the submitter of the transaction for the transaction fees after the Safe transaction has been executed.

`execTransactionAndPaySubmitter` expects all confirmations sorted by owner address. This is required to easily validate no confirmation duplicates exist.

## Safe Transaction Execution
- global nonce - `nonce` is stored in the contract and increases with each transaction
- dataGas - overhead gas to execute the Safe transaction
- txGas - minimum gas provided for the Safe transaction. In case of `CALL` and `DELEGATECALL` this is also the maximum available gas (gas limit).
- gasToken - Token used for gas cost payment. If `0x0` then Ether is used. Gas costs are calculated by ((dataGas + txGas) * gasPrice)
- gasPrice - price used to calculate the gas costs that are refunded to the submitter.
- signatures - hex encoded signatures

## Safe Transaction Data Gas Estimation
- Base transaction gas (e.g. 21000)
- Gas for data payload
- Gas for refund

## Safe Transaction Gas Limit Estimation
- `estimateGas` contains refunds and therefore returns a value that is not always valid for the gas limit
- `estimateGas` requires a valid payload, in our case all signatures to execute the transaction, but users should be able to view payment before
- `requireTxGas` encodes calulated gas limit in error message (remove first 68 bytes to get hex-encoded value)
- `requireTxGas` does not contain refunds to provide a more accurate estimate

## Signature Encoding
Assuming we have 2 owners in a 2 out of 2 multisig configuration:

1. `0x1` (Private key)
2. `0x2` (Private key)

`0x1` and `0x2` are confirming by signing a message.

The signatures bytes used for `execTransactionAndPaySubmitter` have to be build like the following:
* `bytes = 0x{r_0x1}{s_0x1}{v_0x1}{r_0x2}{s_0x2}{v_0x2}`

`v`, `r` and `s` are the signature parameters for the signed confirmation messages. All values are hex encoded. `r` and `s` are padded to 32 bytes and `v` is padded to 8 bytes.

## Failing Safe Transactions
If the execution of a Safe transaction fails the contract will emit the `ExecutionFailed` event that contains the transaction hash of the failed transaction. The transaction triggering `execTransactionAndPaySubmitter` will not fail, since the submitter should still be refunded in this case.

## Front Running Submitted Transactions
- Front running is encouraged -> If detected we would start submitting with gasPrice 0
- Proposed feature: specify submitter, fallback to `tx.origin` if `0x0` [issue link](https://github.com/gnosis/safe-contracts/issues/38)