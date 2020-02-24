---
id: pmtutorial5
title: Tying in the market maker
sidebar_label: Tying in the market maker
---

After deploying the `ConditionalTokens` contract and preparing the condition we need to create the market maker using the `MarketMakerFactory` contract. You can find this process in the truffle migration called `07_create_lmsr_mm.js`.

First of all we need to get the `condition id` of our condition, providing the `oracle address`, the `question id` and the `number of outcomes` of the question (in this case we have two possible outcomes: "Yes" and "No").
```
const conditionIds = markets.map(({ questionId }) =>
  web3.utils.soliditySha3(
    { t: "address", v: deployConfig.oracle },
    { t: "bytes32", v: questionId },
    { t: "uint", v: 2 }
  )
);
```

Secondly, the collateral token used in the market must be chosen. In this case we will be using WETH as the collateral. Later the market maker's factory needs to be approved to transfer ETH up to the funding value on behalf of the operator running the migration.
```
const WETH9 = artifacts.require("WETH9");
const collateralToken = await WETH9.deployed();

const lmsrMarketMakerFactory = await artifacts
  .require("LMSRMarketMakerFactory")
  .deployed();

const { ammFunding } = deployConfig;
await collateralToken.deposit({ value: ammFunding });
await collateralToken.approve(lmsrMarketMakerFactory.address, ammFunding);
```

The next step is to create the market maker calling the function [createLMSRMarketMaker](https://github.com/gnosis/conditional-tokens-market-makers/blob/37f066a6f78a13845484c9d9a9f5c66b5dad6d95/contracts/LMSRMarketMakerFactory.sol#L116)
from the `LMSRMarketMakerFactory` contract and check that the creation was successful looking for the emitted [event](https://github.com/gnosis/conditional-tokens-market-makers/blob/37f066a6f78a13845484c9d9a9f5c66b5dad6d95/contracts/LMSRMarketMakerFactory.sol#L43).
```
function createLMSRMarketMaker(ConditionalTokens pmSystem, IERC20 collateralToken, bytes32[] calldata conditionIds, uint64 fee, Whitelist whitelist, uint funding) external returns (LMSRMarketMaker lmsrMarketMaker)
```
Event emitted if success:
```
event LMSRMarketMakerCreation(
  address indexed creator,
  LMSRMarketMaker lmsrMarketMaker,
  ConditionalTokens pmSystem,
  IERC20 collateralToken,
  bytes32[] conditionIds,
  uint64 fee, uint funding
);
```

Rest of `/migrations/07_create_lmsr_mm.js`:
```
const conditionalTokens = await artifacts
  .require("ConditionalTokens")
  .deployed();

const lmsrFactoryTx = await lmsrMarketMakerFactory.createLMSRMarketMaker(
  conditionalTokens.address,
  collateralToken.address,
  conditionIds,
  0,
  '0x0000000000000000000000000000000000000000',
  ammFunding
);

const creationLogEntry = lmsrFactoryTx.logs.find(
  ({ event }) => event === "LMSRMarketMakerCreation"
);

if (!creationLogEntry) {
  // eslint-disable-next-line
  console.error(JSON.stringify(lmsrFactoryTx, null, 2));
  throw new Error(
    "No LMSRMarketMakerCreation Event fired. Please check the TX above.\nPossible causes for failure:\n- ABIs outdated. Delete the build/ folder\n- Transaction failure\n- Unfunded LMSR"
  );
}
```

Lastly, we are saving this data in the file `config.local.json` to make it available later when the app is running.
```
const lmsrAddress = creationLogEntry.args.lmsrMarketMaker;
writeToConfig({
  network: process.env.REACT_APP_NETWORK || "local",
  networkId: await web3.eth.net.getId(),
  lmsrAddress,
  markets
});
```
