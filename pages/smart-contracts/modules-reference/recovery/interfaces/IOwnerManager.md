# IOwnerManager

## Overview

#### License: LGPL-3.0-only

```solidity
interface IOwnerManager
```

Author: @safe-global/safe-protocol
## Events info

### AddedOwner

```solidity
event AddedOwner(address indexed owner)
```


### RemovedOwner

```solidity
event RemovedOwner(address indexed owner)
```


### ChangedThreshold

```solidity
event ChangedThreshold(uint256 threshold)
```


## Functions info

### addOwnerWithThreshold (0x0d582f13)

```solidity
function addOwnerWithThreshold(address owner, uint256 _threshold) external
```

Adds the owner `owner` to the Safe and updates the threshold to `_threshold`.

This can only be done via a Safe transaction.


Parameters:

| Name       | Type    | Description         |
| :--------- | :------ | :------------------ |
| owner      | address | New owner address.  |
| _threshold | uint256 | New threshold.      |

### removeOwner (0xf8dc5dd9)

```solidity
function removeOwner(
    address prevOwner,
    address owner,
    uint256 _threshold
) external
```

Removes the owner `owner` from the Safe and updates the threshold to `_threshold`.

This can only be done via a Safe transaction.


Parameters:

| Name       | Type    | Description                                                       |
| :--------- | :------ | :---------------------------------------------------------------- |
| prevOwner  | address | Owner that pointed to the owner to be removed in the linked list  |
| owner      | address | Owner address to be removed.                                      |
| _threshold | uint256 | New threshold.                                                    |

### swapOwner (0xe318b52b)

```solidity
function swapOwner(
    address prevOwner,
    address oldOwner,
    address newOwner
) external
```

Replaces the owner `oldOwner` in the Safe with `newOwner`.

This can only be done via a Safe transaction.


Parameters:

| Name      | Type    | Description                                                        |
| :-------- | :------ | :----------------------------------------------------------------- |
| prevOwner | address | Owner that pointed to the owner to be replaced in the linked list  |
| oldOwner  | address | Owner address to be replaced.                                      |
| newOwner  | address | New owner address.                                                 |

### changeThreshold (0x694e80c3)

```solidity
function changeThreshold(uint256 _threshold) external
```

Changes the threshold of the Safe to `_threshold`.

This can only be done via a Safe transaction.


Parameters:

| Name       | Type    | Description    |
| :--------- | :------ | :------------- |
| _threshold | uint256 | New threshold. |

### getThreshold (0xe75235b8)

```solidity
function getThreshold() external view returns (uint256)
```

Returns the number of required confirmations for a Safe transaction aka the threshold.


Return values:

| Name | Type    | Description       |
| :--- | :------ | :---------------- |
| [0]  | uint256 | Threshold number. |

### isOwner (0x2f54bf6e)

```solidity
function isOwner(address owner) external view returns (bool)
```

Returns if `owner` is an owner of the Safe.


Return values:

| Name | Type | Description                               |
| :--- | :--- | :---------------------------------------- |
| [0]  | bool | Boolean if owner is an owner of the Safe. |

### getOwners (0xa0e67e2b)

```solidity
function getOwners() external view returns (address[] memory)
```

Returns a list of Safe owners.


Return values:

| Name | Type      | Description           |
| :--- | :-------- | :-------------------- |
| [0]  | address[] | Array of Safe owners. |
