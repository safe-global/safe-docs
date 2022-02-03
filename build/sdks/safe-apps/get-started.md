---
description: Basic resoruces to start creating Safe Apps
---

# Get started

Welcome! We are glad on your interest about creating a Safe App. The team is working hard to provide the tools to make it easier for you to build apps that can interact with the Safe.&#x20;

Once you are here the main resources include:

* [UI Kit](get-started.md#ui-kit)
* [SDK Packages](get-started.md#undefined)
* [Basic Requirements](get-started.md#basic-requirements)

### UI Kit

If you are creating your Safe App from scratch, we provide a reusable react components package to make it easy to build Safe Apps with a near-native look and feel while still allowing to enable developers to use their branding in the Safe Apps.

* [Check all available components in the storybook](https://components.gnosis-safe.io)
* [Check UI Kit repository](https://github.com/gnosis/safe-react-components)

### SDK Packages

This is one of our main pieces for Safe Apps integrations. Either you already have a dapp or you are thinking about creating a new one you will find useful to rely in one of our integrations to easily communicate with the Safe application. In this packages you will find integrations with very common packages like Web3Modal, Blocknative onboard.js or web3-react, that you may be already using on your project. For those creating a new dapp, our [CRA template](https://github.com/gnosis/safe-apps-sdk/tree/master/packages/cra-template-safe-app) to kickstart the basic structure with all the necessary configuration will speed up the process. [Check more about SDK Packages](build.md).

### Basic requirements

If you already have a dapp these are some mandatory requirements to adapt your app to be used as a Safe App. Without this basic configuration the dapp won't work with the Safe as expected.

If you are using our [CRA template](https://github.com/gnosis/safe-apps-sdk/tree/master/packages/cra-template-safe-app) to start your Safe App this basic requirements are already included.

#### Manifest

It is mandatory that your app exposes a `manifest.json` file in the root dir with this structure:

```json
{
  "name": "YourAppName",
  "description": "A description of what your app do",
  "iconPath": "myAppIcon.svg"
}
```

> Note: iconPath it's the public relative path where the Safe will try to load your app icon. For this example, it should be https://yourAppUrl/myAppIcon.svg.

#### CORS

As the Safe App is loaded into the Safe application via an iframe it is required to enable **Cross Site Requests** by setting the **CORS** headers when serving the Safe app.

The required headers are:

```
"Access-Control-Allow-Origin": "\*",
"Access-Control-Allow-Methods": "GET",
"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
```

#### React development

It is possible to use the local React development server. For this you need to set the **CORS** headers and make sure to use the same protocol (http or https) as the Safe interface you are using for testing.

**CORS**

For this we recommend to use [react-app-rewired](https://www.npmjs.com/package/react-app-rewired). To enable the library update the `scripts` section in the `package.json`:

```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test"
},
```

Additionally, you need to create the `config-overrides.js` file in the root of the project to confirgure the **CORS** headers. The content of the file should be:

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
    // a starting configuration to then modify instead of having to create a config from scratch.
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      };

      // Return your customised Webpack Development Server config.
      return config;
    };
  },
};
```

**SSL**

To enable SSL with `react-scripts` it is necessary to set the `HTTPS` environment variable to `true`. This can be done in the `package.json` file by adjusting the `scripts` section to:

```json
"scripts": {
  "start": "HTTPS=true react-app-rewired start",
},
```

As in most cases the SSL certificate provided by `react-scripts` is not valid it is required to mark it as trusted in your browser. For this open the Safe App in a separate tab (not in the Safe interface) and accept the certificate/ ignore the warning.
