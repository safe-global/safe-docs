# IUniqueSignerFactory

## Overview

#### License: LGPL-3.0-only

```solidity
interface IUniqueSignerFactory
```


## Functions info

### getSigner (0xe6adabfd)

```solidity
function getSigner(bytes memory data) external view returns (address signer)
```

Gets the unique signer address for the specified data.

The unique signer address must be unique for some given data. The signer is not guaranteed to be created yet.


Parameters:

| Name | Type  | Description                |
| :--- | :---- | :------------------------- |
| data | bytes | The signer specific data.  |


Return values:

| Name   | Type    | Description         |
| :----- | :------ | :------------------ |
| signer | address | The signer address. |

### createSigner (0xd312e182)

```solidity
function createSigner(bytes memory data) external returns (address signer)
```

Create a new unique signer for the specified data.

The unique signer address must be unique for some given data. This must not revert if the unique owner already exists.


Parameters:

| Name | Type  | Description                |
| :--- | :---- | :------------------------- |
| data | bytes | The signer specific data.  |


Return values:

| Name   | Type    | Description         |
| :----- | :------ | :------------------ |
| signer | address | The signer address. |

### isValidSignatureForSigner (0x930bbb3b)

```solidity
function isValidSignatureForSigner(
    bytes32 message,
    bytes calldata signature,
    bytes calldata signerData
) external view returns (bytes4 magicValue)
```

Verifies a signature for the specified address without deploying it.

This must be equivalent to first deploying the signer with the factory, and then verifying the signature
with it directly: `factory.createSigner(signerData).isValidSignature(message, signature)`


Parameters:

| Name       | Type    | Description                               |
| :--------- | :------ | :---------------------------------------- |
| message    | bytes32 | The signed message.                       |
| signature  | bytes   | The signature bytes.                      |
| signerData | bytes   | The signer data to verify signature for.  |


Return values:

| Name       | Type   | Description                                                                                                                                                                                 |
| :--------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| magicValue | bytes4 | Returns a legacy EIP-1271 magic value (`bytes4(keccak256(isValidSignature(bytes,bytes))`) when the signature is valid. Reverting or returning any other value implies an invalid signature. |
