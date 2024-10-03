# CompatibilityFallbackHandler

## Overview

#### License: LGPL-3.0-only

```solidity
contract CompatibilityFallbackHandler is TokenCallbackHandler, ISignatureValidator
```

Author: Richard Meissner - @rmeissner
## Functions info

### isValidSignature (0x20c13b0b)

```solidity
function isValidSignature(
    bytes memory _data,
    bytes memory _signature
) public view override returns (bytes4)
```

Legacy EIP-1271 signature validation method.

Implementation of ISignatureValidator (see `interfaces/ISignatureValidator.sol`)


Parameters:

| Name       | Type  | Description                                                         |
| :--------- | :---- | :------------------------------------------------------------------ |
| _data      | bytes | Arbitrary length data signed on the behalf of address(msg.sender).  |
| _signature | bytes | Signature byte array associated with _data.                         |


Return values:

| Name | Type   | Description               |
| :--- | :----- | :------------------------ |
| [0]  | bytes4 | The EIP-1271 magic value. |

### getMessageHash (0x0a1028c4)

```solidity
function getMessageHash(bytes memory message) public view returns (bytes32)
```

Returns the hash of a message to be signed by owners.


Parameters:

| Name    | Type  | Description         |
| :------ | :---- | :------------------ |
| message | bytes | Raw message bytes.  |


Return values:

| Name | Type    | Description   |
| :--- | :------ | :------------ |
| [0]  | bytes32 | Message hash. |

### encodeMessageDataForSafe (0x23031640)

```solidity
function encodeMessageDataForSafe(
    Safe safe,
    bytes memory message
) public view returns (bytes memory)
```

Returns the pre-image of the message hash (see getMessageHashForSafe).


Parameters:

| Name    | Type          | Description                             |
| :------ | :------------ | :-------------------------------------- |
| safe    | contract Safe | Safe to which the message is targeted.  |
| message | bytes         | Message that should be encoded.         |


Return values:

| Name | Type  | Description      |
| :--- | :---- | :--------------- |
| [0]  | bytes | Encoded message. |

### getMessageHashForSafe (0x6ac24784)

```solidity
function getMessageHashForSafe(
    Safe safe,
    bytes memory message
) public view returns (bytes32)
```

Returns hash of a message that can be signed by owners.


Parameters:

| Name    | Type          | Description                             |
| :------ | :------------ | :-------------------------------------- |
| safe    | contract Safe | Safe to which the message is targeted.  |
| message | bytes         | Message that should be hashed.          |


Return values:

| Name | Type    | Description   |
| :--- | :------ | :------------ |
| [0]  | bytes32 | Message hash. |

### isValidSignature (0x1626ba7e)

```solidity
function isValidSignature(
    bytes32 _dataHash,
    bytes calldata _signature
) external view returns (bytes4)
```

Implementation of updated EIP-1271 signature validation method.


Parameters:

| Name       | Type    | Description                                                   |
| :--------- | :------ | :------------------------------------------------------------ |
| _dataHash  | bytes32 | Hash of the data signed on the behalf of address(msg.sender)  |
| _signature | bytes   | Signature byte array associated with _dataHash                |


Return values:

| Name | Type   | Description                                                      |
| :--- | :----- | :--------------------------------------------------------------- |
| [0]  | bytes4 | Updated EIP1271 magic value if signature is valid, otherwise 0x0 |

### getModules (0xb2494df3)

```solidity
function getModules() external view returns (address[] memory)
```

Returns array of first 10 modules.


Return values:

| Name | Type      | Description       |
| :--- | :-------- | :---------------- |
| [0]  | address[] | Array of modules. |

### simulate (0xbd61951d)

```solidity
function simulate(
    address targetContract,
    bytes calldata calldataPayload
) external returns (bytes memory response)
```

Performs a delegatecall on a targetContract in the context of self.
Internally reverts execution to avoid side effects (making it static). Catches revert and returns encoded result as bytes.


Parameters:

| Name            | Type    | Description                                                                              |
| :-------------- | :------ | :--------------------------------------------------------------------------------------- |
| targetContract  | address | Address of the contract containing the code to execute.                                  |
| calldataPayload | bytes   | Calldata that should be sent to the target contract (encoded method name and arguments). |
