---
id: devguide02
title: Preparing a Condition
sidebar_label: Preparing a Condition
---

Before conditional tokens can exist, a *condition* must be prepared. A
condition is a question to be answered in the future by a specific
oracle in a particular manner. The following function may be used to
prepare a condition:


<span style="color:#009cb4">*function* **prepareCondition** *(address oracle, bytes32 questionId, uint outcomeSlotCount)external*</span>

This function prepares a condition by initializing a payout vector associated with the condition.

Parameters:	

* **oracle** – The account assigned to report the result for the prepared condition.
* **questionId** – An identifier for the question to be answered by the oracle.
* **outcomeSlotCount** – The number of outcome slots which should be used for this condition. Must not exceed 256.

> **NOTE**: It is up to the consumer of the contract to interpret the
question ID correctly. For example, a client may interpret the question
ID as an IPFS hash which can be used to retrieve a document specifying
the question more fully. The meaning of the question ID is left up to
clients.

If the function succeeds, the following event will be emitted,signifying the preparation of a condition:

<span style="color:#009cb4">*event* **ConditionPreparation** *(bytes32 indexed conditionId, address indexed oracle, bytes32 indexed questionId, uint outcomeSlotCount)* </span>

Emitted upon the successful preparation of a condition.

Parameters:
* **conditionId** – The condition’s ID. This ID may be derived from the other three parameters via <span style="color:#DB3A3D">`keccak256(abi.encodePacked(oracle, questionId, outcomeSlotCount))` </span>.
* **oracle** – The account assigned to report the result for the prepared condition.
* **questionId** – An identifier for the question to be answered by the oracle.
* **outcomeSlotCount** – The number of outcome slots which should be used for this condition. Must not exceed 256.


> **NOTE**: The condition ID is different from the question ID, and their
distinction is important.

The successful preparation of a condition also initializes the following
state variable:


<span style="color:#009cb4">*mapping (bytes32 => uint[]) public* **payoutNumerators** </span>

Mapping key is an condition ID. Value represents numerators of the payout vector associated with the condition. This array is initialized with a length equal to the outcome slot count. E.g. Condition with 3 outcomes [A, B, C] and two of those correct [0.5, 0.5, 0]. In Ethereum there are no decimal values, so here, 0.5 is represented by fractions like 1/2 == 0.5. That’s why we need numerator and denominator values. Payout numerators are also used as a check of initialization. If the numerators array is empty (has length zero), the condition was not created/prepared. See getOutcomeSlotCount.

To determine if, given a condition’s ID, a condition has been prepared,
or to find out a condition’s outcome slot count, use the following
accessor:

<span style="color:#009cb4">*function* **getOutcomeSlotCount** *(bytes32 conditionId)externalviewreturns(uint)*</span>
Gets the outcome slot count of a condition.

Parameters:	**conditionId** – ID of the condition.

Return: Number of outcome slots associated with a condition, or zero if condition has not been prepared yet.

The resultant payout vector of a condition contains a predetermined number of *outcome slots*. The entries of this vector are reported by the oracle, and their values sum up to one. This payout vector may be interpreted as the oracle’s answer to the question posed in the condition.


## A Categorical Example

Let's consider a question where only one out of multiple choices may be
chosen:

**Who out of the following will be chosen?**

- Alice
- Bob
- Carol

Through some commonly agreed upon mechanism, the detailed description
for this question becomes strongly associated with a 32 byte question
ID: <span style="color:#DB3A3D">`0xabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc1234` </span>  

Let's also suppose we trust the oracle with address 
<span style="color:#DB3A3D">`0x1337aBcdef1337abCdEf1337ABcDeF1337AbcDeF` </span>  
 to deliver the answer for
this question.

To prepare this condition, the following code gets run:

``` js
await conditionalTokens.prepareCondition(
    '0x1337aBcdef1337abCdEf1337ABcDeF1337AbcDeF',
    '0xabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc1234',
    3
)
```

The condition ID may be determined off-chain from the parameters via
`web3`:

``` js
web3.utils.soliditySha3({
    t: 'address',
    v: '0x1337aBcdef1337abCdEf1337ABcDeF1337AbcDeF'
}, {
    t: 'bytes32',
    v: '0xabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc1234'
}, {
    t: 'uint',
    v: 3
})
```

A helper function for determining the condition ID also exists on both
the contract and the <span style="color:#001428">`CTHelpers` </span>   library:

<span style="color:#009cb4">*function* **getConditionId** *(address oracle, bytes32 questionId,uintoutcomeSlotCount)externalpurereturns(bytes32)*</span>

Constructs a condition ID from an oracle, a question ID, and the outcome slot count for the question.

Parameters:	
- **oracle** – The account assigned to report the result for the prepared condition.
- **questionId** – An identifier for the question to be answered by the oracle.
outcomeSlotCount – The number of outcome slots which should be used for this condition. Must not exceed 256.

This yields a condition ID of
<span style="color:#DB3A3D">`0x67eb23e8932765c1d7a094838c928476df8c50d1d3898f278ef1fb2a62afab63`</span> 
.

Later, if the oracle `0x1337aBcdef1337abCdEf1337ABcDeF1337AbcDeF` makes
a report that the payout vector for the condition is `[0, 1, 0]`, the
oracle essentially states that Bob was chosen, as the outcome slot
associated with Bob would receive all of the payout.


## A Scalar Example

Let us now consider a question where the answer may lie in a range:

**What will the score be? \[0, 1000\]**

Let's say the question ID for this question is
<span style="color:#DB3A3D">`0x777def777def777def777def777def777def777def777def777def777def7890`</span> ,
and that we trust the oracle
<span style="color:#DB3A3D">`0xCafEBAbECAFEbAbEcaFEbabECAfebAbEcAFEBaBe`</span>  to deliver the results for
this question.

To prepare this condition, the following code gets run:

``` js
await conditionalTokens.prepareCondition(
    '0xCafEBAbECAFEbAbEcaFEbabECAfebAbEcAFEBaBe',
    '0x777def777def777def777def777def777def777def777def777def777def7890',
    2
)
```

The condition ID for this condition can be calculated as
<span style="color:#DB3A3D">`0x3bdb7de3d0860745c0cac9c1dcc8e0d9cb7d33e6a899c2c298343ccedf1d66cf`</span> .

In this case, the condition was created with two slots: one which represents the low end of the range (0) and another which represents the high end (1000). The slots' reported payout values should indicate how close the answer was to these endpoints. For example, if the oracle
<span style="color:#DB3A3D">`0xCafEBAbECAFEbAbEcaFEbabECAfebAbEcAFEBaBe`</span>  makes a report that the payout vector is <span style="color:#DB3A3D">`[9/10, 1/10]`</span>, then the oracle essentially states that the score was 100, as the slot corresponding to the low end is worth nine times what the slot corresponding with the high end is worth, meaning the score should be nine times, closer to 0 than it is close to 1000. Likewise, if the payout vector is reported to be <span style="color:#DB3A3D">`[0, 1]`</span>, then the oracle is saying that the score was *at least* 1000.