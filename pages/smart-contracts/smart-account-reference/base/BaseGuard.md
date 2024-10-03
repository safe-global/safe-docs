# BaseGuard

## Overview

#### License: LGPL-3.0-only

```solidity
abstract contract BaseGuard is Guard
```


## Functions info

### supportsInterface (0x01ffc9a7)

```solidity
function supportsInterface(
    bytes4 interfaceId
) external view virtual override returns (bool)
```

Returns true if this contract implements the interface defined by `interfaceId`.
See the corresponding EIP section
https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified
to learn more about how these ids are created.

This function call must use less than 30 000 gas.