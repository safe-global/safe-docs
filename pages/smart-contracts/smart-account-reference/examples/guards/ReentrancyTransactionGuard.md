# ReentrancyTransactionGuard

## Overview

#### License: LGPL-3.0-only

```solidity
contract ReentrancyTransactionGuard is BaseGuard
```

Author: Richard Meissner - @rmeissner
## Structs info

### GuardValue

```solidity
struct GuardValue {
	bool active;
}
```


## Functions info

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
    address
) external override
```

Called by the Safe contract before a transaction is executed.

Reverts if reentrancy is detected.
### checkAfterExecution (0x93271368)

```solidity
function checkAfterExecution(bytes32, bool) external override
```

Called by the Safe contract after a transaction is executed.

Resets the guard value.