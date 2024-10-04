# FCL_ecdsa_utils

## Overview

#### License: MIT

```solidity
library FCL_ecdsa_utils
```


## Functions info

### ecdsa_verify

```solidity
function ecdsa_verify(
    bytes32 message,
    uint256[2] calldata rs,
    uint256 Qx,
    uint256 Qy
) internal view returns (bool)
```

ECDSA verification, given , signature, and public key.
### ecdsa_verify

```solidity
function ecdsa_verify(
    bytes32 message,
    uint256[2] calldata rs,
    uint256[2] calldata Q
) internal view returns (bool)
```


### ec_recover_r1

```solidity
function ec_recover_r1(
    uint256 h,
    uint256 v,
    uint256 r,
    uint256 s
) internal view returns (address)
```


### ecdsa_sign

```solidity
function ecdsa_sign(
    bytes32 message,
    uint256 k,
    uint256 kpriv
) internal view returns (uint256 r, uint256 s)
```


### ecdsa_derivKpub

```solidity
function ecdsa_derivKpub(
    uint256 kpriv
) internal view returns (uint256 x, uint256 y)
```


### Precalc_8dim

```solidity
function Precalc_8dim(
    uint256 Qx,
    uint256 Qy
) internal view returns (uint256[2][256] memory Prec)
```

