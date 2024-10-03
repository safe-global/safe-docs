# GuardManager

## Overview

#### License: LGPL-3.0-only

```solidity
abstract contract GuardManager is SelfAuthorized
```

Author: Richard Meissner - @rmeissner
## Events info

### ChangedGuard

```solidity
event ChangedGuard(address indexed guard)
```


## Functions info

### setGuard (0xe19a9dd9)

```solidity
function setGuard(address guard) external authorized
```

Set Transaction Guard `guard` for the Safe. Make sure you trust the guard.

Set a guard that checks transactions before execution
This can only be done via a Safe transaction.
⚠️ IMPORTANT: Since a guard has full power to block Safe transaction execution,
a broken guard can cause a denial of service for the Safe. Make sure to carefully
audit the guard code and design recovery mechanisms.


Parameters:

| Name  | Type    | Description                                                               |
| :---- | :------ | :------------------------------------------------------------------------ |
| guard | address | The address of the guard to be used or the 0 address to disable the guard |
