---
id: pmtutorial8
title: Redeeming positions
sidebar_label: Redeeming positions
---

Before redeeming your positions in the market is possible, the oracle must report the correct answer to the contract.

In the `ConditionalTokensRepo.ts` file it is defined the function that calls the contract to redeem the positions of the trader:
```
redeemPositions = async (
  collateralAddress: string,
  parentCollectionId: string,
  marketConditionId: string,
  indexSets: number[],
  from: string,
) => {
  return this.conditionalTokens.redeemPositions(
    collateralAddress,
    parentCollectionId,
    marketConditionId,
    indexSets,
    { from },
  )
}
```

The function [redeemPositions](https://github.com/gnosis/conditional-tokens-contracts/blob/master/contracts/ConditionalTokens.sol#L218) is defined in the ConditionalTokens contract and it has two parameters:
```
function redeemPositions(IERC20 collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint[] calldata indexSets) external
```
- collateralToken: 
- parentCollectionId: 
- conditionId: 
- indexSets: 

If the function succeeds, the following [event](https://github.com/gnosis/conditional-tokens-contracts/blob/master/contracts/ConditionalTokens.sol#L46) will be emitted.
```
event PayoutRedemption(
  address indexed redeemer,
  IERC20 indexed collateralToken,
  bytes32 indexed parentCollectionId,
  bytes32 conditionId,
  uint[] indexSets,
  uint payout
);
```

In the `Market.ts` file it is defined the function to redeem the positions of the trader:
```
const redeem = async () => {
  const collateral = await marketMakersRepo.getCollateralToken()

  const indexSets = Array.from({ length: marketInfo.outcomes.length }, (v, i) =>
    i === 0 ? 1 : parseInt(Math.pow(10, i).toString(), 2),
  )

  const tx = await conditionalTokensRepo.redeemPositions(
    collateral.address,
    `0x${'0'.repeat(64)}`,
    marketInfo.conditionId,
    indexSets,
    account,
  )
}
```
