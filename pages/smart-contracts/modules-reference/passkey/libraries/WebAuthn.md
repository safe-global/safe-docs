# WebAuthn

## Overview

#### License: LGPL-3.0-only

```solidity
library WebAuthn
```

Library for verifying WebAuthn signatures for public key credentials using the ES256
algorithm with the P-256 curve.

security-contact: bounty@safe.global
## Structs info

### Signature

```solidity
struct Signature {
	bytes authenticatorData;
	string clientDataFields;
	uint256 r;
	uint256 s;
}
```

The WebAuthn signature data format.

WebAuthn signatures are expected to be the ABI-encoded bytes of the following structure.


Parameters:

| Name              | Type    | Description                                                                                                                                                                                                         |
| :---------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| authenticatorData | bytes   | The authenticator data from the WebAuthn credential assertion.                                                                                                                                                      |
| clientDataFields  | string  | The additional fields from the client data JSON. This is the comma separated fields as they appear in the client data JSON from the WebAuthn credential assertion after the leading {type} and {challenge} fields.  |
| r                 | uint256 | The ECDSA signature's R component.                                                                                                                                                                                  |
| s                 | uint256 | The ECDSA signature's S component.                                                                                                                                                                                  |

## Functions info

### castSignature

```solidity
function castSignature(
    bytes calldata signature
) internal pure returns (bool isValid, WebAuthn.Signature calldata data)
```

Casts calldata bytes to a WebAuthn signature data structure.

This method casts the dynamic bytes array to a signature calldata pointer with some
additional verification. Specifically, we ensure that the signature bytes encoding is no
larger than standard ABI encoding form, to prevent attacks where valid signatures are padded
with 0s in order to increase signature verifications the costs for ERC-4337 user operations.

Parameters:

| Name      | Type  | Description                                    |
| :-------- | :---- | :--------------------------------------------- |
| signature | bytes | The calldata bytes of the WebAuthn signature.  |


Return values:

| Name    | Type                      | Description                                           |
| :------ | :------------------------ | :---------------------------------------------------- |
| isValid | bool                      | Whether or not the encoded signature bytes is valid.  |
| data    | struct WebAuthn.Signature | A pointer to the signature data in calldata.          |

### encodeClientDataJson

```solidity
function encodeClientDataJson(
    bytes32 challenge,
    string calldata clientDataFields
) internal pure returns (string memory clientDataJson)
```

Encodes the client data JSON string from the specified challenge, and additional
client data fields.

The client data JSON follows a very specific encoding process outlined in the Web
Authentication standard. See <https://w3c.github.io/webauthn/#clientdatajson-serialization>.


Parameters:

| Name             | Type    | Description                                                |
| :--------------- | :------ | :--------------------------------------------------------- |
| challenge        | bytes32 | The WebAuthn challenge used for the credential assertion.  |
| clientDataFields | string  | Client data fields.                                        |


Return values:

| Name           | Type   | Description                   |
| :------------- | :----- | :---------------------------- |
| clientDataJson | string | The encoded client data JSON. |

### encodeSigningMessage

```solidity
function encodeSigningMessage(
    bytes32 challenge,
    bytes calldata authenticatorData,
    string calldata clientDataFields
) internal view returns (bytes memory message)
```

Encodes the message that is signed in a WebAuthn assertion.

The signing message is defined to be the concatenation of the authenticator data bytes
with the 32-byte SHA-256 digest of the client data JSON. The hashing algorithm used on the
signing message itself depends on the public key algorithm that was selected on WebAuthn
credential creation.


Parameters:

| Name              | Type    | Description                                                |
| :---------------- | :------ | :--------------------------------------------------------- |
| challenge         | bytes32 | The WebAuthn challenge used for the credential assertion.  |
| authenticatorData | bytes   | Authenticator data.                                        |
| clientDataFields  | string  | Client data fields.                                        |


Return values:

| Name    | Type  | Description            |
| :------ | :---- | :--------------------- |
| message | bytes | Signing message bytes. |

### checkAuthenticatorFlags

```solidity
function checkAuthenticatorFlags(
    bytes calldata authenticatorData,
    WebAuthn.AuthenticatorFlags authenticatorFlags
) internal pure returns (bool success)
```

Checks that the required authenticator data flags are set.


Parameters:

| Name               | Type                        | Description                            |
| :----------------- | :-------------------------- | :------------------------------------- |
| authenticatorData  | bytes                       | The authenticator data.                |
| authenticatorFlags | WebAuthn.AuthenticatorFlags | The authenticator flags to check for.  |


Return values:

| Name    | Type | Description                                   |
| :------ | :--- | :-------------------------------------------- |
| success | bool | Whether the authenticator data flags are set. |

### verifySignature

```solidity
function verifySignature(
    bytes32 challenge,
    bytes calldata signature,
    WebAuthn.AuthenticatorFlags authenticatorFlags,
    uint256 x,
    uint256 y,
    P256.Verifiers verifiers
) internal view returns (bool success)
```

Verifies a WebAuthn signature.


Parameters:

| Name               | Type                        | Description                                               |
| :----------------- | :-------------------------- | :-------------------------------------------------------- |
| challenge          | bytes32                     | The WebAuthn challenge used in the credential assertion.  |
| signature          | bytes                       | The encoded WebAuthn signature bytes.                     |
| authenticatorFlags | WebAuthn.AuthenticatorFlags | The authenticator data flags that must be set.            |
| x                  | uint256                     | The x-coordinate of the credential's public key.          |
| y                  | uint256                     | The y-coordinate of the credential's public key.          |
| verifiers          | P256.Verifiers              | The P-256 verifier configuration to use.                  |


Return values:

| Name    | Type | Description                     |
| :------ | :--- | :------------------------------ |
| success | bool | Whether the signature is valid. |

### verifySignature

```solidity
function verifySignature(
    bytes32 challenge,
    WebAuthn.Signature calldata signature,
    WebAuthn.AuthenticatorFlags authenticatorFlags,
    uint256 x,
    uint256 y,
    P256.Verifiers verifiers
) internal view returns (bool success)
```

Verifies a WebAuthn signature.


Parameters:

| Name               | Type                        | Description                                               |
| :----------------- | :-------------------------- | :-------------------------------------------------------- |
| challenge          | bytes32                     | The WebAuthn challenge used in the credential assertion.  |
| signature          | struct WebAuthn.Signature   | The WebAuthn signature data.                              |
| authenticatorFlags | WebAuthn.AuthenticatorFlags | The authenticator data flags that must be set.            |
| x                  | uint256                     | The x-coordinate of the credential's public key.          |
| y                  | uint256                     | The y-coordinate of the credential's public key.          |
| verifiers          | P256.Verifiers              | The P-256 verifier configuration to use.                  |


Return values:

| Name    | Type | Description                     |
| :------ | :--- | :------------------------------ |
| success | bool | Whether the signature is valid. |
