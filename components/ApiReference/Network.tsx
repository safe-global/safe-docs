import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type PropsWithChildren,
  useContext
} from 'react'
import Link from 'next/link'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import GetAppIcon from '@mui/icons-material/GetApp'
import { capitalize } from 'lodash'
import { CopyToClipboard } from 'nextra/components'

import txServiceNetworks from './tx-service-networks.json'
import { getSwaggerUrl } from './utils'

/**
 * Finds the default network for the NetworkContext.
 * Currently, Sepolia is the default network.
 */
const defaultNetworkUrl = 'https://api.safe.global/tx-service/sep'

export const NetworkContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>([defaultNetworkUrl, () => {}])

export const NetworkProvider: React.FC<
  PropsWithChildren<{ networkName: string }>
> = ({ children, networkName }) => {
  const state = useState(
    txServiceNetworks.find(network => network.networkName === networkName)
      ?.txServiceUrl ?? ''
  )
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
          {txServiceNetworks.map(networkConfig => (
            <Link
              //  @ts-expect-error - value is not a valid prop for Link
              value={networkConfig.txServiceUrl}
              key={networkConfig.txServiceUrl}
              href={
                '/core-api/transaction-service-reference/' +
                networkConfig.networkName
              }
            >
              <MenuItem>
                {capitalize(networkConfig.networkName.replace('-', ' '))}
              </MenuItem>
            </Link>
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
              <strong style={{ color: 'white' }}>Base URL:</strong>
              {network}
            </Typography>
          </Link>
          <CopyToClipboard getValue={() => `${network}`} />
        </Grid>
        <Grid sx={{ width: '100%' }} item mr={1}>
          <Link
            href={getSwaggerUrl(network) + '/schema'}
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

export default NetworkSwitcher
