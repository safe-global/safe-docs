---
id: pmtutorial7
title: Resolving the market
sidebar_label: Resolving the market
---

Before the market is resolved by the oracle, the operator should close it first to prevent participants from continuing trading when the right answer is already publicly available.

## Closing the market

Markets must be closed by the operator. In order to execute this call, make sure you are using the app connected to the operator account in your Metamask.

In the `MarketMakerRepo.ts` file it is defined the function that calls the contract to close the market:
```
  close = async (from: string) => {
    return this.lmsrMarketMaker.close({ from })
  }
```

The function [close](https://github.com/gnosis/conditional-tokens-market-makers/blob/master/contracts/MarketMaker.sol#L111) is defined in the MarketMaker contract.

If the function succeeds, the following [event](https://github.com/gnosis/conditional-tokens-market-makers/blob/master/contracts/MarketMaker.sol#L25) will be emitted, meaning that the market was closed.

```
event AMMClosed();
```

In the `Market.ts` file it is defined the function to close the market:
```
const close = async () => {
  const tx = await marketMakersRepo.close(account)
}
```

## Resolving the market

Markets must be resolved by the oracle. In order to execute this call, make sure you are using the app connected to the oracle account in your Metamask.

In the `ConditionalTokensRepo.ts` file it is defined the function that calls the contract to resolve the market:
```
reportPayouts = async (questionId: string, payouts: number[], from: string) => {
  return this.conditionalTokens.reportPayouts(questionId, payouts, { from })
}
```

The function [reportPayouts](https://github.com/gnosis/conditional-tokens-contracts/blob/master/contracts/ConditionalTokens.sol#L78) is defined in the ConditionalTokens contract and it has two parameters:
```
function reportPayouts(bytes32 questionId, uint[] calldata payouts) external
```
- `questionId`: The question id the oracle is answering for
- `payouts`: The oracle's answer

If the function succeeds, the following [event](https://github.com/gnosis/conditional-tokens-contracts/blob/master/contracts/ConditionalTokens.sol#L20) will be emitted, meaning that the condition was resolved.

```
event ConditionResolution(
    bytes32 indexed conditionId,
    address indexed oracle,
    bytes32 indexed questionId,
    uint outcomeSlotCount,
    uint[] payoutNumerators
);
```

In the `Market.ts` file it is defined the function to resolve the market:
```
const resolve = async (resolutionOutcomeIndex: number) => {
  const payouts = Array.from(
    { length: marketInfo.outcomes.length },
    (value: any, index: number) => (index === resolutionOutcomeIndex ? 1 : 0),
  )

  const tx = await conditionalTokensRepo.reportPayouts(marketInfo.questionId, payouts, account)
}
```
