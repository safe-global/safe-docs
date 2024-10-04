# FCL_WebAuthn

## Overview

#### License: MIT

```solidity
library FCL_WebAuthn
```


## Errors info

### InvalidAuthenticatorData

```solidity
error InvalidAuthenticatorData()
```


### InvalidClientData

```solidity
error InvalidClientData()
```


### InvalidSignature

```solidity
error InvalidSignature()
```


## Functions info

### WebAuthn_format

```solidity
function WebAuthn_format(
    bytes calldata authenticatorData,
    bytes1 authenticatorDataFlagMask,
    bytes calldata clientData,
    bytes32 clientChallenge,
    uint256 clientChallengeDataOffset,
    uint256[2] calldata
) internal pure returns (bytes32 result)
```


### checkSignature

```solidity
function checkSignature(
    bytes calldata authenticatorData,
    bytes1 authenticatorDataFlagMask,
    bytes calldata clientData,
    bytes32 clientChallenge,
    uint256 clientChallengeDataOffset,
    uint256[2] calldata rs,
    uint256[2] calldata Q
) internal view returns (bool)
```


### checkSignature

```solidity
function checkSignature(
    bytes calldata authenticatorData,
    bytes1 authenticatorDataFlagMask,
    bytes calldata clientData,
    bytes32 clientChallenge,
    uint256 clientChallengeDataOffset,
    uint256[2] calldata rs,
    uint256 Qx,
    uint256 Qy
) internal view returns (bool)
```


### checkSignature_prec

```solidity
function checkSignature_prec(
    bytes calldata authenticatorData,
    bytes1 authenticatorDataFlagMask,
    bytes calldata clientData,
    bytes32 clientChallenge,
    uint256 clientChallengeDataOffset,
    uint256[2] calldata rs,
    address dataPointer
) internal view returns (bool)
```


### checkSignature_hackmem

```solidity
function checkSignature_hackmem(
    bytes calldata authenticatorData,
    bytes1 authenticatorDataFlagMask,
    bytes calldata clientData,
    bytes32 clientChallenge,
    uint256 clientChallengeDataOffset,
    uint256[2] calldata rs,
    uint256 dataPointer
) internal view returns (bool)
```

