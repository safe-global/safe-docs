# SafeProxy

## Overview

#### License: LGPL-3.0-only

```solidity
contract SafeProxy
```

Author: Stefan George - <stefan@gnosis.io>

## Functions info

### constructor

```solidity
constructor(address _singleton)
```

Constructor function sets address of singleton contract.


Parameters:

| Name       | Type    | Description        |
| :--------- | :------ | :----------------- |
| _singleton | address | Singleton address. |

### fallback

```solidity
fallback() external payable
```

Fallback function forwards all transactions and returns all received return data.