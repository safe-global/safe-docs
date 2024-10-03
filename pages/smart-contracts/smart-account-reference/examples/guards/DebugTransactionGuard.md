# DebugTransactionGuard

## Overview

#### License: LGPL-3.0-only

```solidity
contract DebugTransactionGuard is BaseGuard
```

Author: Richard Meissner - @rmeissner
This guard is only meant as a development tool and example

## Events info

### TransactionDetails

```solidity
event TransactionDetails(address indexed safe, bytes32 indexed txHash, address to, uint256 value, bytes data, Enum.Operation operation, uint256 safeTxGas, bool usesRefund, uint256 nonce, bytes signatures, address executor)
```


### GasUsage

```solidity
event GasUsage(address indexed safe, bytes32 indexed txHash, uint256 indexed nonce, bool success)
```


## State variables info

### txNonces (0xddbdba63)

```solidity
mapping(bytes32 => uint256) txNonces
```


## Functions info

### fallback

```solidity
fallback() external
```


### checkTransaction (0x75f0bb52)

```solidity
function checkTransaction(
    address to,
    uint256 value,
    bytes memory data,
    Enum.Operation operation,
    uint256 safeTxGas,
    uint256 baseGas,
    uint256 gasPrice,
    address gasToken,
    address payable refundReceiver,
    bytes memory signatures,
    address executor
) external override
```

Called by the Safe contract before a transaction is executed.


Parameters:

| Name           | Type                | Description                                                                                                                                               |
| :------------- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to             | address             | Destination address of Safe transaction.                                                                                                                  |
| value          | uint256             | Ether value of Safe transaction.                                                                                                                          |
| data           | bytes               | Data payload of Safe transaction.                                                                                                                         |
| operation      | enum Enum.Operation | Operation type of Safe transaction.                                                                                                                       |
| safeTxGas      | uint256             | Gas that should be used for the Safe transaction.                                                                                                         |
| baseGas        | uint256             | Gas costs that are independent of the transaction execution (e.g. base transaction fee, signature check, payment of the refund)                           |
| gasPrice       | uint256             | Gas price that should be used for the payment calculation.                                                                                                |
| gasToken       | address             | Token address (or 0 if ETH) that is used for the payment.                                                                                                 |
| refundReceiver | address payable     | Address of receiver of gas payment (or 0 if tx.origin).                                                                                                   |
| signatures     | bytes               | Signature data that should be verified. Can be packed ECDSA signature ({bytes32 r}{bytes32 s}{uint8 v}), contract signature (EIP-1271) or approved hash.  |
| executor       | address             | Account executing the transaction.                                                                                                                        |

### checkAfterExecution (0x93271368)

```solidity
function checkAfterExecution(bytes32 txHash, bool success) external override
```

Called by the Safe contract after a transaction is executed.


Parameters:

| Name    | Type    | Description                             |
| :------ | :------ | :-------------------------------------- |
| txHash  | bytes32 | Hash of the executed transaction.       |
| success | bool    | True if the transaction was successful. |
