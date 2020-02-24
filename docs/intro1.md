---
id: introduction1
title: A short primer on Conditional Tokens
sidebar_label: A short primer on Conditional Tokens
---
<span style="color:#009cb4"><font size="4"><em> **Gnosis anticipates a tokenized future in which no single currency is dominant, and tradable asset classes take on increasing informational complexity. Conditional tokens that enable prediction markets are one of these new asset classes.**</em></font></span>

To better understand the reasoning behind the development of the conditional token framework, it’s helpful to understand the basic concept of a prediction market. Prediction markets—also referred to as information markets, idea futures, event derivatives, decision markets, or virtual stock markets—are exchange-traded markets where individuals stake on the outcome of an event. In blockchain-based prediction markets, participants stake on the market in the form of event contracts. These contracts specify the different possible outcomes of a future event, a payment structure based on those outcomes, and the event’s outcome date.  Unlike financial markets such as stock or commodities futures, which traders use to hedge against risk (i.e., farmers use futures markets to hedge against low crop prices, airlines use futures markets to hedge against high fuel prices), prediction markets primarily seek to aggregate information on particular topics of interest. The principal informational value of a prediction market lies in the price of the futures themselves, which not only represent the average assessment of market participants concerning the likelihood of an event’s outcome, but also the confidence level different participants have in their predictions.

IMAGE

Prediction markets have far-reaching potential as a prognostic tool. From weather forecasting to abating the destruction of the Great Barrier Reef, learn more about the vast range of use cases for PMs by delving into our blog posts on the topic.

Simple prediction markets, including our first contracts and also other known decentralized prediction market platforms such as Augur, lack sufficient infrastructure to support deeper combinatorial markets. These more complex markets provide an invaluable means by which to achieve higher resolution information discovery in respect to conditional and interdependent probabilities of future events and their perceived value.
In the following section, we will analyze the setup of known prediction markets and their shortcomings, before outlining how combinatorial markets with conditional tokens can solve current deficits. 

## Existing Approach to Combinatorial Markets

First, consider a series of conditions that can be fulfilled independently despite being related, and what the outcomes of these conditions might be. For example, let’s suppose there are two markets asking the following questions:

1. Will Elon Musk step down as CEO of Tesla on or before December 31, 2020?
<p>
a) Yes
<br>
b) No
</p>

2. Will the share price of Tesla stock be LESS THAN $300 at market close, December 31, 2020?
<p>
a) Yes
<br>
b) No
</p>

While the above markets can stand alone, they’re also explicitly correlated. In this case, there are two ways to create conditional tokens backed by a collateral token denoted as $, where the value of these conditional tokens depends on both outcomes of their respective assigned questions. In one setup, we could start by asking how the Tesla stock will evolve under the condition that Elon musk is stepping down.

IMAGE


The market can also be presented in the reverse order, “Will Elon Musk step down under the condition that the Tesla Stock is below $300?”

IMAGE

Although the outcome tokens in the second layer should represent value in collateral under the same conditions, irrespective of the order in which the conditions are specified, they are, in reality, separate entities. Users may hold separate balances of each, despite the balance being theoretically redeemable under the same conditions.

IMAGE

## Combinatorial Markets with Conditional Tokens

The conditional tokens framework, on the other hand, circumvents this problem. Conditional tokens preserve the fungibility in deeper layers, as all conditions are held in a single contract and are not tied to a specific collateral token. Referring to the above example, the situation using conditional tokens looks more like this:

IMAGE

Note the deeper outcome tokens on the far right of the diagram above, which were different in previous market set ups, are now the same. Users will hold conditional tokens in “positions.” Positions can be simple (with only one condition) or complex (relating to multiple conditions). For instance, instead of holding A and N—where A and N are outcomes of two events—you can now hold position AN, representing event N given event A has already occurred. 

With the new contract, one can maximize fungibility in deeper combinatorial markets, ergo achieving more in-depth information concerning the conditional probability of an event and its anticipated value. In this way, conditional tokens offer more possibilities when compared to older prediction market frameworks. 

A recap looking deeper into the benefits of conditional tokens can be found here: 


<figure class="video_container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/brFdf7pIYag" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 
</figure>



To summarize, conditional tokens allow you to: 

1. Make simple markets on the likelihood of a given event.
2. Make complex markets about how the likelihood of an event is affected by any other event. (For example: What is the probability of a global recession, if a trade war breaks out between the United States and China in the next year?)
3. Trade any asset under the condition that a specific event happens. For market observers, these markets will surface asset prices in different possible futures. (For example: you could have bought a tokenized equivalent of the British Pound contingent on the condition that no hard Brexit happens.) 

Previously such instruments could only be created at a high cost by financial institutions. The arrival of conditional tokens on Ethereum brings down the costs to a few cents and give access to everyone. All conditional tokens can be globally accessible, and payouts are securely (and cheaply) executed through smart contracts.

