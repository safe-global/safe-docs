# SafeWebAuthnSignerSingleton

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeWebAuthnSignerSingleton is SignatureValidator
```

A singleton contract that implements WebAuthn signature verification. This singleton
contract must be used with the specialized proxy {SafeWebAuthnSignerProxy}, as it encodes the
credential configuration (public key coordinates and P-256 verifier to use) in calldata, which is
required by this implementation.

security-contact: bounty@safe.global
## Functions info

### getConfiguration (0x6bd50cef)

```solidity
function getConfiguration()
    public
    pure
    returns (uint256 x, uint256 y, P256.Verifiers verifiers)
```

Returns the x coordinate, y coordinate, and P-256 verifiers used for ECDSA signature
validation. The values are expected to appended to calldata by the caller. See the
{SafeWebAuthnSignerProxy} contract implementation.


Return values:

| Name      | Type           | Description                                |
| :-------- | :------------- | :----------------------------------------- |
| x         | uint256        | The x coordinate of the P-256 public key.  |
| y         | uint256        | The y coordinate of the P-256 public key.  |
| verifiers | P256.Verifiers | The P-256 verifiers.                       |
