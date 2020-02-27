---
id: docs1
title: Basics
sidebar_label: Basics
---

This section provides an overview of some of the primitives required to understand smart contracts.
If you are a smart contract developer you probably want to skip this and straight head to [architecture](./architecture.html)

The following part is inspired by a [blogpost](https://medium.com/@austin_48503/ethereum-meta-transactions-90ccf0859e84) from [Austin Griffith](https://twitter.com/austingriffith)

## Hashes
Hash functions take in information of varying size and map it to a predictable (deterministic) result of an arbitrary size. It is a great way to take a big chunk of information and get a small, digestible “fingerprint” of that data. The resulting “fingerprint” for a given input is always the same. If any little thing in your original data changes, the resulting hash will change drastically. Hashes are used in a lot of different places in Ethereum.

## Key Pairs
Public/Private key pairs employ some advanced math but the concept is simple: A message can be signed with a private key and anyone can use the public key to prove it was signed correctly. To make it more precise, if someone gives you a message along with a signature and using only that persons public information you can mathematically prove that this person signed the specific message. A private key is very sensitive and should never be moved around a lot. A public key can be shared far and wide. Your Ethereum address is your public key and it acts as your identity. 

## Signing hashed data
By signing a hash of data you achieve three things:

- *non-corruptibility*: you know the data has not been tampered with
- *identity*: you know the transaction is definitely from the person who sent it
- *non-repudiation*: the person who sent it can not rescind the transaction later

## Externally owned accounts (EOAs)
EOAs are Ethereum accounts that use traditional key pairs, i.e. there is a single private key that can be used to make transactions and signed data. Getting access to that private key gives you full control of the account. Most popular wallets such as Metamask or imToken employ simple EOAs. Also hardware wallets such as Ledger Nano or Trezor are based on EOAs. EOAs are currently still the norm on Ethereum we are trying to change that with the Gnosis Safe.

## Smart contract accounts
On Ethereum, smart contracts are so called “first-class citizens”. That means they can be used almost the same way, EOAs can be used. Smart contract accounts have a unique public Ethereum address as well. Just from the address, it is impossible to tell if it is a smart contract or an EOA. Smart contracts can receive funds and make transactions in the same fashion like EOAs.
The only difference: There is generally no single private key that is used to make transactions. Instead, the logic on how transactions can be made is defined via the smart contract code. In case of the Gnosis Safe, there is a threshold number and a list of so-called owner accounts which can be either EOAs or other smart contract accounts. This concept is not unique to the Safe, but generally used in multi-signature wallets. Owners have to sign transactions to be made with the Safe. Once the threshold is reached, the Safe transaction will be executed.

## “Regular” transactions with EOAs
This section describes the process of making an Ethereum transactions with an EOA in order to later highlight the differences to meta transactions.

An Ethereum transaction has the following format:
(Snail mail analogy is taken from [this blog post](https://medium.com/@austin_48503/ethereum-meta-transactions-90ccf0859e84).)

- *To address*: An Ethereum address the transaction is going to. This could be an EOA or a smart contract. It could also be the sender themselves. Analogous to the address on the front of the envelope of a letter you are sending.
- *Value*: This is an amount in ether that can be set. It will be deducted from the sender’s account and sent to the *to address*. This is like putting a little cash in the envelope for the recipient.
- *Data*: This is literally some data that is sent with the transaction. It can be the function that should be called on the smart contract specified by the *to address*. This is like the contents of the letter you are sending. It is usually empty when you are just sending *value*.
- *Nonce*: This is a number that is incremented by one with every transaction made. A transaction with the same *nonce* can only be executed once. Also, a transaction can only be executed if all transactions with lower nonces have been executed successfully before. In order to protect against the same letter getting sent twice, we keep track of a count. This acts like an identity of the envelope itself.
- *Gas limit*: In order to incentive miners to execute a transaction, a transaction fee has to be paid. On Ethereum, transaction costs are expressed in gas. A certain amount of gas allows for a limited number of execution steps. The *gas limit* determines how many steps can be made. This is like a limit of how far your mailman should travel. Let’s say he ends up going to the other side of the earth to deliver your message that is meant to go around the block… you want to avoid that because you’re paying for his trip.
- *Gas price*: Ultimately, transaction fees have to be paid in ether. The *gas price* sets the exchange rate between gas and ether. The transaction fee (*gas price* * *gas limit*) is deducted from the sender’s account balance. This is like some loose change you put in your mailbox to incentivize the mailman to deliver the message. The more change you leave the higher the likelihood the busy mailman will grab your letter.
- *Signature*: Finally, all the data above is hashed and signed by the sender. The *signature* enables anyone to prove that you actually authorized this specific transactions. This is analogous to sealing your envelope with a *signature* that proves its exact contents are verified by you.

Summarizing the above: A sender sets all parameters of their transaction, signs it and then submits it to the blockchain. This is done via a wallet such as Metamask. Now miners have to pick up this transaction and execute it. It depends on the current network load, the *gas price* and the *gas limit* on how fast miners pick it up, i.e. how fast the transaction is executed in the end. A transaction is pending as long as it is waiting for execution. After execution it is either successful or failed. It can fail due to a number of reasons, the most common being an error in the called function or a too low *gas limit*.
