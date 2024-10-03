# SimulateTxAccessor

## Overview

#### License: LGPL-3.0-only

```solidity
contract SimulateTxAccessor is Executor
```

Author: Richard Meissner - @rmeissner
Can be used with StorageAccessible to simulate Safe transactions.

## Modifiers info

### onlyDelegateCall

```solidity
modifier onlyDelegateCall()
```

Modifier to make a function callable via delegatecall only.
If the function is called via a regular call, it will revert.
## Functions info

### constructor

```solidity
constructor()
```


### simulate (0x1c5fb211)

```solidity
function simulate(
    address to,
    uint256 value,
    bytes calldata data,
    Enum.Operation operation
)
    external
    onlyDelegateCall
    returns (uint256 estimate, bool success, bytes memory returnData)
```

Simulates a Safe transaction and returns the used gas, success boolean and the return data.

Executes the specified operation {Call, DelegateCall} and returns operation-specific data.
Has to be called via delegatecall.
This returns the data equal to `abi.encode(uint256(etimate), bool(success), bytes(returnData))`.
Specifically, the returndata will be:
`estimate:uint256 || success:bool || returnData.length:uint256 || returnData:bytes`.


Parameters:

| Name      | Type                | Description                           |
| :-------- | :------------------ | :------------------------------------ |
| to        | address             | Destination address .                 |
| value     | uint256             | Native token value.                   |
| data      | bytes               | Data payload.                         |
| operation | enum Enum.Operation | Operation type {Call, DelegateCall}.  |


Return values:

| Name       | Type    | Description             |
| :--------- | :------ | :---------------------- |
| estimate   | uint256 | Gas used.               |
| success    | bool    | Success boolean value.  |
| returnData | bytes   | Return data.            |
