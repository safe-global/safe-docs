# ISafeSignerFactory

## Overview

#### License: LGPL-3.0-only

```solidity
interface ISafeSignerFactory
```

Interface for a factory contract that can create ERC-1271 compatible signers, and verify
signatures for custom P-256 signing schemes.

security-contact: bounty@safe.global
## Events info

### Created

```solidity
event Created(address indexed signer, uint256 x, uint256 y, P256.Verifiers verifiers)
```

Emitted when a new signer is created.


Parameters:

| Name      | Type           | Description                          |
| :-------- | :------------- | :----------------------------------- |
| signer    | address        | The signer address.                  |
| x         | uint256        | The x-coordinate of the public key.  |
| y         | uint256        | The y-coordinate of the public key.  |
| verifiers | P256.Verifiers | The P-256 verifiers to use.          |

## Functions info

### getSigner (0xa541d91a)

```solidity
function getSigner(
    uint256 x,
    uint256 y,
    P256.Verifiers verifiers
) external view returns (address signer)
```

Gets the unique signer address for the specified data.

The unique signer address must be unique for some given data. The signer is not
guaranteed to be created yet.


Parameters:

| Name      | Type           | Description                          |
| :-------- | :------------- | :----------------------------------- |
| x         | uint256        | The x-coordinate of the public key.  |
| y         | uint256        | The y-coordinate of the public key.  |
| verifiers | P256.Verifiers | The P-256 verifiers to use.          |


Return values:

| Name   | Type    | Description         |
| :----- | :------ | :------------------ |
| signer | address | The signer address. |

### createSigner (0x0d2f0489)

```solidity
function createSigner(
    uint256 x,
    uint256 y,
    P256.Verifiers verifiers
) external returns (address signer)
```

Create a new unique signer for the specified data.

The unique signer address must be unique for some given data. This must not revert if
the unique owner already exists.


Parameters:

| Name      | Type           | Description                          |
| :-------- | :------------- | :----------------------------------- |
| x         | uint256        | The x-coordinate of the public key.  |
| y         | uint256        | The y-coordinate of the public key.  |
| verifiers | P256.Verifiers | The P-256 verifiers to use.          |


Return values:

| Name   | Type    | Description         |
| :----- | :------ | :------------------ |
| signer | address | The signer address. |

### isValidSignatureForSigner (0xcb48798b)

```solidity
function isValidSignatureForSigner(
    bytes32 message,
    bytes calldata signature,
    uint256 x,
    uint256 y,
    P256.Verifiers verifiers
) external view returns (bytes4 magicValue)
```

Verifies a signature for the specified address without deploying it.

This must be equivalent to first deploying the signer with the factory, and then
verifying the signature with it directly:
`factory.createSigner(signerData).isValidSignature(message, signature)`


Parameters:

| Name      | Type           | Description                          |
| :-------- | :------------- | :----------------------------------- |
| message   | bytes32        | The signed message.                  |
| signature | bytes          | The signature bytes.                 |
| x         | uint256        | The x-coordinate of the public key.  |
| y         | uint256        | The y-coordinate of the public key.  |
| verifiers | P256.Verifiers | The P-256 verifiers to use.          |


Return values:

| Name       | Type   | Description                                                                                                                        |
| :--------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------- |
| magicValue | bytes4 | Returns the ERC-1271 magic value when the signature is valid. Reverting or returning any other value implies an invalid signature. |
