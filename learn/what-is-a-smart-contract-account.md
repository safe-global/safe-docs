---
description: >-
  Everything you need to know about Smart Contracts Accounts and how to building
  with them.
---

# What is a Smart Contract Account?

A Smart Contract Account is a fully customizable account. If you think of your regular bank account or crypto account, it uses keys to sign transactions. This means that anyone with the key (password, private key) can sign transactions and approve sending money out of your account.&#x20;

If someone got access to your username and password, they can take all your money. If you forgot your password, then you have to go through a lengthy password reset process with a regular bank account and if it’s a crypto account, your money is gone forever.

A Smart Account is fully customizable, so you can create any type of rule you want. The most common type of rule you can create is a multiple-signer account (also known as a multi-sig). For example, instead of having just one password (or private key) control your account, you can have it done by multiple people. You can add 3 other people (or companies!) you trust to be signers of your account. Then if you want to send any transactions, at least 2 of them have to approve the transaction.

Another common rule is to set a spending limit. You can set a limit that allows you to withdraw amounts under $100, without needing approval from everyone else. However, for larger amounts, you could require 2 other people to sign and approve the transaction.

When you change the very idea of an account from something that is simply using a password or private key to approve transactions, to something that is fully customizable from the ground up, the possibilities are endless. This guide will show you some of the possibilities and give you the resources to make those possibilities a reality.

### Smart Accounts vs Signing Accounts

A Smart Account is also known as a Smart Contract Account. The account that uses a key to sign transactions is a signing account, also known as an Externally Owned Account (EOA).&#x20;

<figure><img src="../.gitbook/assets/Slide 16_9 - 5.png" alt=""><figcaption></figcaption></figure>

<figure><img src="../.gitbook/assets/Slide 16_9 - 3.png" alt=""><figcaption></figcaption></figure>

A common misconception is that all smart accounts are multi-sig accounts. This isn't true. A multi-sig account is a specific type of Smart Account that requires multiple signing accounts to approve transactions.  In fact, the [most common Smart account configuration is a 1/1](https://twitter.com/tomiwa1a/status/1619059531480444933). This means that only one signer is required for the account. Why would someone create a smart account that only has one signer? Martin Køppelman has a [great thread explaining](https://twitter.com/koeppelmann/status/1618998969992097793) this. In summary:

1. Swap keys if your private key is compromised
   1. This won't work if a hacker has your private keys since they can also swap the keys. However, if you leak your private keys, you can change the owner before other people find it, without having to move all your assets.
2. Pay for transactions using any ERC20 tokens or even cash. With a relayer paying for gas on your behalf
3. Add customizable rules such as spending limits

### Further Reading

1. [Guards docs](https://docs.gnosis-safe.io/contracts/guards)
2. [Safe Core SDK docs](https://docs.gnosis-safe.io/build/sdks/core-sdk)
3. [Safe Modules docs](https://docs.gnosis-safe.io/build/sdks/core-sdk)
