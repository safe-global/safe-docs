# IModuleManager

## Overview

#### License: LGPL-3.0-only

```solidity
interface IModuleManager is IGuardManager
```

Author: @safe-global/safe-protocol
Modules are extensions with unlimited access to a Safe that can be added to a Safe by its owners.
           ⚠️ WARNING: Modules are a security risk since they can execute arbitrary transactions,
           so only trusted and audited modules should be added to a Safe. A malicious module can
           completely takeover a Safe.

## Events info

### EnabledModule

```solidity
event EnabledModule(address indexed module)
```


### DisabledModule

```solidity
event DisabledModule(address indexed module)
```


### ExecutionFromModuleSuccess

```solidity
event ExecutionFromModuleSuccess(address indexed module)
```


### ExecutionFromModuleFailure

```solidity
event ExecutionFromModuleFailure(address indexed module)
```


## Functions info

### enableModule (0x610b5925)

```solidity
function enableModule(address module) external
```

Enables the module `module` for the Safe.

This can only be done via a Safe transaction.


Parameters:

| Name   | Type    | Description               |
| :----- | :------ | :------------------------ |
| module | address | Module to be whitelisted. |

### disableModule (0xe009cfde)

```solidity
function disableModule(address prevModule, address module) external
```

Disables the module `module` for the Safe.

This can only be done via a Safe transaction.


Parameters:

| Name       | Type    | Description                                  |
| :--------- | :------ | :------------------------------------------- |
| prevModule | address | Previous module in the modules linked list.  |
| module     | address | Module to be removed.                        |

### execTransactionFromModule (0x468721a7)

```solidity
function execTransactionFromModule(
    address to,
    uint256 value,
    bytes memory data,
    Enum.Operation operation
) external returns (bool success)
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

### execTransactionFromModuleReturnData (0x5229073f)

```solidity
function execTransactionFromModuleReturnData(
    address to,
    uint256 value,
    bytes memory data,
    Enum.Operation operation
) external returns (bool success, bytes memory returnData)
```

Execute `operation` (0: Call, 1: DelegateCall) to `to` with `value` (Native Token) and return data


Parameters:

| Name      | Type                | Description                                 |
| :-------- | :------------------ | :------------------------------------------ |
| to        | address             | Destination address of module transaction.  |
| value     | uint256             | Ether value of module transaction.          |
| data      | bytes               | Data payload of module transaction.         |
| operation | enum Enum.Operation | Operation type of module transaction.       |


Return values:

| Name       | Type  | Description                                     |
| :--------- | :---- | :---------------------------------------------- |
| success    | bool  | Boolean flag indicating if the call succeeded.  |
| returnData | bytes | Data returned by the call.                      |

### isModuleEnabled (0x2d9ad53d)

```solidity
function isModuleEnabled(address module) external view returns (bool)
```

Returns if an module is enabled


Return values:

| Name | Type | Description                   |
| :--- | :--- | :---------------------------- |
| [0]  | bool | True if the module is enabled |

### getModulesPaginated (0xcc2f8452)

```solidity
function getModulesPaginated(
    address start,
    uint256 pageSize
) external view returns (address[] memory array, address next)
```

Returns an array of modules.
If all entries fit into a single page, the next pointer will be 0x1.
If another page is present, next will be the last element of the returned array.


Parameters:

| Name     | Type    | Description                                                           |
| :------- | :------ | :-------------------------------------------------------------------- |
| start    | address | Start of the page. Has to be a module or start pointer (0x1 address)  |
| pageSize | uint256 | Maximum number of modules that should be returned. Has to be > 0      |


Return values:

| Name  | Type      | Description             |
| :---- | :-------- | :---------------------- |
| array | address[] | Array of modules.       |
| next  | address   | Start of the next page. |
