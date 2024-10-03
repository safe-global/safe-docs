# ViewStorageAccessible

## Overview

#### License: UNLICENSED

```solidity
interface ViewStorageAccessible
```

Adjusted version of https://github.com/gnosis/util-contracts/blob/3db1e531cb243a48ea91c60a800d537c1000612a/contracts/StorageAccessible.sol
## Functions info

### simulate (0xbd61951d)

```solidity
function simulate(
    address targetContract,
    bytes calldata calldataPayload
) external view returns (bytes memory)
```

Same as `simulate` on StorageAccessible. Marked as view so that it can be called from external contracts
that want to run simulations from within view functions. Will revert if the invoked simulation attempts to change state.