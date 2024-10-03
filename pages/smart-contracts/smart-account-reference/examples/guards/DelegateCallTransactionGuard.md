# DelegateCallTransactionGuard

## Overview

#### License: LGPL-3.0-only

```solidity
contract DelegateCallTransactionGuard is BaseGuard
```

Author: Richard Meissner - @rmeissner
## State variables info

### ALLOWED_TARGET (0x250d6a91)

```solidity
address immutable ALLOWED_TARGET
```


## Functions info

### constructor

```solidity
constructor(address target)
```


### fallback

```solidity
fallback() external
```


### checkTransaction (0x75f0bb52)

```solidity
function checkTransaction(
    address to,
    uint256,
    bytes memory,
    Enum.Operation operation,
    uint256,
    uint256,
    uint256,
    address,
    address payable,
    bytes memory,
    address
) external view override
```

Called by the Safe contract before a transaction is executed.

 Reverts if the transaction is a delegate call to contract other than the allowed one.


Parameters:

| Name      | Type                | Description                               |
| :-------- | :------------------ | :---------------------------------------- |
| to        | address             | Destination address of Safe transaction.  |
| operation | enum Enum.Operation | Operation type of Safe transaction.       |

### checkAfterExecution (0x93271368)

```solidity
function checkAfterExecution(bytes32, bool) external view override
```

