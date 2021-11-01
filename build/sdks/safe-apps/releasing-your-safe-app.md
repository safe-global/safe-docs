# Releasing your Safe App

### Release Process

#### How to get your Safe Apps into the hands of users

As soon as you finish developing and testing your Safe App, you can already let some actual users test it by simply sending them the link to the hosted Safe App and asking them to add it as a Custom App. [This guide](https://help.gnosis-safe.io/en/articles/4022030-add-a-custom-safe-app) explains how to add custom apps.

#### Get your Safe App listed in the Safe

You must have your Safe App directly listed in Gnosis to reach Safe users organically. For your Safe App to appear in the Safe, it must meet the following criteria:

**1) Your Safe App must include a manifest.json file at the root containing the following data:**

``  "name": "Name of your Safe App"` ``

Your Safe App's name, maximum 50 characters.

`"iconPath": "your_logo.svg"`

A relative file path to your App's logo. The icon must be a square SVG image of at least 128 by 128 pixels.

`"description": "This is the Safe app description."`

Few sentences describing your application, maximum 200 characters

You can find an example manifest file on [Github](https://github.com/gnosis/safe-apps-sdk/blob/master/packages/cra-template-safe-app/template/public/manifest.json). In addition, you can find an example Safe App on IPFS [here](https://ipfs.io/ipfs/QmTgnb1J9FDR9gimptzvaEiNa25s92iQy37GyqYfwZw8Aj/).

**2) The app auto-connects to the Safe**

When a user opens the app, it should automatically select the Safe as a wallet. Ensure to check the case if the user previously opened the app outside of the Safe with another wallet.

**3) Gnosis has reviewed the Safe App**

The requirement doesn't apply for battle-tested applications hosted on the same domain like the main dApp.

While we won't be able to do a proper audit for your Safe App, we still would like to look at the source code to raise issues or suggest improvements. So whether your Safe App is open or closed source, please send us either a **link to the public repo or an invitation to the private code repository**.

We also would like to make a rough functional review of the App, so please provide us with a **high-level test plan/feature list** that allows our QA team to make sure everything works as intended in production. Video walkthroughs are also welcome.

**4) Help us decode your Safe App transactions**

We want to display interactions with Safe Apps as human-readable as possible. To do this, we need the contract ABI of the contracts that your Safe App interacts with. The ideal way to do this would be to verify your contracts via [Sourcify](https://github.com/ethereum/sourcify), which we can leverage to decode transactions interacting with those contracts.

Alternatively, you can provide us with the ABIs as JSON files or the links to the verified contracts on Etherscan, so we can implement transaction decoding for your Safe App interactions.

**Create an issue in our repository once you've verified that your app meets these requirements: **[https://github.com/gnosis/safe-apps-list](https://github.com/gnosis/safe-apps-list)

#### The Official launch and beyond

After we have reviewed and integrated your Safe App, the App will first be available in the staging versions ([Rinkeby](http://safe-team-rinkeby.staging.gnosisdev.com/app/#/) / [Mainnet](http://safe-team-mainnet.staging.gnosisdev.com/app/#/)) of the Safe for you to do a final review. We would then approach you to coordinate the launch and a joint announcement.

At any point after the launch, if you or your users encounter issues with the Safe App, or you want to release an update to an existing Safe App, please get in touch with us via [Discord](https://discord.gg/FPMRAwK).
