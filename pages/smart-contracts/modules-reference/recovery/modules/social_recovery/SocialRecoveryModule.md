# SocialRecoveryModule

## Overview

#### License: GPL-3.0

```solidity
contract SocialRecoveryModule is GuardianStorage
```

Author: CANDIDE Labs
## Structs info

### SignatureData

```solidity
struct SignatureData {
	address signer;
	bytes signature;
}
```


### RecoveryRequest

```solidity
struct RecoveryRequest {
	uint256 guardiansApprovalCount;
	uint256 newThreshold;
	uint64 executeAfter;
	address[] newOwners;
}
```


## Events info

### RecoveryExecuted

```solidity
event RecoveryExecuted(address indexed wallet, address[] indexed newOwners, uint256 newThreshold, uint256 nonce, uint64 executeAfter, uint256 guardiansApprovalCount)
```


### RecoveryFinalized

```solidity
event RecoveryFinalized(address indexed wallet, address[] indexed newOwners, uint256 newThreshold, uint256 nonce)
```


### RecoveryCanceled

```solidity
event RecoveryCanceled(address indexed wallet, uint256 nonce)
```


### NonceInvalidated

```solidity
event NonceInvalidated(address indexed wallet, uint256 nonce)
```


## Constants info

### NAME (0xa3f4df7e)

```solidity
string constant NAME = "Social Recovery Module"
```


### VERSION (0xffa1ad74)

```solidity
string constant VERSION = "0.0.1"
```


## Modifiers info

### whenRecovery

```solidity
modifier whenRecovery(address _wallet)
```

Throws if there is no ongoing recovery request.
## Functions info

### constructor

```solidity
constructor(uint256 _recoveryPeriod)
```


### getChainId (0x3408e470)

```solidity
function getChainId() public view returns (uint256)
```

Returns the chain id used by this contract.
### domainSeparator (0xf698da25)

```solidity
function domainSeparator() public view returns (bytes32)
```


### encodeRecoveryData (0x1e01c4f0)

```solidity
function encodeRecoveryData(
    address _wallet,
    address[] calldata _newOwners,
    uint256 _newThreshold,
    uint256 _nonce
) public view returns (bytes memory)
```

Returns the bytes that are hashed to be signed by guardians.
### getRecoveryHash (0x5f19df08)

```solidity
function getRecoveryHash(
    address _wallet,
    address[] calldata _newOwners,
    uint256 _newThreshold,
    uint256 _nonce
) public view returns (bytes32)
```

Generates the recovery hash that should be signed by the guardian to authorize a recovery
### validateGuardianSignature (0xb00c57c5)

```solidity
function validateGuardianSignature(
    address _wallet,
    bytes32 _signHash,
    address _signer,
    bytes memory _signature
) public view
```

checks if valid signature to the provided signer, and if this signer is indeed a guardian, revert otherwise
### confirmRecovery (0x064e2d0e)

```solidity
function confirmRecovery(
    address _wallet,
    address[] calldata _newOwners,
    uint256 _newThreshold,
    bool _execute
) external
```

Lets single guardian confirm the execution of the recovery request.
Can also trigger the start of the execution by passing true to '_execute' parameter.
Once triggered the recovery is pending for the recovery period before it can be finalised.


Parameters:

| Name          | Type      | Description                                  |
| :------------ | :-------- | :------------------------------------------- |
| _wallet       | address   | The target wallet.                           |
| _newOwners    | address[] | The new owners' addressess.                  |
| _newThreshold | uint256   | The new threshold for the safe.              |
| _execute      | bool      | Whether to auto-start execution of recovery. |

### multiConfirmRecovery (0x0728e1e7)

```solidity
function multiConfirmRecovery(
    address _wallet,
    address[] calldata _newOwners,
    uint256 _newThreshold,
    SocialRecoveryModule.SignatureData[] memory _signatures,
    bool _execute
) external
```

Lets multiple guardians confirm the execution of the recovery request.
Can also trigger the start of the execution by passing true to '_execute' parameter.
Once triggered the recovery is pending for the recovery period before it can be finalised.


Parameters:

| Name          | Type                                        | Description                                  |
| :------------ | :------------------------------------------ | :------------------------------------------- |
| _wallet       | address                                     | The target wallet.                           |
| _newOwners    | address[]                                   | The new owners' addressess.                  |
| _newThreshold | uint256                                     | The new threshold for the safe.              |
| _signatures   | struct SocialRecoveryModule.SignatureData[] | The guardians signatures.                    |
| _execute      | bool                                        | Whether to auto-start execution of recovery. |

### executeRecovery (0xb1f85f69)

```solidity
function executeRecovery(
    address _wallet,
    address[] calldata _newOwners,
    uint256 _newThreshold
) external
```

Lets the guardians start the execution of the recovery request.
Once triggered the recovery is pending for the recovery period before it can be finalised.


Parameters:

| Name          | Type      | Description                     |
| :------------ | :-------- | :------------------------------ |
| _wallet       | address   | The target wallet.              |
| _newOwners    | address[] | The new owners' addressess.     |
| _newThreshold | uint256   | The new threshold for the safe. |

### finalizeRecovery (0x315a7af3)

```solidity
function finalizeRecovery(address _wallet) external whenRecovery(_wallet)
```

Finalizes an ongoing recovery request if the recovery period is over.
The method is public and callable by anyone to enable orchestration.


Parameters:

| Name    | Type    | Description        |
| :------ | :------ | :----------------- |
| _wallet | address | The target wallet. |

### cancelRecovery (0x0ba234d6)

```solidity
function cancelRecovery() external whenRecovery(msg.sender)
```

Lets the owner cancel an ongoing recovery request.
### invalidateNonce (0x5a57b46f)

```solidity
function invalidateNonce() external
```

Invalidates the wallet's nonce. This will invalidate existing
recovery confirmations from guardians and can be used either to cancel
the process of collecting confirmations from guardians or when rotating
the guardian configuration to prevent "shadow" confirmations.

This function should only be used between initiation and execution of a recovery.
### getRecoveryRequest (0x4f9a28b9)

```solidity
function getRecoveryRequest(
    address _wallet
) public view returns (SocialRecoveryModule.RecoveryRequest memory request)
```

Retrieves the wallet's current ongoing recovery request.


Parameters:

| Name    | Type    | Description         |
| :------ | :------ | :------------------ |
| _wallet | address | The target wallet.  |


Return values:

| Name    | Type                                        | Description                           |
| :------ | :------------------------------------------ | :------------------------------------ |
| request | struct SocialRecoveryModule.RecoveryRequest | The wallet's current recovery request |

### getRecoveryApprovals (0x6c6595ca)

```solidity
function getRecoveryApprovals(
    address _wallet,
    address[] calldata _newOwners,
    uint256 _newThreshold
) public view returns (uint256 approvalCount)
```

Retrieves the guardian approval count for this particular recovery request at current nonce.


Parameters:

| Name          | Type      | Description                      |
| :------------ | :-------- | :------------------------------- |
| _wallet       | address   | The target wallet.               |
| _newOwners    | address[] | The new owners' addressess.      |
| _newThreshold | uint256   | The new threshold for the safe.  |


Return values:

| Name          | Type    | Description                           |
| :------------ | :------ | :------------------------------------ |
| approvalCount | uint256 | The wallet's current recovery request |

### hasGuardianApproved (0x37d82c36)

```solidity
function hasGuardianApproved(
    address _wallet,
    address _guardian,
    address[] calldata _newOwners,
    uint256 _newThreshold
) public view returns (bool)
```

Retrieves specific guardian approval status a particular recovery request at current nonce.


Parameters:

| Name          | Type      | Description                      |
| :------------ | :-------- | :------------------------------- |
| _wallet       | address   | The target wallet.               |
| _guardian     | address   | The guardian.                    |
| _newOwners    | address[] | The new owners' addressess.      |
| _newThreshold | uint256   | The new threshold for the safe.  |


Return values:

| Name | Type | Description                                         |
| :--- | :--- | :-------------------------------------------------- |
| [0]  | bool | approvalCount The wallet's current recovery request |

### nonce (0x70ae92d2)

```solidity
function nonce(address _wallet) public view returns (uint256 _nonce)
```

Get the module nonce for a wallet.


Parameters:

| Name    | Type    | Description         |
| :------ | :------ | :------------------ |
| _wallet | address | The target wallet.  |


Return values:

| Name   | Type    | Description                |
| :----- | :------ | :------------------------- |
| _nonce | uint256 | the nonce for this wallet. |
