# TestP256Lib

## Overview

#### License: LGPL-3.0-only

```solidity
contract TestP256Lib
```


## Functions info

### verifySignature (0x7cc4bd97)

```solidity
function verifySignature(
    IP256Verifier verifier,
    bytes32 message,
    uint256 r,
    uint256 s,
    uint256 x,
    uint256 y
) external view returns (bool success)
```


### verifySignatureAllowMalleability (0x9ae8c627)

```solidity
function verifySignatureAllowMalleability(
    IP256Verifier verifier,
    bytes32 message,
    uint256 r,
    uint256 s,
    uint256 x,
    uint256 y
) external view returns (bool success)
```


### verifySignatureWithVerifiers (0x70476ffe)

```solidity
function verifySignatureWithVerifiers(
    P256.Verifiers verifiers,
    bytes32 message,
    uint256 r,
    uint256 s,
    uint256 x,
    uint256 y
) external view returns (bool success)
```


### verifySignatureWithVerifiersAllowMalleability (0xcd484004)

```solidity
function verifySignatureWithVerifiersAllowMalleability(
    P256.Verifiers verifiers,
    bytes32 message,
    uint256 r,
    uint256 s,
    uint256 x,
    uint256 y
) external view returns (bool success)
```

