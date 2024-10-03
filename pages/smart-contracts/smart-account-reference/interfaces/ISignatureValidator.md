# ISignatureValidator

## Overview

#### License: LGPL-3.0-only

```solidity
abstract contract ISignatureValidator is ISignatureValidatorConstants
```


## Functions info

### isValidSignature (0x20c13b0b)

```solidity
function isValidSignature(
    bytes memory _data,
    bytes memory _signature
) public view virtual returns (bytes4)
```

Legacy EIP1271 method to validate a signature.


Parameters:

| Name       | Type  | Description                                                                                                                                                                                                                      |
| :--------- | :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _data      | bytes | Arbitrary length data signed on the behalf of address(this).                                                                                                                                                                     |
| _signature | bytes | Signature byte array associated with _data.  MUST return the bytes4 magic value 0x20c13b0b when function passes. MUST NOT modify state (using STATICCALL for solc < 0.5, view modifier for solc > 0.5) MUST allow external calls |
