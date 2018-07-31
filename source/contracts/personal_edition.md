# Safe Personal Edition Smart Contract

This version is targeted at users that control all keys owning a safe. The transaction hash can be signed with the private keys that manage the safe. 

Once the required number of confirmations is available `execTransactionAndPaySubmitter` can be called with the sending confirmation signatures. This method will pay the submitter of the transaction for the transaction fees after the Safe transaction has been executed.

## Safe Contract Deployment
The Gnosis Safe Personal Edition smart contract was written with the usage of a proxy contract in mind. Because of that there is no constructor and it is required to call an inilize function on the contract before it can be used. For this it is recommended to use the ProxyFactory or the DelegatingConstructorProxy.

Using the ProxyFactory or deploying a proxy requires that the user has ether on an externally owned account. To make it possible to pay for the creation with any token or ether the following flow is used.

1. Create deployment transaction. The PayingProxy enables the payment in any ERC20 token. Once the proxy is deployed it will refund a predefined address with the funds present at the address where it was deployed.
1. To make the deployed address deterministig it is necessary to use a known account and calculate the target address. To make this trustless it is recommended to use a random account that has nonce 0. This can be done by creating a random signature for the deployment transaction. From that transaction it is possible to derive the sender and the target address.
1. The user needs to transfer at least the amount required for the payment to the target address.
1. Once the payment is present at the target address the relay service will fund the sender with ether required for the creation transaction.
1. As soon as the sender is funded the creation transaction can be submmited.

For more details on the safe deployment process please checkout the [DappCon 2018 presentation](https://youtu.be/RGBKAfyvAHk?t=416)

## Safe Transaction Execution
To execute a transaction with the Gnosis Safe Personal Editon the `execTransactionAndPaySubmitter` methods needs to be called with the following parameters:
- to, value, data - Safe transaction information
- operation - Operation that should be used for the Safe Transaction. Can be `CALL` (uint8 - `0`), `DELEGATECALL` (uint8 - `1`) or `CREATE` (uint8 - `2`)
- safeTxGas - minimum gas provided for the Safe transaction. In case of `CALL` and `DELEGATECALL` this is also the maximum available gas (gas limit).
- dataGas - overhead gas to execute the Safe transaction
- gasPrice - price used to calculate the gas costs that are refunded to the submitter.
- gasToken - Token used for gas cost payment. If `0x0` then Ether is used. Gas costs are calculated by `(dataGas + txGas) * gasPrice`
- signatures - hex encoded signatures (`execTransactionAndPaySubmitter` expects that the signatures are sorted by owner address. This is required to easily validate no confirmation duplicates exist)

There need to be enough signatures to reach the threshold configured on Safe setup. To generate a signature a Safe owner signs the keccak hash of the following information:
`byte(0x19), byte(0), this, to, value, data, operation, safeTxGas, dataGas, gasPrice, gasToken, _nonce`
where `this` is the Safe address and `_nonce` is the the global `nonce` stored in the safe contract.

The `nonce` of the Safe contract is a public variable and increases after each execution of a Safe transaction (every time `execTransactionAndPaySubmitter` is executed).

When a transaction was submitted the contract will store the gas left on method entry. Based on this the contract will calculate the gas used that the user needs to pay.

Before executing the Safe transaction the contract will check the signatures of the safe, to ensure that the transaction was authorized by the Safe owners, and check that enough gas is left to fullfill the gas requested for the Safe transaction (`safeTxGas`). If these checks fail the transaction triggering `execTransactionAndPaySubmitter` will also fail. This means the submitter will not be refunded.

After the execution of the Safe transaction the contract calculates the gas that has been used based on the start gas. If the `gasPrice` is set to 0 no refund transaction will be triggered.

Refunds are not included in the calculated gas costs, since the contract uses `gasLeft()` to calculate how much gas has been used.

## Failing Safe Transactions
If the execution of a Safe transaction fails the contract will emit the `ExecutionFailed` event that contains the transaction hash of the failed transaction. The transaction triggering `execTransactionAndPaySubmitter` will not fail, since the submitter should still be refunded in this case.

## Safe Transaction Gas Limit Estimation
The user should set an appropriate `safeTxGas` to define the gas required by the Safe transaction, to make sure that enough gas is send by the submitter with the transaction triggering `execTransactionAndPaySubmitter`. For this it is necessary to estimate the gas costs of the Safe transaction. 

To correctly estimate the call to `execTransactionAndPaySubmitter` it is required to generate valid signatures for a successfull execution of this method. This opens up potential exploids since the user might have to sign a very high `safeTxGas` just for estimation, but the signatures used for the estimation could be used to actually execute the transaction.

One way to estimate Safe transaction is to use `estimateGas` and with the following parameters:
```
{
    "from": <Safe address>,
    "to": <`to` of the Safe transaction>,
    "value": <`value` of the Safe transaction>,
    "data": <`data` of the Safe transaction>,
}
```

While it is possible to estimate a normal transactions (where `operation` is `CALL` or `CREATE`) like this, it is not possible to estimate `DELEGATECALL` transactions this way. Also the value returned by `estimateGas` includes refunds and the base transaction costs.

For a more accurate estimate it is recommended to use the `requiredTxGas` method of the Safe contract. The method takes `to`, `value`, `data` and `operation` as parameters to calculate the gas used in the same way as `execTransactionAndPaySubmitter`. Therefore it will not include any refunds.

To avoid that this method can be used inside a transaction two security measures have been put in place:
1. The method can only be called from the safe itself
1. The response is returned with a revert

The value returned by `requiredTxGas` is encoded in a revert error message (see [solidity docs](http://solidity.readthedocs.io/en/v0.4.24/control-structures.html) at the very bottom). For retrieving the hex encoded uint value the first 68 bytes of the error message need to be removed.

## Safe Transaction Data Gas Estimation
The `dataGas` parameter can be used to include additional gas costs in the refund. This could include the base transaction fee of 21000 gas for a normal transaction, the gas for the data payload send to the Safe contract and the gas costs for the refund itself.

To correctly estimate the gas costs for the data payload without knowing the signatures, it is suggested to generate the transaction data of `execTransactionAndPaySubmitter` with random signatures and `dataGas` set to 0. The costs for this data are 4 gas for each zero-byte and 68 gas for each non-zero-byte.

## Signature Encoding
Assuming we have 2 owners in a 2 out of 2 multisig configuration:

1. `0x1` (Private key)
2. `0x2` (Private key)

`0x1` and `0x2` are confirming by signing a message.

The signatures bytes used for `execTransactionAndPaySubmitter` have to be build like the following:
* `bytes = 0x{r_0x1}{s_0x1}{v_0x1}{r_0x2}{s_0x2}{v_0x2}`

`v`, `r` and `s` are the signature parameters for the signed confirmation messages. All values are hex encoded. `r` and `s` are padded to 32 bytes and `v` is padded to 8 bytes.

## Front Running Submitted Transactions
As all the parameters required for execution are part of the submitted transaction it is possible that miners front-run the original submitter to receive the reward. In the long run that behaviour would be appreciated, since it would allow that anybody submits these transactions with `gasPrice` of the transaction triggering `execTransactionAndPaySubmitter` set to 0. Miners could pick up these transactions and claim the rewards.

As it might be undesirable when there is a specific relayer (submitter) that the owner of the safe wants to interact with it is currently in discussion to allow the specification of the address that should be refunded and fallback to the original behaviour if that address is `0x0` [issue link](https://github.com/gnosis/safe-contracts/issues/38)