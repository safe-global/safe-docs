---
id: contracts_tx_execution
title: Transaction Execution
sidebar_label: Transaction Execution
---
To execute a transaction with the Gnosis Safe the <span style="color:#DB3A3D">`execTransaction`</span> methods needs to be called with the following parameters:

- _To, value, data_: Same like for a regular Ethereum transaction.
- _Operation_: On Ethereum, there are different types of transactions. The Safe supports <span style="color:#DB3A3D">`CALL`</span> (uint8 - <span style="color:#DB3A3D">`0`</span>), <span style="color:#DB3A3D">`DELEGATECALL`</span> (uint8 - <span style="color:#DB3A3D">`1`</span>) and <span style="color:#DB3A3D">`CREATE`</span> (uint8 - <span style="color:#DB3A3D">`2`</span>).
- _safeTxGas_: This is the minimum amount of gas that is provided for the Safe transaction. In case of <span style="color:#DB3A3D">`CALL`</span> and <span style="color:#DB3A3D">`DELEGATECALL`</span> this is also the maximum available gas (gas limit).
- _baseGas_: This is the amount of gas that is independent of the specific Safe transactions, but used for general things such as signature checks and the base transaction fee. _SafeTxGas_ and _baseGas_ combined are comparable to the gas limit of a regular transaction. 
- _gasPrice_: Same like for a regular Ethereum transaction. Setting the gas price to 0 means that no refund is paid out.
- _gasToken_: For regular Ethereum transactions, gas is paid in ether, always. The Gnosis Safe enables users to pay in ERC20 tokens or ether. The desired token is specified here. If <span style="color:#DB3A3D">`0x0`</span> then Ether is used. Gas costs are calculated by <span style="color:#DB3A3D">`(dataGas + txGas) * gasPrice`
- _refundReceiver_: The refund does not necessarily have to go to the account submitting the transaction but can be paid out to any account specified here. If set to <span style="color:#DB3A3D">`0`</span>, <span style="color:#DB3A3D">`tx.origin`</span> will be used.
- _signatures_: All parameters are hashed and signed by all owners of the Gnosis Safe up to the specified threshold. A list of hex encoded signatures is expected (<span style="color:#DB3A3D">`execTransaction`</span> expects that the signatures are sorted by owner address. This is required to easily validate no confirmation duplicates exist)

There need to be enough signatures to reach the threshold configured on Safe setup. To generate a signature a Safe owner generates a hash based on EIP-712 and generates signatures for it.

The <span style="color:#DB3A3D">`nonce` </span>of the Safe contract is a public variable and increases after each execution of a Safe transaction (every time <span style="color:#DB3A3D">`execTransaction`</span> is executed).

When a transaction was submitted the contract will store the gas left on method entry. Based on this the contract will calculate the gas used that the user needs to pay.

Before executing the Safe transaction the contract will check the signatures of the Safe, to ensure that the transaction was authorized by the Safe owners, and check that enough gas is left to fullfill the gas requested for the Safe transaction (<span style="color:#DB3A3D">`safeTxGas`</span>). If these checks fail the transaction triggering <span style="color:#DB3A3D">`execTransaction`</span> will also fail. This means the relayer will not be refunded.

After the execution of the Safe transaction the contract calculates the gas that has been used based on the start gas. If the <span style="color:#DB3A3D">`gasPrice`</span> is set to 0 no refund transaction will be triggered.

Refunds are not included in the calculated gas costs, since the contract uses <span style="color:#DB3A3D">`gasLeft()`</span> to calculate how much gas has been used.

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

For an example take a look at the [eth_signTypedData test](https://github.com/gnosis/safe-contracts/blob/v1.0.0/test/gnosisSafePersonalEditionEthSignTypeData.js) in the Safe contracts repository.

## On chain approvals
It is not always possible to generate a ECDSA signature for a transaction hash (e.g. a smart contract is the owner of a Safe). In this case it is possible that an owner approves the hash on-chain.

<span style="color:#DB3A3D">`approveHash`</span> can be used with the generated transaction hash to mark it as approved by an owner. This is stored on-chain in the Safe contract. Once the transaction with this hash has been executed the approval will be removed (to free the storage).

**Note:** There is no method to revert the approval of the transaction hash without the transaction being executed.

The relayer of a transaction can automatically approve the Safe transaction if he is an owner. For more information on the different types of signatures see [Signatures](./signatures.html)

## Failing Safe Transactions
If the execution of a Safe transaction fails the contract will emit the <span style="color:#DB3A3D">`ExecutionFailed`</span> event that contains the transaction hash of the failed transaction. The transaction triggering <span style="color:#DB3A3D">`execTransaction`</span> will not fail, since the relayer should still be refunded in this case.

## Safe Transaction Gas Limit Estimation
The user should set an appropriate <span style="color:#DB3A3D">`safeTxGas`</span> to define the gas required by the Safe transaction, to make sure that enough gas is send by the relayer with the transaction triggering <span style="color:#DB3A3D">`execTransaction`</span>. For this it is necessary to estimate the gas costs of the Safe transaction. 

To correctly estimate the call to <span style="color:#DB3A3D">`execTransaction`</span>it is required to generate valid signatures for a successful execution of this method. This opens up potential exploits since the user might have to sign a very high <span style="color:#DB3A3D">`safeTxGas`</span> just for estimation, but the signatures used for the estimation could be used to actually execute the transaction.

One way to estimate Safe transaction is to use <span style="color:#DB3A3D">`estimateGas`</span> and with the following parameters:
```
{
    "from": <Safe address>,
    "to": <`to` of the Safe transaction>,
    "value": <`value` of the Safe transaction>,
    "data": <`data` of the Safe transaction>,
}
```

While it is possible to estimate a normal transactions (where <span style="color:#DB3A3D">`operation`</span> is <span style="color:#DB3A3D">`CALL`</span> or <span style="color:#DB3A3D">`CREATE`</span>) like this, it is not possible to estimate <span style="color:#DB3A3D">`DELEGATECALL`</span> transactions this way. Also the value returned by <span style="color:#DB3A3D">`estimateGas`</span> might include refunds (e.g. Ganache) and the base transaction costs.

For a more accurate estimate it is recommended to use the <span style="color:#DB3A3D">`requiredTxGas`</span> method of the Safe contract. The method takes <span style="color:#DB3A3D">`to`</span>, <span style="color:#DB3A3D">`value`</span>, <span style="color:#DB3A3D">`data`</span> and <span style="color:#DB3A3D">`operation`</span> as parameters to calculate the gas used in the same way as <span style="color:#DB3A3D">`execTransaction`</span>. Therefore it will not include any refunds or base transaction costs.

To avoid that this method can be used inside a transaction two security measures have been put in place:
1. The method can only be called from the Safe itself
1. The response is returned with a revert

The value returned by <span style="color:#DB3A3D">`requiredTxGas`</span> is encoded in a revert error message (see [solidity docs](http://solidity.readthedocs.io/en/v0.4.24/control-structures.html) at the very bottom). For retrieving the hex encoded uint value the first 68 bytes of the error message need to be removed.

## Safe Transaction Data Gas Estimation
The <span style="color:#DB3A3D">`dataGas`</span> parameter can be used to include additional gas costs in the refund. This could include the base transaction fee of 21000 gas for a normal transaction, the gas for the data payload send to the Safe contract and the gas costs for the refund itself.

To correctly estimate the gas costs for the data payload without knowing the signatures, it is suggested to generate the transaction data of <span style="color:#DB3A3D">`execTransaction`</span> with random signatures and <span style="color:#DB3A3D">`dataGas`</span> set to 0. The costs for this data are 4 gas for each zero-byte and 68 gas for each non-zero-byte.

## Transactions without refund
As it is not always required to refund the relayer of the transaction it is possible to simplify the parameters in that case. 

If the <span style="color:#DB3A3D">`gasPrice`</span> is set to <span style="color:#DB3A3D">`0`</span> there will be no transfer triggered to refund the relayer. This makes it unncessary to specify <span style="color:#DB3A3D">`dataGas`</span>, <span style="color:#DB3A3D">`gasToken`</span> or <span style="color:#DB3A3D">`refundReceiver`</span> (can be set to <span style="color:#DB3A3D">`0`</span>)

In addition if also the <span style="color:#DB3A3D">`safeTxGas`</span> is set to <span style="color:#DB3A3D">`0`</span> all available gas will be used for the execution of the Safe transaction. With this it is also unnecessary to estimate the gas for the Safe transaction.
