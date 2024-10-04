# IGuardianStorage

## Overview

#### License: GPL-3.0

```solidity
interface IGuardianStorage
```


## Functions info

### addGuardianWithThreshold (0xbe0e54d7)

```solidity
function addGuardianWithThreshold(
    address _guardian,
    uint256 _threshold
) external
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
) external
```

Lets an authorised module revoke a guardian from a wallet and change the threshold.


Parameters:

| Name          | Type    | Description                                                             |
| :------------ | :------ | :---------------------------------------------------------------------- |
| _prevGuardian | address | Guardian that pointed to the guardian to be removed in the linked list  |
| _guardian     | address | The guardian to revoke.                                                 |

### changeThreshold (0x694e80c3)

```solidity
function changeThreshold(uint256 _threshold) external
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
) external view returns (bool)
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
function guardiansCount(address _wallet) external view returns (uint256)
```

Retrieves the wallet guardians count.


Parameters:

| Name    | Type    | Description         |
| :------ | :------ | :------------------ |
| _wallet | address | The target wallet.  |


Return values:

| Name | Type    | Description              |
| :--- | :------ | :----------------------- |
| [0]  | uint256 | uint256 Guardians count. |

### threshold (0xc86ec2bf)

```solidity
function threshold(address _wallet) external view returns (uint256)
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
function getGuardians(address _wallet) external view returns (address[] memory)
```

Retrieves all guardians for a wallet.


Parameters:

| Name    | Type    | Description         |
| :------ | :------ | :------------------ |
| _wallet | address | The target wallet.  |


Return values:

| Name | Type      | Description                   |
| :--- | :-------- | :---------------------------- |
| [0]  | address[] | address[] Array of guardians. |
