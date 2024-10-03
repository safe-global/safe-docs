# Guard

## Overview

#### License: LGPL-3.0-only

```solidity
interface Guard is IERC165
```


## Functions info

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
    address msgSender
) external
```


### checkAfterExecution (0x93271368)

```solidity
function checkAfterExecution(bytes32 txHash, bool success) external
```

