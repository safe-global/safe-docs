---
id: cpktutorial1
title: Getting Started
sidebar_label: Getting Started
---

Integrating Gnosis Safe Proxy Kit with the frontend (Compound App Example)
App can be found live here: http://green-summer.surge.sh/

## Introduction

This tutorial will teach you how you can use Gnosis Safe Contract Proxy Kit to perform batched transactions and interact with smart contracts. 
This tutorial is meant for those with a basic knowledge of Ethereum and Solidity. Furthermore, you should have some basic knowledge of JavaScript.
 
In this tutorial we will cover: 

- How to install and initialize CPK
- How to interact with the CPK JavaScript library
- How to perform a transaction
- How to interact with a smart contract
- How to use batched transactions

## Web3/Ethers.js

Gnosis Safe Proxy Kit is a smart contract on the Ethereum blockchain. There are two popular libraries for interacting with the blockchain: [web3.js](https://github.com/ethereum/web3.js) and [ethers.js](https://github.com/ethers-io/ethers.js/). Your users will need a wallet that supports web3, in this tutorial we will use [web3connect](https://web3connect.com/) library which provides integrations with the majority of popular wallets.

## Background information

Our example project will be a [React](https://reactjs.org) application bootstrapped with [create-react-app](https://github.com/facebook/create-react-app) which uses [Evergreen UI Kit](https://evergreen.segment.com/components/). We are also going to use [TypeScript](https://typescriptlang.org) as our language. For more information on those projects, visit their websites. We assume you are familiar with those technologies as our tutorial will only cover things you need to integrate the Gnosis Safe Contract Proxy kit and not, for example, how to set up a React project.

## Useful links

- [Contract Proxy Kit documentation](https://github.com/gnosis/contract-proxy-kit)
- [Video introduction to Building with Safe Apps SDK & Contract Proxy Kit](https://www.youtube.com/watch?v=YGw8WfBw5OI)
- [Source code for the example app: Compound integration app](https://github.com/gnosis/cpk-compound-example)
- [Source code for the example app: CPK configuration app](https://github.com/gnosis/cpk-configuration-app)
- [Web3.js docs](https://web3js.readthedocs.io/)

## Installing contract-proxy-kit

To install the CPK, run following command in the root directory of your project:

If you are using [yarn](https://yarnpkg.com/):
```
yarn add contract-proxy-kit
```
Or if [npm](https://npmjs.com)
```
npm i contract-proxy-kit
```
