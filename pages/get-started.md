---
description: Basic resources to start creating Safe Apps
---

# Getting started

Here are some resources to help you get started with building Safe Apps:

* [Safe Apps SDK Packages](#safe-apps-sdk-packages)
* [Basic Requirements](#basic-requirements)
* [UI Kit](#ui-kit)

## Safe Apps SDK packages

Whether you already have a dapp or are considering creating a new one, you will find it useful to rely on one of our integrations to communicate with Safe{Wallet}. You will find integrations with common packages like `Web3Modal`, Blocknative onboard.js, and `web3-react` in these packages.

For those creating a new dapp, using the [CRA template](https://github.com/safe-global/safe-apps-sdk/tree/main/packages/cra-template-safe-app) to kickstart the basic structure with all the necessary configuration will speed up the process.

## Basic requirements

If you already have a dapp, some mandatory requirements exist to adapt your app to be used as a Safe App. Without this basic configuration, the dapp won't work with the Safe as expected.

If you are using our [CRA template](https://github.com/safe-global/safe-apps-sdk/tree/main/packages/cra-template-safe-app) to start your Safe App, these basic requirements are already satisfied.

### Manifest

It's mandatory that your app exposes a `manifest.json` file in the root directory with this structure:

```json
{
  "name": "YourAppName",
  "description": "A description of what your app does",
  "iconPath": "myAppIcon.svg"
}
```

**Note:** `iconPath` is the public relative path where Safe will try to load your app icon. For this example, it should be `https://yourAppUrl/myAppIcon.svg`.

### CORS

Safe needs to reach the `manifest.json` from the app. To allow this, it's required to enable *Cross Site Requests* by setting the *CORS* headers to the `manifest.json`.

The required headers are:

```
"Access-Control-Allow-Origin": "\*",
"Access-Control-Allow-Methods": "GET",
"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
```

### React development

It's possible to use the local React development server. For this, you need to set the *CORS* headers and use the same protocol (HTTP or HTTPS) as the Safe interface you use for testing.


**CORS for development**

For this, use [react-app-rewired](https://www.npmjs.com/package/react-app-rewired). To enable the library, update the `scripts` section in the `package.json`:

```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test"
},
```

Also, create the `config-overrides.js` file in the project's root to configure the *CORS* headers. The content of the file should be:

```js
/* config-overrides.js */

module.exports = {
  // The function to use to create a webpack dev server configuration when running the development
  // server with 'npm run start' or 'yarn start'.
  // Example: set the dev server to use a specific certificate in https.
  devServer: function (configFunction) {
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to modify instead of creating a config from scratch.
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      };

      // Return your customized Webpack Development Server config.
      return config
    }
  },
}
```

We also offer a [middleware](https://github.com/safe-global/safe-apps-sdk/blob/4dad4fdf700ed299d3a81cc08cd4928b137787e9/packages/cra-template-safe-app/template/src/setupProxy.js#L1-L15) in our React template for using frameworks like Express, Next.js, etc.

**SSL**

To enable SSL with `react-scripts`, it's necessary to set the `HTTPS` environment variable to `true`. This can be done in the `package.json` file by adjusting the `scripts` section to:

```json
"scripts": {
  "start": "HTTPS=true react-app-rewired start",
},
```

If the SSL certificate provided by `react-scripts` isn't valid, it's required to mark it as trusted in your browser. To do this, open the Safe App in a separate tab (not in the Safe interface) and accept the certificate or ignore the warning.

## UI Kit

Safe offers a react components package if you are creating your Safe App from scratch. This helps with a near-native look while enabling developers to use their branding in the Safe Apps.

* [Check all available components in the storybook](https://components.safe.global)
* [Check UI Kit repository](https://github.com/safe-global/safe-react-components)

## Example app

This [tutorial](https://github.com/gnosis/safe-apps-sdk/tree/master/guides/drain-safe-app) will build a Safe App that enables migrating all the assets from Safe to any other wallet in a single transaction. You will also learn about smart contract wallets, multi-signature transaction flow, and batched transactions.
