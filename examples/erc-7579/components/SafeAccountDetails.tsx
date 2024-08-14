import Img from 'next/image'
import { splitAddress } from '@/lib/utils'
import { PermissionlessClient } from '@/lib/permissionless'

const SafeAccountDetails: React.FC<{
  permissionlessClient: PermissionlessClient
  safeOwners: `0x${string}`[] | undefined
}> = ({ permissionlessClient, safeOwners }) => {
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
      </div>
    </>
  )
}

export default SafeAccountDetails
