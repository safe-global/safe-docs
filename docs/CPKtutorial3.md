---
id: cpktutorial3
title: Initializing CPK instance
sidebar_label: Initializing CPK instance
---

As soon as we got the wallet integration provider, we're ready to initialize the CPK instance. In the case of web3.js, we do this simply by calling CPK.create and passing provider instance as an option with <span style="color:#DB3A3D">`web3`</span> key, so our <span style="color:#DB3A3D">`App.tsx`</span> looks like this now:

```jsx
import React, { useState, useEffect } from "react"
import Web3 from "web3"
import CPK from "contract-proxy-kit"
import ConnectButton from "src/components/ConnectButton"

const App: React.FC = () => {
  const [web3, setWeb3] = React.useState<any>(undefined)
  const [proxyKit, setProxyKit] = React.useState<CPK | undefined>(undefined)

  const onWeb3Connect = (provider: any) => {
    if (provider) {
      setWeb3(new Web3(provider))
    }
  }

  useEffect(() => {
    const initializeCPK = async () => {
      setProxyKit(await CPK.create({ web3 }))
    }

    initializeCPK()
  }, [web3])

  return (
    <>
      <ConnectButton onConnect={onWeb3Connect} />
    </>
  )
}
```
