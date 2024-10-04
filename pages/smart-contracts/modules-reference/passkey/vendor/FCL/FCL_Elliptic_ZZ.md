# FCL_Elliptic_ZZ

## Overview

#### License: MIT

```solidity
library FCL_Elliptic_ZZ
```


## Functions info

### FCL_nModInv

```solidity
function FCL_nModInv(uint256 u) internal view returns (uint256 result)
```

/* inversion mod n via a^(n-2), use of precompiled using little Fermat theorem
### FCL_pModInv

```solidity
function FCL_pModInv(uint256 u) internal view returns (uint256 result)
```

/* @dev inversion mod nusing little Fermat theorem via a^(n-2), use of precompiled
### ecZZ_Coronize

```solidity
function ecZZ_Coronize(
    uint256 alpha,
    uint256 x,
    uint256 y,
    uint256 zz,
    uint256 zzz
) internal pure returns (uint256 x3, uint256 y3, uint256 zz3, uint256 zzz3)
```


### ecZZ_Add

```solidity
function ecZZ_Add(
    uint256 x1,
    uint256 y1,
    uint256 zz1,
    uint256 zzz1,
    uint256 x2,
    uint256 y2,
    uint256 zz2,
    uint256 zzz2
) internal pure returns (uint256 x3, uint256 y3, uint256 zz3, uint256 zzz3)
```


### SqrtMod

```solidity
function SqrtMod(uint256 self) internal view returns (uint256 result)
```

Calculate one modular square root of a given integer. Assume that p=3 mod 4.

Uses the ModExp precompiled contract at address 0x05 for fast computation using little Fermat theorem


Parameters:

| Name | Type    | Description                                       |
| :--- | :------ | :------------------------------------------------ |
| self | uint256 | The integer of which to find the modular inverse  |


Return values:

| Name   | Type    | Description                                                                                      |
| :----- | :------ | :----------------------------------------------------------------------------------------------- |
| result | uint256 | The modular inverse of the input integer. If the modular inverse doesn't exist, it revert the tx |

### ecAff_SetZZ

```solidity
function ecAff_SetZZ(
    uint256 x0,
    uint256 y0
) internal pure returns (uint256[4] memory P)
```

/* @dev Convert from affine rep to XYZZ rep
### ec_Decompress

```solidity
function ec_Decompress(
    uint256 x,
    uint256 parity
) internal view returns (uint256 y)
```


### ecZZ_SetAff

```solidity
function ecZZ_SetAff(
    uint256 x,
    uint256 y,
    uint256 zz,
    uint256 zzz
) internal view returns (uint256 x1, uint256 y1)
```

/* @dev Convert from XYZZ rep to affine rep
### ecZZ_Dbl

```solidity
function ecZZ_Dbl(
    uint256 x,
    uint256 y,
    uint256 zz,
    uint256 zzz
) internal pure returns (uint256 P0, uint256 P1, uint256 P2, uint256 P3)
```

/* @dev Sutherland2008 doubling
### ecZZ_AddN

```solidity
function ecZZ_AddN(
    uint256 x1,
    uint256 y1,
    uint256 zz1,
    uint256 zzz1,
    uint256 x2,
    uint256 y2
) internal pure returns (uint256 P0, uint256 P1, uint256 P2, uint256 P3)
```

Sutherland2008 add a ZZ point with a normalized point and greedy formulae
warning: assume that P1(x1,y1)!=P2(x2,y2), true in multiplication loop with prime order (cofactor 1)
### ecZZ_SetZero

```solidity
function ecZZ_SetZero()
    internal
    pure
    returns (uint256 x, uint256 y, uint256 zz, uint256 zzz)
```

Return the zero curve in XYZZ coordinates.
### ecZZ_IsZero

```solidity
function ecZZ_IsZero(
    uint256,
    uint256 y0,
    uint256,
    uint256
) internal pure returns (bool)
```

Check if point is the neutral of the curve
### ecAff_SetZero

```solidity
function ecAff_SetZero() internal pure returns (uint256 x, uint256 y)
```

Return the zero curve in affine coordinates. Compatible with the double formulae (no special case)
### ecAff_IsZero

```solidity
function ecAff_IsZero(uint256, uint256 y) internal pure returns (bool flag)
```

Check if the curve is the zero curve in affine rep.
### ecAff_isOnCurve

```solidity
function ecAff_isOnCurve(uint256 x, uint256 y) internal pure returns (bool)
```

Check if a point in affine coordinates is on the curve (reject Neutral that is indeed on the curve).
### ecAff_add

```solidity
function ecAff_add(
    uint256 x0,
    uint256 y0,
    uint256 x1,
    uint256 y1
) internal view returns (uint256, uint256)
```

Add two elliptic curve points in affine coordinates. Deal with P=Q
### ecZZ_mulmuladd_S_asm

```solidity
function ecZZ_mulmuladd_S_asm(
    uint256 Q0,
    uint256 Q1,
    uint256 scalar_u,
    uint256 scalar_v
) internal view returns (uint256 X)
```

Computation of uG+vQ using Strauss-Shamir's trick, G basepoint, Q public key
Returns only x for ECDSA use
### ecZZ_mulmuladd

```solidity
function ecZZ_mulmuladd(
    uint256 Q0,
    uint256 Q1,
    uint256 scalar_u,
    uint256 scalar_v
) internal view returns (uint256 X, uint256 Y)
```

Computation of uG+vQ using Strauss-Shamir's trick, G basepoint, Q public key
Returns affine representation of point (normalized)
### ecZZ_mulmuladd_S8_extcode

```solidity
function ecZZ_mulmuladd_S8_extcode(
    uint256 scalar_u,
    uint256 scalar_v,
    address dataPointer
) internal view returns (uint256 X)
```


### ecZZ_mulmuladd_S8_hackmem

```solidity
function ecZZ_mulmuladd_S8_hackmem(
    uint256 scalar_u,
    uint256 scalar_v,
    uint256 dataPointer
) internal view returns (uint256 X)
```


### ecdsa_precomputed_hackmem

```solidity
function ecdsa_precomputed_hackmem(
    bytes32 message,
    uint256[2] calldata rs,
    uint256 endcontract
) internal view returns (bool)
```

ECDSA verification using a precomputed table of multiples of P and Q appended at end of contract at address endcontract
generation of contract bytecode for precomputations is done using sagemath code
(see sage directory, WebAuthn_precompute.sage)