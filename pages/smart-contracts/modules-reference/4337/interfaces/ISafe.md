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
    bytes memory data,
    uint8 operation
) external returns (bool success)
```

Allows a Module to execute a Safe transaction without any further confirmations.


Parameters:

| Name      | Type    | Description                                 |
| :-------- | :------ | :------------------------------------------ |
| to        | address | Destination address of module transaction.  |
| value     | uint256 | Ether value of module transaction.          |
| data      | bytes   | Data payload of module transaction.         |
| operation | uint8   | Operation type of module transaction.       |

### execTransactionFromModuleReturnData (0x5229073f)

```solidity
function execTransactionFromModuleReturnData(
    address to,
    uint256 value,
    bytes memory data,
    uint8 operation
) external returns (bool success, bytes memory returnData)
```

Execute `operation` (0: Call, 1: DelegateCall) to `to` with `value` (Native Token) and return data


Parameters:

| Name      | Type    | Description                                 |
| :-------- | :------ | :------------------------------------------ |
| to        | address | Destination address of module transaction.  |
| value     | uint256 | Ether value of module transaction.          |
| data      | bytes   | Data payload of module transaction.         |
| operation | uint8   | Operation type of module transaction.       |


Return values:

| Name       | Type  | Description                                     |
| :--------- | :---- | :---------------------------------------------- |
| success    | bool  | Boolean flag indicating if the call succeeded.  |
| returnData | bytes | Data returned by the call.                      |

### checkSignatures (0x934f3a11)

```solidity
function checkSignatures(
    bytes32 dataHash,
    bytes memory data,
    bytes memory signatures
) external view
```

Checks whether the signature provided is valid for the provided data, hash. Will revert otherwise.


Parameters:

| Name       | Type    | Description                                                                                                     |
| :--------- | :------ | :-------------------------------------------------------------------------------------------------------------- |
| dataHash   | bytes32 | Hash of the data (could be either a message hash or transaction hash)                                           |
| data       | bytes   | That should be signed (this is passed to an external validator contract)                                        |
| signatures | bytes   | Signature data that should be verified. Can be ECDSA signature, contract signature (EIP-1271) or approved hash. |

### domainSeparator (0xf698da25)

```solidity
function domainSeparator() external view returns (bytes32)
```

Returns the domain separator for this contract, as defined in the EIP-712 standard.


Return values:

| Name | Type    | Description                        |
| :--- | :------ | :--------------------------------- |
| [0]  | bytes32 | bytes32 The domain separator hash. |

### getModulesPaginated (0xcc2f8452)

```solidity
function getModulesPaginated(
    address start,
    uint256 pageSize
) external view returns (address[] memory array, address next)
```

Returns array of modules.


Parameters:

| Name     | Type    | Description                                         |
| :------- | :------ | :-------------------------------------------------- |
| start    | address | Start of the page.                                  |
| pageSize | uint256 | Maximum number of modules that should be returned.  |


Return values:

| Name  | Type      | Description             |
| :---- | :-------- | :---------------------- |
| array | address[] | Array of modules.       |
| next  | address   | Start of the next page. |

### enableModule (0x610b5925)

```solidity
function enableModule(address module) external
```

Enables the module `module` for the Safe.

This can only be done via a Safe transaction.


Parameters:

| Name   | Type    | Description           |
| :----- | :------ | :-------------------- |
| module | address | Module to be enabled. |

### getThreshold (0xe75235b8)

```solidity
function getThreshold() external view returns (uint256)
```

Returns the number of required confirmations for a Safe transaction aka the threshold.


Return values:

| Name | Type    | Description       |
| :--- | :------ | :---------------- |
| [0]  | uint256 | Threshold number. |
