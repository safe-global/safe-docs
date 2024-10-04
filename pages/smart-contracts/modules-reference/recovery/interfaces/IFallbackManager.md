# IFallbackManager

## Overview

#### License: LGPL-3.0-only

```solidity
interface IFallbackManager
```

Author: @safe-global/safe-protocol
## Events info

### ChangedFallbackHandler

```solidity
event ChangedFallbackHandler(address indexed handler)
```


## Functions info

### setFallbackHandler (0xf08a0323)

```solidity
function setFallbackHandler(address handler) external
```

Set Fallback Handler to `handler` for the Safe.

Only fallback calls without value and with data will be forwarded.
This can only be done via a Safe transaction.
Cannot be set to the Safe itself.


Parameters:

| Name    | Type    | Description                        |
| :------ | :------ | :--------------------------------- |
| handler | address | contract to handle fallback calls. |
