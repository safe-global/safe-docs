# Transaction Execution
To execute a transaction with the Gnosis Safe the `execTransaction` methods needs to be called with the following parameters:
- to, value, data - Safe transaction information
- operation - Operation that should be used for the Safe Transaction. Can be `CALL` (uint8 - `0`), `DELEGATECALL` (uint8 - `1`) or `CREATE` (uint8 - `2`)
- safeTxGas - minimum gas provided for the Safe transaction. In case of `CALL` and `DELEGATECALL` this is also the maximum available gas (gas limit).
- dataGas - base gas for the execution the Safe transaction
- gasPrice - price used to calculate the gas costs that are refunded to the relayer.
- gasToken - Token used for gas cost payment. If `0x0` then Ether is used. Gas costs are calculated by `(dataGas + txGas) * gasPrice`
- refundReceiver - Address of receiver of gas payment (or 0 if tx.origin should be used).
- signatures - hex encoded signatures (`execTransaction` expects that the signatures are sorted by owner address. This is required to easily validate no confirmation duplicates exist)

There need to be enough signatures to reach the threshold configured on Safe setup. To generate a signature a Safe owner generates a hash based on EIP-712 and generates signatures for it.

The `nonce` of the Safe contract is a public variable and increases after each execution of a Safe transaction (every time `execTransaction` is executed).

When a transaction was submitted the contract will store the gas left on method entry. Based on this the contract will calculate the gas used that the user needs to pay.

Before executing the Safe transaction the contract will check the signatures of the Safe, to ensure that the transaction was authorized by the Safe owners, and check that enough gas is left to fullfill the gas requested for the Safe transaction (`safeTxGas`). If these checks fail the transaction triggering `execTransaction` will also fail. This means the relayer will not be refunded.

After the execution of the Safe transaction the contract calculates the gas that has been used based on the start gas. If the `gasPrice` is set to 0 no refund transaction will be triggered.

Refunds are not included in the calculated gas costs, since the contract uses `gasLeft()` to calculate how much gas has been used.

## Transaction Hash

The transaction hash is generated based on [EIP-712](https://github.com/Ethereum/EIPs/blob/master/EIPS/eip-712.md) and the following EIP712 domain object is used:
```java
{
    EIP712Domain: [
        { type: "address", name: "verifyingContract" }
    ]
}
```

The following object describes the typed data that is signed:
```java
{
    SafeTx: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "safeTxGas" },
        { type: "uint256", name: "dataGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
    ]
}
```

For an example take a look at the [eth_signTypedData test](https://github.com/gnosis/safe-contracts/blob/v0.0.2-alpha/test/gnosisSafePersonalEditionEthSignTypeData.js) in the Safe contracts repository.

## On chain approvals
It is not always possible to generate a ECDSA signature for a transaction hash (e.g. a smart contract is the owner of a Safe). In this case it is possible that an owner approves the hash on-chain.

`approveHash` can be used with the generated transaction hash to mark it as approved by an owner. This is stored on-chain in the Safe contract. Once the transaction with this hash has been executed the approval will be removed (to free the storage).

**Note:** There is no method to revert the approval of the transaction hash without the transaction being executed.

The relayer of a transaction can automatically approve the Safe transaction if he is an owner. For more information on the different types of signatures see [Signatures](./signatures.html)

## Failing Safe Transactions
If the execution of a Safe transaction fails the contract will emit the `ExecutionFailed` event that contains the transaction hash of the failed transaction. The transaction triggering `execTransaction` will not fail, since the relayer should still be refunded in this case.

## Safe Transaction Gas Limit Estimation
The user should set an appropriate `safeTxGas` to define the gas required by the Safe transaction, to make sure that enough gas is send by the relayer with the transaction triggering `execTransaction`. For this it is necessary to estimate the gas costs of the Safe transaction. 

To correctly estimate the call to `execTransaction` it is required to generate valid signatures for a successful execution of this method. This opens up potential exploits since the user might have to sign a very high `safeTxGas` just for estimation, but the signatures used for the estimation could be used to actually execute the transaction.

One way to estimate Safe transaction is to use `estimateGas` and with the following parameters:
```
{
    "from": <Safe address>,
    "to": <`to` of the Safe transaction>,
    "value": <`value` of the Safe transaction>,
    "data": <`data` of the Safe transaction>,
}
```

While it is possible to estimate a normal transactions (where `operation` is `CALL` or `CREATE`) like this, it is not possible to estimate `DELEGATECALL` transactions this way. Also the value returned by `estimateGas` might include refunds (e.g. Ganache) and the base transaction costs.

For a more accurate estimate it is recommended to use the `requiredTxGas` method of the Safe contract. The method takes `to`, `value`, `data` and `operation` as parameters to calculate the gas used in the same way as `execTransaction`. Therefore it will not include any refunds or base transaction costs.

To avoid that this method can be used inside a transaction two security measures have been put in place:
1. The method can only be called from the Safe itself
1. The response is returned with a revert

The value returned by `requiredTxGas` is encoded in a revert error message (see [solidity docs](http://solidity.readthedocs.io/en/v0.4.24/control-structures.html) at the very bottom). For retrieving the hex encoded uint value the first 68 bytes of the error message need to be removed.

## Safe Transaction Data Gas Estimation
The `dataGas` parameter can be used to include additional gas costs in the refund. This could include the base transaction fee of 21000 gas for a normal transaction, the gas for the data payload send to the Safe contract and the gas costs for the refund itself.

To correctly estimate the gas costs for the data payload without knowing the signatures, it is suggested to generate the transaction data of `execTransaction` with random signatures and `dataGas` set to 0. The costs for this data are 4 gas for each zero-byte and 68 gas for each non-zero-byte.

## Transactions without refund
As it is not always required to refund the relayer of the transaction it is possible to simplify the parameters in that case. 

If the `gasPrice` is set to `0` there will be no transfer triggered to refund the relayer. This makes it unncessary to specify `dataGas`, `gasToken` or `refundReceiver` (can be set to `0`)

In addition if also the `safeTxGas` is set to `0` all available gas will be used for the execution of the Safe transaction. With this it is also unnecessary to estimate the gas for the Safe transaction.