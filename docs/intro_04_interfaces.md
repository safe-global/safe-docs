---
id: intro_interfaces
title: Gnosis Safe interfaces
sidebar_label: Gnosis Safe interfaces
---

The Gnosis Safe smart contracts can be accessed via different interfaces:

## Gnosis Safe Multisig web interface

You can setup a Safe at https://gnosis-safe.io in [60 seconds](https://twitter.com/econoar/status/1194731123340763136?s=20). You specify the number of owners and their owner account addresses. Compatible account addresses include hardware wallets, Metamask, Authereum, WalletConnect enabled wallets, and others. You can see the asset overview and can make transactions such as custom transactions for direct smart contract interaction. ENS names are supported. We are working on a better dapp integration via Safe Apps which third party developers can leverage. Please open an issue on [Github](https://github.com/gnosis/safe-react/issues/) for every feature request you have, and also for every bug you encounter. A testnet version is available at https://rinkeby.gnosis-safe.io/. A downloadable standalone desktop version is available [here](https://github.com/gnosis/safe-react/releases).

## Gnosis Safe Multisig Mobile

While the web interface remains the focal point, there are also Gnosis Safe Multisig Mobile apps.

#### App stores

- [iOS](https://apps.apple.com/app/id1515759131)
- [Android](https://play.google.com/store/apps/details?id=io.gnosis.safe)

#### Beta

- [Mainnet iOS](https://testflight.apple.com/join/c6k0CIUk)
- [Mainnet Android](https://appdistribution.firebase.dev/i/401cf2ea8afd6ed8)
- [Rinkeby iOS](https://testflight.apple.com/join/U8NviSFl)
- [Rinkeby Android](https://appdistribution.firebase.dev/i/8ecc0367c2001086)

*Note: We previously had different Gnosis Safe mobile apps available. We made the decision to deprecate them and focus on the Gnosis Safe Multisig entirely. [Learn more about the differences](https://help.gnosis-safe.io/en/articles/4100541-gnosis-safe-multisig-vs-legacy-safe-mobile-app) or [how to re-download the old mobile app](https://help.gnosis-safe.io/en/articles/4290400-how-to-re-download-the-legacy-gnosis-safe-mobile-app) if you previously had it installed.*

## Gnosis Safe command line interface (CLI)

You can use the [safe-cli](https://github.com/gnosis/safe-cli/) to interact with your Safe using the command line. Its functionality is currently limited. We will be adding more in the future. Please open an issue on [Github](https://github.com/gnosis/safe-cli/issues/) for feature requests and bugs.

## Focus on open source

All our code is open source. That includes the smart contracts, all our interfaces, and the backend services. We believe this is necessary for trust and security, especially for wallet infrastructure. You can inspect all projects on [Github](https://github.com/gnosis?q=safe).

## External interfaces

[Universal Login](https://medium.com/universal-ethereum/universal-login-beta-3-gnosis-safe-support-more-9b72be0e01f8) enables full support for Gnosis Safe smart contracts. A newly deployed wallet is by default a Gnosis Safe. They leverage the Safe mainly due to its security: “Gnosis Safe is formally verified and audited code that is storing more and more value every month (currently almost $9 million worth)”

[Pepo](https://blog.gnosis.pm/network-effects-gnosis-safe-and-pepo-the-new-dapp-for-the-crypto-community-3b8160e62898), a video-sharing social network built on blockchain and developed by OST, utilized the Gnosis Safe smart contracts. For each new Pepo user, a new Gnosis Safe contract is deployed. The Pepo team decided to build on the Gnosis Safe stack because of its modularity, flexibility, and security, allowing their dapp to take advantage of session keys, multiple device management, and account recovery. A key contribution from Gnosis Safe to the dapp’s user experience is that its contracts enable users to have multiple devices.