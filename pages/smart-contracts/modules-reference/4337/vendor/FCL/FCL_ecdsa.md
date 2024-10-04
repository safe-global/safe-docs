# FCL_ecdsa

## Overview

#### License: MIT

```solidity
library FCL_ecdsa
```


## Functions info

### ecdsa_verify

```solidity
function ecdsa_verify(
    bytes32 message,
    uint256 r,
    uint256 s,
    uint256 Qx,
    uint256 Qy
) internal view returns (bool)
```

ECDSA verification, given , signature, and public key, no calldata version
### ec_recover_r1

```solidity
function ec_recover_r1(
    uint256 h,
    uint256 v,
    uint256 r,
    uint256 s
) internal view returns (address)
```


### ecdsa_precomputed_verify

```solidity
function ecdsa_precomputed_verify(
    bytes32 message,
    uint256 r,
    uint256 s,
    address Shamir8
) internal view returns (bool)
```


### ecdsa_precomputed_verify

```solidity
function ecdsa_precomputed_verify(
    bytes32 message,
    uint256[2] calldata rs,
    address Shamir8
) internal view returns (bool)
```

