---
id: pmtutorial6
title: Enabling trading
sidebar_label: Enabling trading
---

Once our condition is ready, any participant can start trading on the market.

In the `MarketMakerRepo.ts` file it is defined the function that calls the contract to make trade:
```
trade = async (tradeAmounts: number[], collateralLimit: number, from: string) => {
  return this.lmsrMarketMaker.trade(tradeAmounts, collateralLimit, { from })
}
```

The function [trade](https://github.com/gnosis/conditional-tokens-market-makers/blob/master/contracts/MarketMaker.sol#L160) is defined in the MarketMaker contract and it has two parameters:

```
function trade(int[] memory outcomeTokenAmounts, int collateralLimit) public atStage(Stage.Running) onlyWhitelisted returns (int netCost)
```
- `outcomeTokenAmounts`: Amounts of each atomic outcome token to buy or sell. If positive, will buy this amount of outcome token from the market. If negative, will sell this amount back to the market instead.
- `collateralLimit`: If positive, this is the limit for the amount of collateral tokens which will be sent to the market to conduct the trade. If negative, this is the minimum amount of collateral tokens which will be received from the market for the trade. If zero, there is no limit.

If the function succeeds, the following [event](https://github.com/gnosis/conditional-tokens-market-makers/blob/master/contracts/MarketMaker.sol#L29) will be emitted:
```
event AMMOutcomeTokenTrade(
  address indexed transactor,
  int[] outcomeTokenAmounts,
  int outcomeTokenNetCost,
  uint marketFees
);
```

## Buying outcome tokens

In the `Market.ts` file it is defined the function to buy outcome tokens:
```
const buy = async () => {
  const collateral = await marketMakersRepo.getCollateralToken()
  const formatedAmount = new BigNumber(selectedAmount).multipliedBy(
    new BigNumber(Math.pow(10, collateral.decimals)),
  )

  const outcomeTokenAmounts = Array.from(
    { length: marketInfo.outcomes.length },
    (value: any, index: number) =>
      index === selectedOutcomeToken ? formatedAmount : new BigNumber(0),
  )

  const cost = await marketMakersRepo.calcNetCost(outcomeTokenAmounts)

  const collateralBalance = await collateral.contract.balanceOf(account)
  if (cost.gt(collateralBalance)) {
    await collateral.contract.deposit({ value: formatedAmount.toString(), from: account })
    await collateral.contract.approve(marketInfo.lmsrAddress, formatedAmount.toString(), {
      from: account,
    })
  }

  const tx = await marketMakersRepo.trade(outcomeTokenAmounts, cost, account)
}
```

## Selling outcome tokens

In the `Market.ts` file it is defined the function to sell outcome tokens:
```
const sell = async () => {
  const collateral = await marketMakersRepo.getCollateralToken()
  const formatedAmount = new BigNumber(selectedAmount).multipliedBy(
    new BigNumber(Math.pow(10, collateral.decimals)),
  )

  const isApproved = await conditionalTokensRepo.isApprovedForAll(account, marketInfo.lmsrAddress)
  if (!isApproved) {
    await conditionalTokensRepo.setApprovalForAll(marketInfo.lmsrAddress, true, account)
  }

  const outcomeTokenAmounts = Array.from({ length: marketInfo.outcomes.length }, (v, i) =>
    i === selectedOutcomeToken ? formatedAmount.negated() : new BigNumber(0),
  )
  const profit = (await marketMakersRepo.calcNetCost(outcomeTokenAmounts)).neg()

  const tx = await marketMakersRepo.trade(outcomeTokenAmounts, profit, account)
}
```
