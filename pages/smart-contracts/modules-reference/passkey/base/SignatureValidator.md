# SignatureValidator

## Overview

#### License: LGPL-3.0-only

```solidity
abstract contract SignatureValidator
```

A interface for smart contract Safe owners that supports multiple ERC-1271 `isValidSignature` versions.

security-contact: bounty@safe.global
## Functions info

### isValidSignature (0x20c13b0b)

```solidity
function isValidSignature(
    bytes memory data,
    bytes calldata signature
) external view returns (bytes4 magicValue)
```

Validates the signature for the given data.


Parameters:

| Name      | Type  | Description                     |
| :-------- | :---- | :------------------------------ |
| data      | bytes | The signed data bytes.          |
| signature | bytes | The signature to be validated.  |


Return values:

| Name       | Type   | Description                                               |
| :--------- | :----- | :-------------------------------------------------------- |
| magicValue | bytes4 | The magic value indicating the validity of the signature. |

### isValidSignature (0x1626ba7e)

```solidity
function isValidSignature(
    bytes32 message,
    bytes calldata signature
) external view returns (bytes4 magicValue)
```

Validates the signature for a given data hash.


Parameters:

| Name      | Type    | Description                     |
| :-------- | :------ | :------------------------------ |
| message   | bytes32 | The signed message.             |
| signature | bytes   | The signature to be validated.  |


Return values:

| Name       | Type   | Description                                               |
| :--------- | :----- | :-------------------------------------------------------- |
| magicValue | bytes4 | The magic value indicating the validity of the signature. |
