# SafeL2

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeL2 is Safe
```

Author: Stefan George - @Georgi87

For a more complete description of the Safe contract, please refer to the main Safe contract `Safe.sol`.

## Events info

### SafeMultiSigTransaction

```solidity
event SafeMultiSigTransaction(address to, uint256 value, bytes data, Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address payable refundReceiver, bytes signatures, bytes additionalInfo)
```


### SafeModuleTransaction

```solidity
event SafeModuleTransaction(address module, address to, uint256 value, bytes data, Enum.Operation operation)
```


## Functions info

### execTransaction (0x6a761202)

```solidity
function execTransaction(
    address to,
    uint256 value,
    bytes calldata data,
    Enum.Operation operation,
    uint256 safeTxGas,
    uint256 baseGas,
    uint256 gasPrice,
    address gasToken,
    address payable refundReceiver,
    bytes memory signatures
) public payable override returns (bool)
```

Executes a `operation` {0: Call, 1: DelegateCall}} transaction to `to` with `value` (Native Currency)
and pays `gasPrice` * `gasLimit` in `gasToken` token to `refundReceiver`.

The fees are always transferred, even if the user transaction fails.
This method doesn't perform any sanity check of the transaction, such as:
- if the contract at `to` address has code or not
- if the `gasToken` is a contract or not
It is the responsibility of the caller to perform such checks.


Parameters:

| Name           | Type                | Description                                                                                                                                               |
| :------------- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to             | address             | Destination address of Safe transaction.                                                                                                                  |
| value          | uint256             | Ether value of Safe transaction.                                                                                                                          |
| data           | bytes               | Data payload of Safe transaction.                                                                                                                         |
| operation      | enum Enum.Operation | Operation type of Safe transaction.                                                                                                                       |
| safeTxGas      | uint256             | Gas that should be used for the Safe transaction.                                                                                                         |
| baseGas        | uint256             | Gas costs that are independent of the transaction execution(e.g. base transaction fee, signature check, payment of the refund)                            |
| gasPrice       | uint256             | Gas price that should be used for the payment calculation.                                                                                                |
| gasToken       | address             | Token address (or 0 if ETH) that is used for the payment.                                                                                                 |
| refundReceiver | address payable     | Address of receiver of gas payment (or 0 if tx.origin).                                                                                                   |
| signatures     | bytes               | Signature data that should be verified. Can be packed ECDSA signature ({bytes32 r}{bytes32 s}{uint8 v}), contract signature (EIP-1271) or approved hash.  |


Return values:

| Name    | Type | Description                               |
| :------ | :--- | :---------------------------------------- |
| success | bool | Boolean indicating transaction's success. |

### execTransactionFromModule (0x468721a7)

```solidity
function execTransactionFromModule(
    address to,
    uint256 value,
    bytes memory data,
    Enum.Operation operation
) public override returns (bool success)
```

Execute `operation` (0: Call, 1: DelegateCall) to `to` with `value` (Native Token)

Function is virtual to allow overriding for L2 singleton to emit an event for indexing.


Parameters:

| Name      | Type                | Description                                 |
| :-------- | :------------------ | :------------------------------------------ |
| to        | address             | Destination address of module transaction.  |
| value     | uint256             | Ether value of module transaction.          |
| data      | bytes               | Data payload of module transaction.         |
| operation | enum Enum.Operation | Operation type of module transaction.       |


Return values:

| Name    | Type | Description                                    |
| :------ | :--- | :--------------------------------------------- |
| success | bool | Boolean flag indicating if the call succeeded. |
