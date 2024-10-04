# ISafe

## Overview

#### License: LGPL-3.0-only

```solidity
interface ISafe
```


## Functions info

### execTransactionFromModule (0x468721a7)

```solidity
function execTransactionFromModule(
    address to,
    uint256 value,
    bytes calldata data,
    Enum.Operation operation
) external returns (bool success)
```

Allows a Module to execute a Safe transaction without any further confirmations.


Parameters:

| Name      | Type                | Description                                 |
| :-------- | :------------------ | :------------------------------------------ |
| to        | address             | Destination address of module transaction.  |
| value     | uint256             | Ether value of module transaction.          |
| data      | bytes               | Data payload of module transaction.         |
| operation | enum Enum.Operation | Operation type of module transaction.       |
