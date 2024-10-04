# SafeWebAuthnSignerProxy

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeWebAuthnSignerProxy
```

A specialized proxy to a {SafeWebAuthnSignerSingleton} signature validator implementation
for Safe accounts. Using a proxy pattern for the signature validator greatly reduces deployment
gas costs.

security-contact: bounty@safe.global
## Functions info

### constructor

```solidity
constructor(address singleton, uint256 x, uint256 y, P256.Verifiers verifiers)
```

Creates a new WebAuthn Safe Signer Proxy.


Parameters:

| Name      | Type           | Description                                                           |
| :-------- | :------------- | :-------------------------------------------------------------------- |
| singleton | address        | The {SafeWebAuthnSignerSingleton} implementation to proxy to.         |
| x         | uint256        | The x coordinate of the P-256 public key of the WebAuthn credential.  |
| y         | uint256        | The y coordinate of the P-256 public key of the WebAuthn credential.  |
| verifiers | P256.Verifiers | The P-256 verifiers used for ECDSA signature verification.            |

### fallback

```solidity
fallback() external payable
```

Fallback function forwards all transactions and returns all received return data.