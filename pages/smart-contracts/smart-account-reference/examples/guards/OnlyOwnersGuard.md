# OnlyOwnersGuard

## Overview

#### License: LGPL-3.0-only

```solidity
contract OnlyOwnersGuard is BaseGuard
```

Author: Richard Meissner - @rmeissner
## State variables info

### safe (0x186f0354)

```solidity
contract ISafe safe
```


## Functions info

### constructor

```solidity
constructor()
```


### fallback

```solidity
fallback() external
```


### checkTransaction (0x75f0bb52)

```solidity
function checkTransaction(
    address,
    uint256,
    bytes memory,
    Enum.Operation,
    uint256,
    uint256,
    uint256,
    address,
    address payable,
    bytes memory,
    address msgSender
) external view override
```

Called by the Safe contract before a transaction is executed.

Reverts if the transaction is not executed by an owner.


Parameters:

| Name      | Type    | Description                  |
| :-------- | :------ | :--------------------------- |
| msgSender | address | Executor of the transaction. |

### checkAfterExecution (0x93271368)

```solidity
function checkAfterExecution(bytes32, bool) external view override
```

