# IERC165

## Overview

#### License: LGPL-3.0-only

```solidity
interface IERC165
```

More details at https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/introspection/IERC165.sol
## Functions info

### supportsInterface (0x01ffc9a7)

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

Returns true if this contract implements the interface defined by `interfaceId`.
See the corresponding EIP section
https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified
to learn more about how these ids are created.

This function call must use less than 30 000 gas.