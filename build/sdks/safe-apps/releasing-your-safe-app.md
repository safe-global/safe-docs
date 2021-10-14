# Releasing your Safe App

### Release Process

#### How to get your Safe Apps into the hands of users

As soon as you are done developing and testing your Safe App, you can already let some actual users test it by just simply sending them the link to the hosted Safe App and asking them to add it as a Custom App. [This guide](https://help.gnosis-safe.io/en/articles/4022030-add-a-custom-safe-app) explains how to add custom apps.

#### Get your Safe App listed in the Safe Multisig

To organically reach Safe Multisig users, you want to have your Safe App directly listed, of course. For Gnosis to list your app, the Safe App needs to fulfill the following criteria: The Safe App manifest includes all the required information

**1) Your Safe App must include a manifest.json file that contains the following data:**

* `"name": "Name of your Safe App"`

This is the official name of your Safe App, with a maximum of 20 characters.

* `"iconPath": "your_logo.svg"`

A file path to the logo that will be used alongside your Safe App. The icon must be a square SVG image of at least 256 by 256 pixels.

* `"description": "This is the Safe app description."`

Describe the functionality of your Safe App in 50-500 characters.

* `"providedBy": {"name": "Example organization", "url": "https://example_organization.com"}`

Your company or personal name and link to your company or personal domain.

An example manifest can be found on [Github](https://github.com/gnosis/safe-apps-sdk/blob/master/packages/cra-template-safe-app/template/public/manifest.json). An example Safe app on ipfs can be found [here](https://ipfs.io/ipfs/QmTgnb1J9FDR9gimptzvaEiNa25s92iQy37GyqYfwZw8Aj/).

**2) Gnosis has reviewed the Safe App**

While we won’t be able to do a proper audit for your Safe App, we still would like to take a look at the source code to raise issues or suggest improvements. Depending on whether your Safe App is open or closed source, please send us either a **link to the public repo or an invitation to the private code repository**.

We also would like to make a rough functional review of the app, so please provide us with a **high-level test plan / feature list** that allows our QA team to make sure everything works as intended in production.

**3) Help us decode your Safe App transactions**

We want to display interactions with Safe Apps as humand-readable as possible. To do this, we need the contract ABI of the contracts that your Safe App interacts with. The ideal way to do this would be to verify your contracts via [Sourcify](https://github.com/ethereum/sourcify), which we can leverage to decode transactions interacting with those contract.

Alternatively, you can provide us with the ABIs as JSON files or the links to the verified contracts on Etherscan, so we can implement transaction decoding for your Safe App interactions.

#### Official launch and beyond

After we have reviewed and integrated your Safe App, the app will first be available in the staging versions ([Rinkeby](http://safe-team-rinkeby.staging.gnosisdev.com/app/#/) / [Mainnet](http://safe-team-mainnet.staging.gnosisdev.com/app/#/)) of the Safe Multisig for you to do a final review. We would then approach you to coordinate the launch and a joint announcement.

At any point after the launch, if you or your users encounter issues with the Safe App, or you want to release an update to an existing Safe App, please get in touch with us via [Discord](https://discord.gg/FPMRAwK).
