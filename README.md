---
description: >-
  Everything you need to know about Smart Accounts and how to start using and
  building things with smart accounts.
---

# 👋 Introduction

## What is a Smart Account?

A Smart Account is a fully customizable bank account. If you think of your regular bank account or crypto account, it uses keys to sign transactions.  This means that anyone with the key (password, private key) can sign transactions and approve sending money out of your account.&#x20;



This means that if someone got access to your username and password, they can take all your money. It also means that if you forgot your password, then you have to go through a lengthy password reset process with a regular bank account and if it’s a crypto account, your money is gone forever.

With a Smart Account, it’s fully customizable, so you can create any type of rule you want. The most common type of rule you can create is a multi-signer account (also known as a multisig). For example, instead of having just one password (or private key) control your account you can have it done by multiple people. You can add 3 other people (or companies!) that you trust to be signers of your account. Then if you want to send any transactions, at least 2 of them have to approve the transaction.\


Another common rule is to set a spending limit. You can set a limit that allows you to withdraw amounts under $100, without needing approval from everyone else. However, for larger amounts you could require 2 other people to sign and approve the transaction.\


When you change the very idea of an account from something that is simply using a password or private key to approve transactions, to something that is fully customizable from the ground up, the possibilities are endless. This guide will show you some of the possibilities and give you the resources to make those possibilities a reality.



#### Smart Accounts vs Signing Accounts

A Smart Account is also known as a Smart Contract Account. The account that uses a key to sign transactions is also known as an Externally Owned Account (EOA) or signing account.&#x20;

A common misconception is that all smart accounts are multisig accounts. This isn't true. A multisig account is a specific type of Smart Account that requires multiple signing accounts to approve transactions.  In fact, the [most common Smart account configuration is a 1/1](https://twitter.com/tomiwa1a/status/1619059531480444933). This means that only one signer is required for the account. Why would someone create a smart account that only has one signer? Martin Køppelman has a [great thread explaining](https://twitter.com/koeppelmann/status/1618998969992097793) this. In summary:

1. Swap keys if your private key is compromised
   1. This won't work if a hacker has your private keys since they can also swap the keys. However, if you leak your private keys, you can change the owner before other people find it, without having to move all your assets.
2. Pay for transactions using any ERC20 tokens or even cash. With a relayer paying for gas on your behalf
3. Add customizable rules such as spending limits

### How to Read this Guide



There are three main sections in this guide: Learn, Build, Discover.

1. [Learn](https://docs.gnosis-safe.io/learn) about how Smart Accounts work.
2. [Discover](https://docs.gnosis-safe.io/discover/) how others are building and using Smart Accounts
3. [Build](https://docs.gnosis-safe.io/build) cool things with Smart Accounts.



We recommend starting with Learn and seeing some tutorials there to learn more about how Smart Accounts work. Then, head to the Discover section to get some ideas and inspiration for the types of things you can build with smart accounts. Then, complete one of the Build tutorials to build something that uses Smart Accounts.



You can follow the [Ecosystem Diagram](https://viewer.diagrams.net/index.html?tags=%7B%7D\&target=blank\&highlight=0000ff\&edit=\_blank\&layers=1\&nav=1\&page-id=atRejJyS5DeNAtDboIeV\&title=Safe%20Diagrams.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1WcTgdHoQttJ0K\_fV8mDg-RmDZRYGe3D-%26export%3Ddownload) as an example.\


<figure><img src="https://lh4.googleusercontent.com/sZ7_ekBa__Ii5buK0sZ_X-_n_QFGlgh0XUyjqGS1tSdOI5vRuE0rD1meT1c2fpoNECcc1MBBYZ0e8TVjxREgoxHTFUUO5XGORUNidDe5Qb27iKDtabJNugPcFtLxWUHVSSVTXE9f3kcYe84Ase5hpPDu3B7rE9DNWjMlelNk0Rsr_RKfwZ_Sd8fcmH15kw" alt=""><figcaption><p><a href="https://viewer.diagrams.net/?tags=%7B%7D&#x26;target=blank&#x26;highlight=0000ff&#x26;edit=_blank&#x26;layers=1&#x26;nav=1&#x26;page-id=atRejJyS5DeNAtDboIeV&#x26;title=Safe%20Diagrams.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1WcTgdHoQttJ0K_fV8mDg-RmDZRYGe3D-%26export%3Ddownload">View Diagram</a></p></figcaption></figure>

### Get Started

The Ecosystem Diagram covers a lot of tools. If you want a simpler introduction to Safe, start with the following steps:

#### Everyone

1. Learn about What is a Smart Account
2. Create a Safe using the Web Interface
   1. Set a Spending Limit in your Safe
3. Use a Safe App
4. See how others are using Safe

#### Developers

1. Learn about Externally Owned Accounts vs Smart Contract Accounts
2. Create Safe from the command line using [safe-cli](https://github.com/5afe/safe-cli)
3. [Create Safe](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk#getting-started) using [core-sdk](https://github.com/safe-global/safe-core-sdk)
4. Get ideas of what to build from [Safe Hackathon Guide and List of Hackathon Winners](https://gnosis-safe.notion.site/Safe-Hackathon-Success-Guide-53d2fb3c29424b58b1c4407519a54930)

### Contact Us



1. [Tweet us on Twitter @safe](https://twitter.com/safe)
2. [Ask 'gnosis-safe' Questions on Ethereum Stack Exchange](https://ethereum.stackexchange.com/questions/tagged/gnosis-safe)
3. [Open an Issue on the Safe Github](https://github.com/safe-global)
4. [Chat with us on Discord](https://chat.safe.global/)

### Further Reading

1. [Guards docs](https://docs.gnosis-safe.io/contracts/guards)
2. [Safe Core SDK docs](https://docs.gnosis-safe.io/build/sdks/core-sdk)
3. [Safe Modules docs](https://docs.gnosis-safe.io/build/sdks/core-sdk)

