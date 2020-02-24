---
id: introduction2
title: Conditional Token use cases
sidebar_label: Conditional Tokens use cases
---

## Prediction Markets


As mentioned before, the main application for conditional tokens is prediction markets. Let’s dive a bit deeper into the mechanisms behind it. 

Consider a simple future event. Suppose Yang and Trump are engaged in a political election. 
How do we construct a market with economic incentives for correctly predicting the outcome?


First, we lock some collateral (e.g. DAI) into a contract as collateral  to mint conditional tokens. To then create the market question <em>Who will win the election?</em>, we must define a collection of outcomes for the condition. In this case, there are two possible outcomes: 

<p>
a) Yang is elected 
<br>
b) Trump is elected.
</p>

For each DAI committed to the market, market participants receive conditional tokens representing all potential outcomes. The market contract holds the DAI tokens received as collateral until the outcome of the election is known.

Each participant begins in a neutral position, with both a with a set of all outcome token for each DAI locked as collateral. That is, fungible “Yang is elected” and “Trump is elected” tokens are issued to each participant who puts collateral into the contract. All “Yang is elected” tokens are fungible with other “Yang is elected” tokens. The “Trump is elected” tokens are materially different from “Yang is elected” tokens. They are fungible with other “Trump is elected” tokens. After the outcome is known, the contract will redeem each “correct” conditional token for the DAI held as collateral. The “incorrect” tokens are irredeemable.

### Key Takeaway

This brings us to the central point of this section: trading conditional tokens is the same as predicting which outcome is more likely. Suppose a participant believes Yang will be elected. They may sell their “Trump is elected” tokens at whatever price the market will bear, and later redeem their “Yang is elected” tokens at “par” value when (and if) Yang is elected. Trading conditional tokens helps discover the price of different opinions in a neutral way, as highly probable outcomes trade close to their redeemable par value, and highly improbable outcomes naturally find their market price near zero.

Readers will notice that, implicitly, there are two ways to enter a prediction market. One way is to buy a conditional token from another participant. Another way is to collateralize the issuance of new tokens (all outcomes) and divest of the unwanted outcomes. That is, sell the outcomes one thinks are overpriced.

The supply and demand—buyers and sellers —of “Yang is elected” and “Trump is elected” tokens establishes, through price discovery, the market’s estimation of the relative probability of the possible outcomes.


## Other possible use cases

Conditional tokens are built on the ERC-1155 token standard, which  affords numerous advantages for their multiple use cases. For instance, ERC-1155 batch sends substantially decrease gas costs for users, making them ideal within gaming environments that encompass different tokens and high-velocity economies. Section XXX highlights a few more of these use cases. 

The USE CASE section explores how the conditional token standard can be used to improve existing decentralized applications (dapps). In the tutorials section, you’ll find the tools and know-how needed to set up, inspect, and apply the conditional tokens framework to your own projects—as well as some inspiration regarding other use cases for this new standard beyond prediction markets.
 
