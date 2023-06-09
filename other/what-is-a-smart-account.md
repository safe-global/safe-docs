---
description: >-
  Everything you need to know about Smart Contracts Accounts and how to build
  with them.
---

# What is a Smart Account?

A Smart Account (aka Smart Contract Account) is a fully customizable account. If you think of your regular bank account or crypto account, it uses keys to sign transactions. This means that anyone with the key (password, private key) can sign transactions and approve sending money out of your account.

If someone gained access to your username and password, they would have access to all your money. If you forgot your password, then you have to go through a lengthy password reset process with a regular bank account. If it’s a crypto account, your money is gone forever.

A Smart Account is fully customizable, which means you can create any type of rule you want. The most common type of rule you can create is a multiple-signer account (also known as a multi-sig). For example, instead of having just one private key authorized to sign on behalf of your account, you can require multiple signers. For example, you can add 2 other people you trust to be signers of your account. Then if you want to send any transactions, at least 2 of them have to approve the transaction.

Another common rule is to set a spending limit. You can set a limit that allows you to withdraw amounts under $100, without needing approval from everyone else. However, for larger amounts, you could require 2 other people to sign and approve the transaction.

When you change the very idea of an account from something that is simply using a password or private key to approve transactions, to something that is fully customizable from the ground up, the possibilities are endless. This guide will show you some of the possibilities and give you the resources to make those possibilities a reality.

### Smart Accounts vs Signing Accounts

The account that uses a key to sign transactions is a signing account. It's also known as an Externally Owned Account (EOA).

<figure><img src="../.gitbook/assets/Slide 16_9 - 5 (1).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../.gitbook/assets/Slide 16_9 - 3.png" alt=""><figcaption></figcaption></figure>

A common misconception is that all Smart Accounts are multi-sig accounts. This isn't true. A multi-sig account is a specific type of Smart Account that requires multiple signing accounts to approve transactions. In fact, the [most common Smart Account configuration is a 1/1](https://twitter.com/tomiwa1a/status/1619059531480444933). This means that only one signer is required for the account. Why would someone create a smart account that only has one signer? Martin Köppelmann has a [great thread explaining this](https://twitter.com/koeppelmann/status/1618998969992097793). In summary:

1. Swap keys if your private key is compromised
   * This won't work if a hacker has your private keys since they can also swap the keys. However, if you leak your private keys, you can change the owner before other people find it, without having to move all your assets.
2. Pay for transactions using any ERC20 tokens or even cash. The relayer pays for gas on your behalf
3. Add customizable rules such as spending limits

### Further Reading

1. [Safe{Core} Account Abstraction SDK](safe-core/safe-core-account-abstraction-sdk/)
2. [Safe Modules](safe-core/safe-core-protocol/modules-1.md)
3. [Safe Guards](safe-core/safe-core-protocol/guards.md)
