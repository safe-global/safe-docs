# FCLP256Verifier

## Overview

#### License: LGPL-3.0-only

```solidity
contract FCLP256Verifier is IP256Verifier
```

security-contact: bounty@safe.global
## Functions info

### fallback

```solidity
fallback(bytes calldata input) external returns (bytes memory output)
```

 A fallback function that takes the following input format and returns a result
indicating whether the signature is valid or not:
- `input[  0: 32]`: message
- `input[ 32: 64]`: signature r
- `input[ 64: 96]`: signature s
- `input[ 96:128]`: public key x
- `input[128:160]`: public key y

The output is either:
- `abi.encode(1)` bytes for a valid signature.
- `""` empty bytes for an invalid signature or error.

Note that this function does not follow the Solidity ABI format (in particular, it does not
have a 4-byte selector), which is why it requires a fallback function and not regular
Solidity function. Additionally, it has `view` function semantics, and is expected to be
called with `STATICCALL` opcode.



Parameters:

| Name  | Type  | Description                    |
| :---- | :---- | :----------------------------- |
| input | bytes | The encoded input parameters.  |


Return values:

| Name   | Type  | Description                                |
| :----- | :---- | :----------------------------------------- |
| output | bytes | The encoded signature verification result. |
