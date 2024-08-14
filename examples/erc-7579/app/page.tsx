'use client'

import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import {
  getPermissionlessClient,
  type PermissionlessClient
} from '@/lib/permissionless'
import { deploySafe, getSafeData } from '@/lib/safe'
import SafeAccountDetails from '@/components/SafeAccountDetails'
import SocialRecovery from '@/components/SocialRecovery'

export default function Home () {
  const [permissionlessClient, setPermissionlessClient] = useState<
    PermissionlessClient | undefined
  >()

  const [loading, setLoading] = useState(false)
  const [safeOwners, setSafeOwners] = useState<`0x${string}`[]>()

  const handleLoadSafe = async () => {
    setLoading(true)
    const permissionlessClient = await getPermissionlessClient()
    const safeData = await getSafeData(permissionlessClient.account.address)
    if (safeData.isDeployed === false) {
      const txHash = await deploySafe(permissionlessClient)
      console.log(
        'Safe is being deployed: https://sepolia.etherscan.io/tx/' + txHash
      )
    }
    setPermissionlessClient(permissionlessClient)
    setSafeOwners(safeData.owners as `0x${string}`[])
    setLoading(false)
  }

  return (
    <>
      {permissionlessClient == null ? (
        <>
          <button
            disabled={loading}
            onClick={handleLoadSafe}
            style={{ marginTop: '40px' }}
          >
            {loading ? (
              <>
                Loading...{' '}
                <CircularProgress size='10px' sx={{ color: 'black' }} />
              </>
            ) : (
              'Create Safe'
            )}
          </button>
        </>
      ) : (
        <>
          <SafeAccountDetails {...{ permissionlessClient, safeOwners }} />
          <SocialRecovery {...{ permissionlessClient, setSafeOwners }} />
        </>
      )}
    </>
  )
}
