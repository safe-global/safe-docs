# HandlerContext

## Overview

#### License: LGPL-3.0-only

```solidity
abstract contract HandlerContext
```

Author: Richard Meissner - @rmeissner
The fallback manager appends the following context to the calldata:
1. Fallback manager caller address (non-padded)
based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/f8cc8b844a9f92f63dc55aa581f7d643a1bc5ac1/contracts/metatx/ERC2771Context.sol
