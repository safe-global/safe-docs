---
id: pmtutorial4
title: Preparing a condition
sidebar_label: Preparing a condition
---

In the previous step we just learnt how to set up a local environment to run the Conditional Tokens Tutorial App. In this section we are going to focus on how to create a condition or question to be displayed in the app.

## Define a condition

Because the contract does not store information about the condition like the title or the outcome titles, we would need to have this information in an accessible place. To simplify this in this tutorial we are just going to use the configuration file `/markets.config.js` that can be found in the root folder of our project.
```
{
  questionId: "0x4b22fe478b95fdaa835ddddf631ab29f12900b62061e0c5fd8564ddb7b684333",
  title: "Will the summer 2020 in Germany break again weather records? ",
  outcomes: [
    {
      title: "Yes",
      short: "Yes"
    },
    {
      title: "No",
      short: "No"
    }
  ]
}
```

## Prepare the condition

While this action could be created dynamically using the interface and filling a form while the app is running, here we are going to define only one condition in the configuration file `/markets.config.js` and use the truffle migration number 6 (`/migrations/06_prepare_conditions.js`) to prepare it.
```
const deployConfig = require("./utils/deployConfig")(artifacts);
const ConditionalTokens = artifacts.require("ConditionalTokens");

module.exports = function(deployer) {
  deployer.then(async () => {
    const pmSystem = await ConditionalTokens.deployed();
    const markets = require("../markets.config");
    for (const { questionId } of markets) {
      await pmSystem.prepareCondition(deployConfig.oracle, questionId, 2);
    }
  });
};
```

The function `prepareCondition` is used to prepare the condition, which will be decided when the oracle submits what it is called the "payout vector".

The function [prepareCondition](https://github.com/gnosis/conditional-tokens-contracts/blob/master/contracts/ConditionalTokens.sol#L65) is defined in the ConditionalTokens contract and it has three parameters:
```
function prepareCondition(address oracle, bytes32 questionId, uint payoutDenominator, uint outcomeSlotCount) external
```
- `oracle`: The account assigned to report the result for the prepared condition. In this example we are using `0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0`.
- `questionId`: An identifier for the question to be answered by the oracle. It is up to the consumers of the contract to interpret the meaning of the question ID. For example, it could be an IPFS hash which can be used to retrieve a document specifying the question more fully.
- `outcomeSlotCount`: The number of outcome slots which should be used for this condition. Must not exceed 256. In our example we only have two possible answers: "Yes" and "No".

If the function succeeds, the following [event](https://github.com/gnosis/conditional-tokens-contracts/blob/master/contracts/ConditionalTokens.sol#L13) will be emitted, signifying the preparation of a condition:

```
event ConditionPreparation(
  bytes32 indexed conditionId,
  address indexed oracle,
  bytes32 indexed questionId,
  uint outcomeSlotCount
);
```
