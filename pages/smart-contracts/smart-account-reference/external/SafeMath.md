# SafeMath

## Overview

#### License: LGPL-3.0-only

```solidity
library SafeMath
```

Math operations with safety checks that revert on error (overflow/underflow)
## Functions info

### mul

```solidity
function mul(uint256 a, uint256 b) internal pure returns (uint256)
```

Multiplies two numbers, reverts on overflow.


Parameters:

| Name | Type    | Description    |
| :--- | :------ | :------------- |
| a    | uint256 | First number   |
| b    | uint256 | Second number  |


Return values:

| Name | Type    | Description        |
| :--- | :------ | :----------------- |
| [0]  | uint256 | Product of a and b |

### sub

```solidity
function sub(uint256 a, uint256 b) internal pure returns (uint256)
```

Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).


Parameters:

| Name | Type    | Description    |
| :--- | :------ | :------------- |
| a    | uint256 | First number   |
| b    | uint256 | Second number  |


Return values:

| Name | Type    | Description           |
| :--- | :------ | :-------------------- |
| [0]  | uint256 | Difference of a and b |

### add

```solidity
function add(uint256 a, uint256 b) internal pure returns (uint256)
```

Adds two numbers, reverts on overflow.


Parameters:

| Name | Type    | Description    |
| :--- | :------ | :------------- |
| a    | uint256 | First number   |
| b    | uint256 | Second number  |


Return values:

| Name | Type    | Description    |
| :--- | :------ | :------------- |
| [0]  | uint256 | Sum of a and b |

### max

```solidity
function max(uint256 a, uint256 b) internal pure returns (uint256)
```

Returns the largest of two numbers.


Parameters:

| Name | Type    | Description    |
| :--- | :------ | :------------- |
| a    | uint256 | First number   |
| b    | uint256 | Second number  |


Return values:

| Name | Type    | Description        |
| :--- | :------ | :----------------- |
| [0]  | uint256 | Largest of a and b |
