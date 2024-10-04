# SafeWebAuthnSignerFactory

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeWebAuthnSignerFactory is ISafeSignerFactory
```

A factory contract for creating WebAuthn signers. Additionally, the factory supports
signature verification without deploying a signer proxies.

security-contact: bounty@safe.global
## State variables info

### SINGLETON (0x5a28a1db)

```solidity
contract SafeWebAuthnSignerSingleton immutable SINGLETON
```

The {SafeWebAuthnSignerSingleton} implementation to that is used for signature
verification by this contract and any proxies it deploys.
## Functions info

### constructor

```solidity
constructor()
```

Creates a new WebAuthn Safe signer factory contract.

The {SafeWebAuthnSignerSingleton} singleton implementation is created with as part of
this constructor. This ensures that the singleton contract is known, and lets us make certain
assumptions about how it works.
### getSigner (0xa541d91a)

```solidity
function getSigner(
    uint256 x,
    uint256 y,
    P256.Verifiers verifiers
) public view override returns (address signer)
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
) external view override returns (bytes4 magicValue)
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
