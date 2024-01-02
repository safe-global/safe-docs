# Releasing your Safe App

Here are some details about the release process for Safe Apps.

## Get your Safe Apps into the hands of users

Once you finish developing and testing your Safe App, your users can test it by opening the link to the hosted Safe App and adding it as a Custom App. [This guide](https://help.safe.global/en/articles/40859-add-a-custom-safe-app) explains how to add custom apps.

## Get your Safe App listed in Safe{Wallet}

{% hint style="info" %} Due to the limited resource the Safe team can't ensure prompt app review. Please fill in [this Google Form](https://forms.gle/PcDcaVx715LKrrQs8) before submission. {% endhint %}

If you would like your Safe App to appear in the Safe, it must meet the following criteria:

### Smart contracts must be audited

Security is the top priority for Safe. Please provide an external audit result document if the Safe App includes smart contracts. If a third party created the smart contracts, ensure they are audited.

### Your Safe App must include a manifest

There must be a `manifest.json` at the root directory containing the following data:

`"name": "Name of your Safe App"`

Your Safe App's name needs to have 50 characters maximum.

`"iconPath": "your_logo.svg"`

A relative file path to your App's logo. The icon must be a square SVG image of at least 128 by 128 pixels.

`"description": "This is the Safe app description."`

Few sentences describing your application, a maximum of 200 characters

You can find an example manifest file on [GitHub](https://github.com/safe-global/safe-apps-sdk/blob/main/packages/cra-template-safe-app/template/public/manifest.json). You can also find an example Safe App on IPFS [here](https://ipfs.io/ipfs/QmTgnb1J9FDR9gimptzvaEiNa25s92iQy37GyqYfwZw8Aj/).

Remember that **CORS** needs to be configured correctly on the `manifest.json` so we can fetch the information as [mentioned here](./get-started.md#cors).

### The app auto connects to the Safe

When a user opens the app, it should automatically select the Safe as a wallet. Ensure to check the case if the user previously opened the app outside of the Safe with another wallet.

### The Safe team has reviewed the Safe App

The requirement doesn't apply for battle-tested applications hosted on the same domain as the main dapp.

While we won't be able to do a proper audit for your Safe App, we still would like to look at the source code to raise issues or suggest improvements. Whether your Safe App is open or closed source, please send us either a link to the public repository or an invitation to the private repository.

We also would like to make a rough functional review of the App, so please provide us with a high-level test plan/feature list that allows our QA team to ensure everything works as intended in production. Video walkthroughs are also welcome.

### Help us decode your Safe App transactions

We want to display interactions with Safe Apps as human-readable as possible. To do this, we need the ABI of the contracts your Safe App interacts with. The ideal way to do this would be to verify your contracts via [Sourcify](https://github.com/ethereum/sourcify), which we can leverage to decode transactions interacting with those contracts.

Alternatively, you can provide us with the ABIs as JSON files or the links to the verified contracts on Etherscan so we can implement transaction decoding for your Safe App interactions.

## Official launch and beyond

After we have reviewed and integrated your Safe App, the App will first be available in the [staging environment](https://safe-wallet-web.staging.5afe.dev) of the Safe for you to do a final review. We would then approach you to coordinate the launch and a joint announcement.

At any point after the launch, if you or your users encounter issues with the Safe App or want to release an update to an existing Safe App, please contact us via [Discord](https://chat.safe.global).

While developing your Safe App, you can use [our production interface](https://app.safe.global) to test it. Some testnets like Goerli are also available.

Once your app is live, even if you run it locally, you can import it to the Safe application as a custom app. To do so, you should select the "Apps" tab:

<figure><img src="../../.gitbook/assets/side-bar-menu.png" width="100%" alt="" /></figure>

Use the `Add custom app` button and add your app using a link:

<figure><img src="../../.gitbook/assets/add-custom-app.png" width="100%" alt="" /></figure></figure>
