---
id: cpktutorial2
title: Wallet integration
sidebar_label: Wallet integration
---

Let's create a button component which would trigger the web3connect modal:

```jsx
import * as React from "react"
import Web3Connect from "web3connect"
import WalletConnectProvider from "@walletconnect/web3-provider"

type Props = {
  onConnect: Function
}

const ConnectButton: React.FC<Props> = ({ onConnect }) => (
  <Web3Connect.Button
    network="rinkeby"
    providerOptions={{
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: INFURA_ID
        }
      }
    }}
    onConnect={onConnect}
    onClose={() => {
      console.log("Web3Connect Modal Closed") // modal has closed
    }}
  />
)

export default ConnectButton
```

<span style="color:#DB3A3D">`INFURA_ID`</span> is a token which can be used to access Ethereum blockchain API. You can get one by visiting [Infura website](https://infura.io/)

Then you can use this component in your <span style="color:#DB3A3D">`App.tsx`</span>

```jsx
import React, { useState } from "react"
import Web3 from "web3"
import ConnectButton from "src/components/ConnectButton"

const App: React.FC = () => {
  const [web3, setWeb3] = React.useState<any>(undefined)

  const onWeb3Connect = (provider: any) => {
    if (provider) {
      setWeb3(new Web3(provider))
    }
  }

  return (
    <>
      <ConnectButton onConnect={onWeb3Connect} />
    </>
  )
}
```
