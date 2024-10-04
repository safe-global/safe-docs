# SafeModuleSetup

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeModuleSetup
```

The Safe `setup` function accepts `to` and `data` parameters for a delegate call during initialization. This
contract can be specified as the `to` with `data` ABI encoding the `enableModules` call so that a Safe is
created with the specified modules. In particular, this allows a ERC-4337 compatible Safe to be created as part
of a ERC-4337 user operation with the `Safe4337Module` enabled right away.

security-contact: bounty@safe.global
## Functions info

### enableModules (0x8d0dc49f)

```solidity
function enableModules(address[] calldata modules) external
```

Enable the specified Safe modules.

This call will only work if used from a Safe via delegatecall. It is intended to be used as part of the
Safe `setup`, allowing Safes to be created with an initial set of enabled modules.


Parameters:

| Name    | Type      | Description            |
| :------ | :-------- | :--------------------- |
| modules | address[] | The modules to enable. |
