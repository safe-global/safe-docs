'use client'

import { useState } from 'react'
import { createWalletClient, custom, getAddress } from 'viem'
import { sepolia } from 'viem/chains'

import {
  getPermissionlessClient,
  WalletClientWithTransport,
  type PermissionlessClient
} from '@/lib/permissionless'
import SafeAccountDetails from '@/components/SafeAccountDetails'
import SocialRecovery from '@/components/SocialRecovery'
import { getSafeData } from '@/lib/safe'

/**
 * This component is the main page of the app
 * @returns React component that allows the user to connect their wallet and display the other components
 */
export default function Home () {
  const [permissionlessClient, setPermissionlessClient] = useState<
    PermissionlessClient | undefined
  >()
  const [walletClient, setWalletClient] = useState<
    WalletClientWithTransport | undefined
  >()
  const [accounts, setAccounts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [safeOwners, setSafeOwners] = useState<`0x${string}`[]>()
  const [isDeployed, setIsDeployed] = useState(false)

  const handleConnectWallet = async () => {
    setLoading(true)
    // @ts-ignore
    const accounts = await window.ethereum.request({ // Requests the accounts from the user's wallet (e.g. Metamask)
      method: 'eth_requestAccounts'
    })

    const checksummed = accounts.map((account: string) => getAddress(account))

    const walletClient = createWalletClient({ // Creates the viem wallet client
      account: accounts[0],
      chain: sepolia,
      // @ts-ignore
      transport: custom(window.ethereum)
    }) as WalletClientWithTransport

    const permissionlessClient = await getPermissionlessClient(walletClient) // Creates the permissionless client
    const safeData = await getSafeData(permissionlessClient.account.address) // Fetch onchain data about the safe (owners and whether it was deployed)

    // Set the state variables
    setAccounts(checksummed)
    setWalletClient(walletClient)
    setPermissionlessClient(permissionlessClient)
    setSafeOwners(safeData.owners as `0x${string}`[])
    setIsDeployed(safeData.isDeployed)
    setLoading(false)
  }

  return (
    <>
      {walletClient == null || permissionlessClient == null ? (
        <>
          <button
            disabled={loading}
            onClick={handleConnectWallet}
            style={{ marginTop: '40px' }}
          >
            {loading ? <>Loading...</> : 'Connect Wallet'}
          </button>
        </>
      ) : (
        <>
          <SafeAccountDetails
            {...{
              permissionlessClient,
              safeOwners,
              setSafeOwners,
              setIsDeployed
            }}
          />
          {isDeployed ? (
            <SocialRecovery
              {...{
                permissionlessClient,
                walletClient,
                accounts,
                safeOwners,
                setSafeOwners
              }}
            />
          ) : null}
        </>
      )}
    </>
  )
}
