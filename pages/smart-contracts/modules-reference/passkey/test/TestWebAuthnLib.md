# TestWebAuthnLib

## Overview

#### License: LGPL-3.0-only

```solidity
contract TestWebAuthnLib
```


## Functions info

### castSignature (0x330caaee)

```solidity
function castSignature(
    bytes calldata signature
) external pure returns (WebAuthn.Signature calldata data)
```


### encodeClientDataJson (0xaa657658)

```solidity
function encodeClientDataJson(
    bytes32 challenge,
    string calldata clientDataFields
) external pure returns (string memory clientDataJson)
```


### encodeSigningMessage (0x2dda25a4)

```solidity
function encodeSigningMessage(
    bytes32 challenge,
    bytes calldata authenticatorData,
    string calldata clientDataFields
) external view returns (bytes memory message)
```


### verifySignatureCastSig (0xc813d460)

```solidity
function verifySignatureCastSig(
    bytes32 challenge,
    bytes calldata signature,
    WebAuthn.AuthenticatorFlags authenticatorFlags,
    uint256 x,
    uint256 y,
    P256.Verifiers verifiers
) external view returns (bool success)
```


### verifySignature (0xff9afbf7)

```solidity
function verifySignature(
    bytes32 challenge,
    WebAuthn.Signature calldata signature,
    WebAuthn.AuthenticatorFlags authenticatorFlags,
    uint256 x,
    uint256 y,
    P256.Verifiers verifiers
) external view returns (bool success)
```

