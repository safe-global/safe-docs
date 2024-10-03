# CreateCall

## Overview

#### License: LGPL-3.0-only

```solidity
contract CreateCall
```

Author: Richard Meissner - @rmeissner

This contract provides functions for deploying a new contract using the create and create2 opcodes.
## Events info

### ContractCreation

```solidity
event ContractCreation(address indexed newContract)
```

Emitted when a new contract is created
## Functions info

### performCreate2 (0x4847be6f)

```solidity
function performCreate2(
    uint256 value,
    bytes memory deploymentData,
    bytes32 salt
) public returns (address newContract)
```

Deploys a new contract using the create2 opcode.


Parameters:

| Name           | Type    | Description                                              |
| :------------- | :------ | :------------------------------------------------------- |
| value          | uint256 | The value in wei to be sent with the contract creation.  |
| deploymentData | bytes   | The initialisation code of the contract to be created.   |
| salt           | bytes32 | The salt value to use for the contract creation.         |


Return values:

| Name        | Type    | Description                                |
| :---------- | :------ | :----------------------------------------- |
| newContract | address | The address of the newly created contract. |

### performCreate (0x4c8c9ea1)

```solidity
function performCreate(
    uint256 value,
    bytes memory deploymentData
) public returns (address newContract)
```

Deploys a new contract using the create opcode.


Parameters:

| Name           | Type    | Description                                              |
| :------------- | :------ | :------------------------------------------------------- |
| value          | uint256 | The value in wei to be sent with the contract creation.  |
| deploymentData | bytes   | The initialisation code of the contract to be created.   |


Return values:

| Name        | Type    | Description                                |
| :---------- | :------ | :----------------------------------------- |
| newContract | address | The address of the newly created contract. |
