---
id: cpktutorial4
title: Fetching the necessary data from the blockchain
sidebar_label: Fetching the necessary data from the blockchain
---

First we need to initialize the DAI and Compound DAI token contracts instances, the ABI can be found [here](https://github.com/gnosis/cpk-compound-example/blob/master/src/abis/CErc20.json):

```jsx
import React, { useMemo } from "react"
import cERC20Abi from "src/abis/CErc20.json"

interface ICompoundForm {
  web3: any
  address: string
  cpk: CPK
}

const DAI_ADDRESS = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'
const CDAI_ADDRESS = '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14'

const BLOCKS_PER_YEAR = (365.25 * 24 * 3600) / 15
const DECIMALS_18 = 10 ** 18

const CompoundForm: React.FC<ICompoundForm> = ({ web3, address, cpk }) => {
  const dai = useMemo(() => new web3.eth.Contract(cERC20Abi, DAI_ADDRESS), [
    web3
  ])
  const cDai = useMemo(() => new web3.eth.Contract(cERC20Abi, CDAI_ADDRESS), [
    web3
  ])

  return <div />
}
```

Let's write a function that will fetch the data required for investment calculations and save them into our state variables:

```jsx
import React, { useState } from "react"
import BigNumber from "bignumber.js"

const CompoundForm: React.FC<ICompoundForm> = ({ web3, address, cpk }) => {
  ...
  const [cDaiSupplyAPR, setCDaiSupplyAPR] = useState<string>("0")
  const [daiBalance, setDaiBalance] = useState<number>(0)
  const [cDaiLocked, setCDaiLocked] = useState<number>(0)

  const getData = async () => {
    // supply rate
    const cDaiSupplyRate = await cDai.methods.supplyRatePerBlock().call()
    const res = new BigNumber(cDaiSupplyRate)
      .times(BLOCKS_PER_YEAR)
      .div(DECIMALS_18)
      .times(100)
      .toFixed(2)
    setCDaiSupplyAPR(res)

    // dai Balance of user's connected wallet
    const daiBalance = await dai.methods.balanceOf(address).call()
    setDaiBalance(daiBalance)

    // current dai locked 
    const daiLocked = await cDai.methods.balanceOfUnderlying(cpk.address).call()
    setCDaiLocked(daiLocked)
  }
  ...
  return <div />
}
```

Notice that in <span style="color:#DB3A3D">`daiLocked`</span> we use the address of a proxy, because in the result proxy will hold the locked funds. Proxy contract will be deployed when you first initiate the transaction with it, but the address is available by accessing <span style="color:#DB3A3D">`address`</span> property of the CPK instance even when it's not deployed yet.

