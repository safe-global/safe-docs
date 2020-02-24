---
id: pmtutorial3
title: Setting up the development environment
sidebar_label: Setting up the development environment
---

This example project is a React application bootstrapped with [create-react-app](https://github.com/facebook/create-react-app) using [TypeScript](https://www.typescriptlang.org/).
For more information on those projects, visit their websites. We assume you are familiar with these technologies as this tutorial will only cover things you need to integrate the **Gnosis Conditional Tokens**.

Before we are getting started you will need to set up your development environment.

## Installation

First of all, you will need to run your personal blockchain locally using Ganache and Truffle.

Install them using `npm`:
```
npm install -g ganache-cli
npm install -g truffle
```
or, if you are using `yarn`:
```
yarn global add ganache-cli
yarn global add truffle
```
Run `ganache-cli` using the deterministic option to make the tutorial easier to follow:
```
ganache-cli -d
```

Now please download and install the [Conditional Tokens Tutorial](https://github.com/gnosis/conditional-tokens-tutorial) repository from GitHub:
```
git clone https://github.com/gnosis/conditional-tokens-tutorial.git
cd conditional-tokens-tutorial
yarn install
```

## Environment variables

In our web app we are going to use only the first four addresses from Ganache. Of course, any addresses can be used as long as the project configuration is updated:
```
Available Accounts
==================
(0) 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 (100 ETH)
(1) 0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0 (100 ETH)
(2) 0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b (100 ETH)
(3) 0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d (100 ETH)
```
- The first address `0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1` will be used as the operator who creates and closes the prediction market.
- The second address `0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0` will be the oracle who has the answer and resolves the market.
- The third `0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b` and the forth `0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d` will be two traders who participate in the market.

Find the `.env.example` file in the root folder of the project, rename this file to `.env` and check what it was previously stated:
```
REACT_APP_OPERATOR_MNEMONIC='myth like bonus scare over problem client lizard pioneer submit female collect'
REACT_APP_OPERATOR_ADDRESS=0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
REACT_APP_FUNDING=1000000000000000000
REACT_APP_ORACLE_ADDRESS=0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0
REACT_APP_INFURA_ID=
REACT_APP_NETWORK_ID=
REACT_APP_NETWORK=
```
- `REACT_APP_OPERATOR_MNEMONIC` and `REACT_APP_OPERATOR_ADDRESS` are related with the operator mnemonic and account. We will need both to deploy the conditional tokens smart contracts and to give the operator the right privileges inside the app.
- `REACT_APP_FUNDING` indicates the initial funding (collateral token) of the market given by the operator.
- `REACT_APP_ORACLE_ADDRESS` is the oracle address who will resolve the market.
- `REACT_APP_INFURA_ID` is your Infura project id. It is not needed in case you are using your local environment with Ganache.
- `REACT_APP_NETWORK_ID` and `REACT_APP_NETWORK` are the network id and name. They are not needed in case you are using your local environment.

## Contracts deployment

Now the contracts must be compiled and deployed using the migrations you can find in the `migrations/` folder in the project.
```
truffle compile
truffle migrate
```

To deploy the contracts in a different network, use the command
```
truffle migrate --network <NETWORK_NAME>
```
where `<NETWORK_NAME>` can be `mainnet`, `ropsten`, `rinkeby`, `goerli` or `kovan`, according to the configuration file `/truffle.js` in our project. If you use this option later, remember to update all the required environment variables.

If all the contracts where deployed correctly, the last step will be to run the app.

## Running the app

After running your local network in Ganache with all the required contracts deployed, you just need to start the app. To do that run the following command in the root folder of the project, open the browser and connect your [Metamask](https://metamask.io/) to http://localhost:8545.
```
yarn start
```

In order to interact with the market we just created as the oracle and the operator, import in your Metamask at least the two first accounts generated with `ganache-cli -d` and the next two to use them as the traders.
