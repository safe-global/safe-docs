# GuardianStorage

## Overview

#### License: GPL-3.0

```solidity
contract GuardianStorage is IGuardianStorage
```

Author: CANDIDE Labs team
Contract storing the state of wallets related to guardians.
This contract contains all guardian management rules, only enabled modules for a wallet can modify its state.

## Structs info

### GuardianStorageEntry

```solidity
struct GuardianStorageEntry {
	mapping(address => address) guardians;
	uint256 count;
	uint256 threshold;
}
```


## Events info

### GuardianAdded

```solidity
event GuardianAdded(address indexed wallet, address indexed guardian)
```


### GuardianRevoked

```solidity
event GuardianRevoked(address indexed wallet, address indexed guardian)
```


### ChangedThreshold

```solidity
event ChangedThreshold(address indexed wallet, uint256 threshold)
```


## Modifiers info

### onlyWhenModuleIsEnabled

```solidity
modifier onlyWhenModuleIsEnabled()
```

Throws if the caller is not an enabled module.
## Functions info

### addGuardianWithThreshold (0xbe0e54d7)

```solidity
function addGuardianWithThreshold(
    address _guardian,
    uint256 _threshold
) external onlyWhenModuleIsEnabled
```

Lets an authorised module add a guardian to a wallet and change the threshold.


Parameters:

| Name      | Type    | Description          |
| :-------- | :------ | :------------------- |
| _guardian | address | The guardian to add. |

### revokeGuardianWithThreshold (0x936f7d86)

```solidity
function revokeGuardianWithThreshold(
    address _prevGuardian,
    address _guardian,
    uint256 _threshold
) external onlyWhenModuleIsEnabled
```

Lets an authorised module revoke a guardian from a wallet and change the threshold.


Parameters:

| Name          | Type    | Description                                                             |
| :------------ | :------ | :---------------------------------------------------------------------- |
| _prevGuardian | address | Guardian that pointed to the guardian to be removed in the linked list  |
| _guardian     | address | The guardian to revoke.                                                 |

### changeThreshold (0x694e80c3)

```solidity
function changeThreshold(uint256 _threshold) external onlyWhenModuleIsEnabled
```

Allows to update the number of required confirmations by guardians.


Parameters:

| Name       | Type    | Description    |
| :--------- | :------ | :------------- |
| _threshold | uint256 | New threshold. |

### isGuardian (0xd4ee9734)

```solidity
function isGuardian(
    address _wallet,
    address _guardian
) public view returns (bool)
```

Checks if an account is a guardian for a wallet.


Parameters:

| Name      | Type    | Description         |
| :-------- | :------ | :------------------ |
| _wallet   | address | The target wallet.  |
| _guardian | address | The account.        |


Return values:

| Name | Type | Description                                     |
| :--- | :--- | :---------------------------------------------- |
| [0]  | bool | true if the account is a guardian for a wallet. |

### guardiansCount (0xc026e7ee)

```solidity
function guardiansCount(address _wallet) public view returns (uint256)
```

Returns the number of guardians for a wallet.


Parameters:

| Name    | Type    | Description         |
| :------ | :------ | :------------------ |
| _wallet | address | The target wallet.  |


Return values:

| Name | Type    | Description              |
| :--- | :------ | :----------------------- |
| [0]  | uint256 | the number of guardians. |

### threshold (0xc86ec2bf)

```solidity
function threshold(address _wallet) public view returns (uint256)
```

Retrieves the wallet threshold count.


Parameters:

| Name    | Type    | Description         |
| :------ | :------ | :------------------ |
| _wallet | address | The target wallet.  |


Return values:

| Name | Type    | Description              |
| :--- | :------ | :----------------------- |
| [0]  | uint256 | uint256 Threshold count. |

### getGuardians (0xf18858ab)

```solidity
function getGuardians(address _wallet) public view returns (address[] memory)
```

Gets the list of guaridans for a wallet.


Parameters:

| Name    | Type    | Description         |
| :------ | :------ | :------------------ |
| _wallet | address | The target wallet.  |


Return values:

| Name | Type      | Description                  |
| :--- | :-------- | :--------------------------- |
| [0]  | address[] | address[] list of guardians. |
