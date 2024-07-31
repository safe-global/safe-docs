import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PhotoIcon from '@mui/icons-material/Photo'
import {
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { Safe4337Pack } from '@safe-global/relay-kit'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { BUNDLER_URL, CHAIN_NAME, RPC_URL } from '../lib/constants'
import { mintNFT } from '../lib/mintNFT'
import SafeLogo from '../public/safeLogo.png'

type props = {
  passkey: PasskeyArgType
}

function SafeAccountDetails({ passkey }: props) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [safeAddress, setSafeAddress] = useState<string>()
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>()
  const [userOp, setUserOp] = useState<string>()

  const showSafeInfo = useCallback(async () => {
    setIsLoading(true)

    const safe4337Pack = await Safe4337Pack.init({
      provider: RPC_URL,
      signer: passkey,
      bundlerUrl: BUNDLER_URL,
      options: {
        owners: [],
        threshold: 1
      }
    })

    const safeAddress = await safe4337Pack.protocolKit.getAddress()
    const isSafeDeployed = await safe4337Pack.protocolKit.isSafeDeployed()

    setSafeAddress(safeAddress)
    setIsSafeDeployed(isSafeDeployed)
    setIsLoading(false)
  }, [passkey])

  useEffect(() => {
    showSafeInfo()
  }, [showSafeInfo])

  async function handleMintNFT() {
    setIsLoading(true)

    const userOp = await mintNFT(passkey, safeAddress!)

    setIsLoading(false)
    setIsSafeDeployed(true)
    setUserOp(userOp)
  }

  const safeLink = `https://app.safe.global/home?safe=sep:${safeAddress}`
  const jiffscanLink = `https://jiffyscan.xyz/userOpHash/${userOp}?network=${CHAIN_NAME}`

  return (
    <Paper sx={{ margin: '32px auto 0', minWidth: '320px' }}>
      <Stack padding={4} alignItems={'center'}>
        <Typography textAlign={'center'} variant='h1' color={'primary'}>
          Your Safe Account
        </Typography>

        {isLoading || !safeAddress ? (
          <CircularProgress sx={{ margin: '24px 0' }} />
        ) : (
          <>
            <Typography textAlign={'center'}>
              <Link href={safeLink} target='_blank' underline='hover' color='white'>
                <Tooltip title={safeAddress}>
                  <Stack
                    component={'span'}
                    padding={4}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <Image
                      width={32}
                      src={SafeLogo}
                      alt={'safe account logo'}
                    />
                    <span style={{ margin: '0 8px' }}>
                      {splitAddress(safeAddress)}
                    </span>
                    <OpenInNewIcon />
                  </Stack>
                </Tooltip>
              </Link>
            </Typography>

            {!isSafeDeployed && <PendingDeploymentLabel />}

            <Button
              onClick={handleMintNFT}
              startIcon={<PhotoIcon />}
              variant='outlined'
              sx={{ margin: '24px' }}
            >
              Mint NFT
            </Button>

            {userOp && (
              <Typography textAlign={'center'} >
                <Link href={jiffscanLink} target='_blank' underline='hover' color='white'>
                  <Stack
                    component={'span'}
                    padding={4}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    {userOp}
                    <OpenInNewIcon />
                  </Stack>
                </Link>
              </Typography>
            )}
          </>
        )}
      </Stack>
    </Paper>
  )
}

export default SafeAccountDetails

const DEFAULT_CHAR_DISPLAYED = 6

function splitAddress(
  address: string,
  charDisplayed: number = DEFAULT_CHAR_DISPLAYED
): string {
  const firstPart = address.slice(0, charDisplayed)
  const lastPart = address.slice(address.length - charDisplayed)

  return `${firstPart}...${lastPart}`
}

function PendingDeploymentLabel() {
  return (
    <div style={{ margin: '12px auto' }}>
      <span
        style={{
          marginRight: '8px',
          borderRadius: '4px',
          padding: '4px 12px',
          border: '1px solid rgb(255, 255, 255)',
          whiteSpace: 'nowrap',
          backgroundColor: 'rgb(240, 185, 11)',
          color: 'rgb(0, 20, 40)',
        }}
      >
        Deployment pending
      </span>
    </div>
  )
}
