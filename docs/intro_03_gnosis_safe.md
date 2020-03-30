---
id: intro_gnosis_safe
title: The Gnosis Safe
sidebar_label: The Gnosis Safe
---

The Gnosis Safe is a smart contracts wallet with the multi-signature functionality at its core. But this is not the only advantage the Gnosis Safe provides.

### High Security

With the **multi-signature** functionality in the Gnosis Safe, one can predefine a list of owner accounts, which can be represented by either EOAs or other smart contract accounts, and a threshold number of accounts required to confirm a transaction. Once the threshold of predefined accounts have confirmed a transaction, the Safe transaction can be executed. 

### Ether less accounts

Another core functionality of the Gnosis Safe is **token payment**. Generally, Ethereum transactions require ETH for paying transaction fees (“gas”). With the Gnosis Safe, users can pay transaction fees in a number of supported ERC20 tokens. This is realized via a transaction relay service that accepts those tokens and submits the transactions to the blockchain, therefore paying the gas fee in ETH. 

### Advanced execution logic

It is possible to make use of different **Gnosis Safe Library contracts** to perform complex transactions. A very common example of this are **batched transactions** where multiple simple Ethereum transactions are combined and executed at once.

### Advanced access management

By allowing to add **Gnosis Safe Modules** to a Gnosis Safe it is possible to defined fine-grained access management. It is for example possible to define a module that can only be use to **recover access** to a Gnosis Safe under specific circumstances. A very popular version of this is the **Social Recovery Module**

### Token callback support

Many new tokens require wallet contracts to implement callbacks. Token standards like **ERC721** and **ERC1155** allow contracts to immediately react to receiving tokens through these and make it even possible to reject the transfer completely.