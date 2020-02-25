---
id: introduction5
title: Gnosis Safe Proxy Kit
sidebar_label: Gnosis Safe Proxy Kit
---

Contract accounts on Ethereum in many respects offer more powerful functionality than than do ordinary EOAs (externally owned accounts:

* Contract accounts can make multiple calls to different contracts in a single transaction;
* Token standards like ERC721 and ERC1155 allow contracts to immediately react to receiving tokens through a callback;
* Services can interact on behalf of a contract in specific capacities.

The Contract Proxy Kit (CPK) seeks to bring the power of contract interactions to users by assigning users a predetermined proxy account that can act as a proxy on a user’s behalf. The proxy itself is a single-owner Gnosis Safe instance, which enables batch interactions, fallback handler registration, and custom module installation.

Currently, only batch transactions are directly supported by the CPK. This capability simplifies user flows for dapps that require multiple, sequential interactions with different contracts to be done in what should be a single transaction. For a prominent example, consider most dapps using the ERC20 standard. Often, dapps have to ask the user to approve an amount of ERC20 to be used before asking a dapp contract to pull the amount from the user’s account. This is a common pair of transactions which should be a single action, but would by default trigger two transactions when batch transactions are not available. Some more complex examples may involve coordinating interactions with multiple contract systems.


