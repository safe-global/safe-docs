---
id: sdks_safe_apps
title: Safe Apps
sidebar_label: Safe Apps
---

With over $1B worth of digital assets held in Gnosis Multisigs alone, it’s essential for the dapp ecosystem to access the untapped market of multi-signature wallets. Safe Apps introduce a completely new way for developers to build their dapps right into a Multisig interface. Turn your Dapp into an HTML iframe component that can be accessed through the Safe Multisig. We are providing extensive developer tooling to make it easy to develop, test and integrate Safe Apps into the Safe Multisig. This includes a unique design system, reusable components and a Safe App SDK that facilitates the Safe App <> Safe Multisig communication.

Please refer to this [EthCC3 talk](https://www.youtube.com/watch?v=1GirpNHZPJM) to learn more about Safe Apps.

## Safe Apps SDK

The Safe App SDK is a software development kit to integrate third-party applications (Safe Apps) with the [Safe Multisig interface](https://gnosis-safe.io/app/).

[Find documentation on the Safe App SDK here](https://github.com/gnosis/safe-apps-sdk)

## Safe Apps Grants

We have an ongoing program to finance the development of Safe Apps through grants with up to $3000. These grants are meant as an incentive for the community to extend the functionality of the Safe Multisig and enable small projects or independent developers to build their first Safe App.

Find more information about our grants program [here](https://github.com/gnosis/GECO/blob/master/Safe%20Apps%20Grants/Safe%20Apps%20Grants.md).

## UI Kit & Guidelines

We provide Safe App developers with reusable react components to make it easy to build Safe Apps with a near-native look and feel while still allowing to enable developers to use their own branding in the Safe Apps.

[Access Storybook](https://components.gnosis-safe.io/)

![](assets/safe_apps_guides.png)


## Release Process

### How to get your Safe Apps into the hands of users

As soon as you are done developing and testing your Safe App, you can already let some actual users test it by just simply sending them the link to the hosted Safe App and asking them to add it as a Custom App. [This guide](https://help.gnosis-safe.io/en/articles/4022030-add-a-custom-safe-app) explains how to add custom apps.

### Get your Safe App listed in the Safe Multisig

To organically reach Safe Multisig users, you want to have your Safe App directly listed, of course. In order for Gnosis to list your app, the Safe App needs to fulfill the following criteria:
The Safe App manifest includes all the required information

#### 1) Your Safe App must include a manifest.json file that contains the following data: (Example for [this app](https://ipfs.io/ipfs/QmTgnb1J9FDR9gimptzvaEiNa25s92iQy37GyqYfwZw8Aj/))

- `"name": 'Name of your Safe App'`

This is the official name of your Safe App, with a maximum of 20 characters.

- `"iconPath": 'sapp_logo.svg'`

A file path to the logo that will be used alongside your Safe App. The icon must be a square SVG image of at least 256 by 256 pixels.

- `"description": 'A Safe app to compose custom multisend transactions'`

Describe the functionality of your Safe App in 50-500 characters.

- `"providedBy": {"name": 'Gnosis', "url": 'https://gnosis.io'}`

Your company or personal name and link to your company or personal domain.

#### 2) The Safe App is hosted on IPFS

While we allow interacting with Safe Apps hosted on a regular web server through the Add custom app feature, we require listed apps to be hosted on IPFS. This ensures users can trust in the app being available at any time in the future without relying on the Safe App being hosted by the developer.

Gnosis runs its own IPFS node and will make sure to pin your Safe App to guarantee availability.

Optional: Rinkeby version
You can also create a Safe App that can be displayed in the [Rinkeby version of the Safe Multisig](https://rinkeby.gnosis-safe.io/app/). This helps users test out the app first before using it with mainnet assets.

#### 3) Gnosis has reviewed the Safe App source code

While we won’t be able to do a proper audit for your Safe App, we still would like to take a look at the source code in order to raise issues or suggest improvements. Depending on whether your Safe App is open or closed source, please send us either a link to the public repo or an invitation to the private code repository, respectively.

### Official launch and beyond

After we have reviewed and integrated your Safe App, the app will first be available in the staging versions ([Rinkeby](http://safe-team-rinkeby.staging.gnosisdev.com/app/#/) / [Mainnet](http://safe-team-mainnet.staging.gnosisdev.com/app/#/)) of the Safe Multisig for you to do a final review. We would then approach you to coordinate the launch and a joint announcement.

At any point after the launch, if you or your users encounter issues with the Safe App, or you want to release an update to an existing Safe App, please get in touch with us.

safe@gnosis.io or via our [Discord](https://discord.gg/FPMRAwK)

### Disclaimer

It is at the sole discretion of Gnosis to list or delist apps from the Safe Multisig. Safe Apps are not owned, controlled, maintained or audited by Gnosis.
