---
id: devguide07
title: Redeeming Positions
sidebar_label: Redeeming Positions
---

Before this is possible, the payout vector must be set by the oracle:

<span style="color:#009cb4">*function* **reportPayouts** *(bytes32 questionId, uint[] calldata payouts)external*</span>

Called by the oracle for reporting results of conditions. Will set the payout vector for the condition with the ID keccak256(abi.encodePacked(oracle, questionId, outcomeSlotCount)), where oracle is the message sender, questionId is one of the parameters of this function, and outcomeSlotCount is the length of the payouts parameter, which contains the payoutNumerators for each outcome slot of the condition.

**Parameters:**	

- **questionId** – The question ID the oracle is answering for
- **payouts** – The oracle’s answer

This will emit the following event:

<span style="color:#009cb4">*event* **ConditionResolution** *(bytes32 indexed conditionId, address indexed oracle, bytes32 indexed questionId, uint outcomeSlotCount, uint[] payoutNumerators)*</span>

Then positions containing this condition can be redeemed via:

<span style="color:#009cb4">*event* **redeemPositions** *(IERC20 collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint[] calldata indexSets)external*</span>


This will trigger the following event:

<span style="color:#009cb4">*event* **PayoutRedemption** *(address indexed redeemer, IERC20 indexed collateralToken, bytes32 indexed parentCollectionId, bytes32 conditionId, uint[] indexSets, uint payout)*</span>

Also look at this chart:

IMAGE


