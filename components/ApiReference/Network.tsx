import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type PropsWithChildren,
  useContext
} from 'react'
import Link from 'next/link'
import MuiLink from '@mui/material/Link'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import GetAppIcon from '@mui/icons-material/GetApp'
import { capitalize } from 'lodash'
import { CopyToClipboard } from 'nextra/components'
import Check from '@mui/icons-material/Check'

const transactionServiceUrls = [
  'https://safe-transaction-mainnet.safe.global',
  'https://safe-transaction-arbitrum.safe.global',
  'https://safe-transaction-aurora.safe.global',
  'https://safe-transaction-avalanche.safe.global',
  'https://safe-transaction-base.safe.global',
  'https://safe-transaction-base-sepolia.safe.global',
  'https://safe-transaction-bsc.safe.global',
  'https://safe-transaction-celo.safe.global',
  'https://safe-transaction-gnosis-chain.safe.global',
  'https://safe-transaction-optimism.safe.global',
  'https://safe-transaction-polygon.safe.global',
  'https://safe-transaction-zkevm.safe.global',
  'https://safe-transaction-scroll.safe.global',
  'https://safe-transaction-sepolia.safe.global',
  'https://safe-transaction-zksync.safe.global'
]

export const NetworkContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>([transactionServiceUrls[13], () => {}])

export const NetworkProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const state = useState(transactionServiceUrls[13])

  return (
    <NetworkContext.Provider value={state}>{children}</NetworkContext.Provider>
  )
}

const NetworkSwitcher: React.FC = () => {
  const [network, setNetwork] = useContext(NetworkContext)
  return (
    <>
      <Grid
        container
        mt={2}
        mb={[8, 0]}
        alignItems='center'
        flexDirection={['column', 'row']}
      >
        <Select
          value={network}
          onChange={e => {
            setNetwork(e.target.value)
          }}
          sx={{
            mr: 1,
            width: ['100%', '100%', 'auto'],
            color: 'white',
            border: ({ palette }) => `1px solid ${palette.grey[700]}`
          }}
          inputProps={{
            sx: {
              p: 0.5,
              pl: 1
            }
          }}
        >
          {transactionServiceUrls.map(url => (
            <MenuItem key={url} value={url}>
              {capitalize(url.split('-')[2].split('.')[0])}
            </MenuItem>
          ))}
        </Select>
        <Grid mr={1} my={2} sx={{ width: ['100%', '100%', 'auto'] }} item>
          <Link href={network} target='_blank' rel='noopener noreferrer'>
            <Typography
              variant='caption'
              mx={1}
              noWrap
              sx={{
                whiteSpace: 'nowrap',
                overflowX: 'scroll',
                textOverflow: 'initial',
                display: { xs: 'inline-block', md: 'inline' },
                height: '20px',
                width: ['calc(100% - 48px)', 'calc(100% - 48px)', 'auto']
              }}
            >
              <strong style={{ color: 'white' }}>Base URL:</strong> {network}{' '}
            </Typography>
          </Link>
          <CopyToClipboard getValue={() => `${network}`} />
        </Grid>
        <Grid sx={{ width: '100%' }} item mr={1}>
          <Link
            href={`${network}?format=openapi`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button
              variant='contained'
              color='primary'
              sx={{ width: ['100%', '100%', 'auto'] }}
              endIcon={<GetAppIcon />}
            >
              Download Specs
            </Button>
          </Link>
        </Grid>
      </Grid>

      <Grid container mt={2} alignItems='center'></Grid>
    </>
  )
}

export const NetworkNotice: React.FC = () => {
  const [network] = useContext(NetworkContext)
  const [copied, setCopied] = useState(false)
  return (
    network !== transactionServiceUrls[12] && (
      <Box sx={{ fontSize: '12px', mt: -2, mb: 3 }}>
        This snippet shows a sample request on Ethereum Sepolia. Please{' '}
        <MuiLink
          sx={{ '&:hover': { cursor: 'pointer' } }}
          onClick={() => {
            void navigator.clipboard.writeText(network)
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
            }, 3000)
          }}
        >
          click here
        </MuiLink>{' '}
        <Check
          sx={{
            fontSize: '12px',
            width: copied ? '12px' : 0,
            opacity: copied ? 1 : 0,
            mr: copied ? 0.5 : 0,
            transition: '0.4s'
          }}
        />
        to copy the base URL for{' '}
        {capitalize(network.split('-')[2].split('.')[0])} and update it in your
        request.
      </Box>
    )
  )
}

export default NetworkSwitcher
