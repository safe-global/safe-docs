import { useState } from 'react'
import Img from 'next/image'

import { splitAddress } from '@/lib/utils'
import { PermissionlessClient } from '@/lib/permissionless'
import { deploySafe, getSafeData } from '@/lib/safe'

/**
 * This component displays information about the user's safe address and its current owners. It also allows the user to deploy a safe if they don't have one yet.
 * @returns React Functional Component
 * @param permissionlessClient - The permissionless client
 * @param safeOwners - The current owners of the safe
 */
const SafeAccountDetails: React.FC<{
  permissionlessClient: PermissionlessClient
  safeOwners: `0x${string}`[] | undefined
  setSafeOwners: React.Dispatch<
    React.SetStateAction<`0x${string}`[] | undefined>
  >
  setIsDeployed: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ permissionlessClient, safeOwners, setSafeOwners, setIsDeployed }) => {
  const [loading, setLoading] = useState(false)

  const handleDeploySafe = async () => {
    setLoading(true)
    const txHash = await deploySafe(permissionlessClient)
    console.log(
      'Safe is being deployed: https://sepolia.etherscan.io/tx/' + txHash
    )
    const safeData = await getSafeData(permissionlessClient.account.address) // Fetch again onchain data about the safe
    setSafeOwners(safeData.owners as `0x${string}`[])
    setIsDeployed(safeData.isDeployed)
    setLoading(false)
  }

  return (
    <>
      <div style={{ marginTop: '40px', display: 'flex' }}>
        Your Safe:{' '}
        <a
          href={`https://app.safe.global/home?safe=sep:${permissionlessClient.account.address}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '1rem',
            marginLeft: '1rem'
          }}
          target='_blank'
          rel='noopener noreferrer'
        >
          {splitAddress(permissionlessClient.account.address)}{' '}
          <Img
            width={20}
            height={20}
            alt='link-icon'
            src='/external-link.svg'
            style={{ marginLeft: '0.5rem' }}
          />
        </a>
      </div>
      <div style={{ marginTop: '20px', display: 'flex' }}>
        {safeOwners?.length === 0 ? (
          <button disabled={loading} onClick={handleDeploySafe}>
            {loading ? 'Deploying...' : 'Deploy Safe'}
          </button>
        ) : (
          <>
            Current owners:{' '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {safeOwners?.map((ownerAddress, i) => (
                <a
                  key={i}
                  href={`https://sepolia.etherscan.io/address/${ownerAddress}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '1rem',
                    marginLeft: '1rem'
                  }}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {splitAddress(ownerAddress)}{' '}
                  <Img
                    width={20}
                    height={20}
                    alt='link-icon'
                    src='/external-link.svg'
                    style={{ marginLeft: '0.5rem' }}
                  />
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default SafeAccountDetails
