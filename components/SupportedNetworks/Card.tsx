import React from 'react'
import Img from 'next/image'
import { Typography, Chip, Box, Button } from '@mui/material'
// import { sendGAEvent } from '@next/third-parties/google'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import css from './styles.module.css'
import { getFilters, type Network } from './Networks'
import { capitalize } from 'lodash'

import txServiceNetworks from '../ApiReference/tx-service-networks.json'
import { useRouter } from 'next/router'
import { apiServices } from './utils'

const NetworkCard = (network: Network): JSX.Element => {
  const { query, push } = useRouter()

  const selectedVersions = getFilters(query, 'version')
  const selectedFeatures = getFilters(query, 'feature')

  const versions = network.smartAccounts
    .map(contract => contract.version)
    .filter((v, i, a) => a.indexOf(v) === i)
    .reverse()

  const modules = network.modules
    .map(m => m.moduleName?.split('-').map(capitalize).join(' '))
    .filter((v, i, a) => a.indexOf(v) === i) as string[]

  const services = txServiceNetworks
    .map(n => n.chainId)
    .includes(network.chainId)
    ? apiServices(network.chainId.toString()).map(s => s.name)
    : []

  return (
    <>
      <Box
        sx={{
          transition: 'all 0.2s ease-in-out',
          border: '1px solid',
          borderColor: 'transparent',
          '&:hover': {
            borderColor: 'secondary.light'
          },
          cursor: 'pointer',
          width: '100%'
        }}
        className={css.card}
        onClick={() => {
          void push({
            query: {
              ...query,
              expand: network.chainId
            }
          })
          // sendGAEvent('event', 'supported_networks_link', {
          //   network_chainId: network.chainId,
          //   network_name: network.name
          // })
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Box minHeight='40px'>
            <Img
              style={{ borderRadius: '32px' }}
              width={32}
              height={32}
              alt='network-logo'
              src={network.iconUrl}
            />
          </Box>

          <Typography mt={2} fontWeight='700'>
            {network.name}
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            className={css.description}
            mb={0.5}
          >
            Chain ID {network.chainId}
          </Typography>

          <div style={{ width: '100%' }}>
            <Typography my={1}>Smart Accounts</Typography>
            {versions.map(version => (
              <Chip
                color={
                  selectedVersions.includes(version) ? 'primary' : 'default'
                }
                key={version}
                sx={{
                  borderRadius: '4px',
                  height: '23px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  ml: 1
                }}
                className={css.chip}
                label={version}
              />
            ))}
          </div>
          <div style={{ width: '100%' }}>
            {[...modules, ...services].length > 0 && (
              <Typography mt={2} mb={1}>
                Features
              </Typography>
            )}
            {[...modules, ...services].map(feature => (
              <Chip
                color={
                  selectedFeatures.includes(feature) ? 'primary' : 'default'
                }
                key={feature}
                sx={{
                  borderRadius: '4px',
                  height: '23px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  ml: 1
                }}
                className={css.chip}
                label={feature}
              />
            ))}
          </div>
          <Button
            variant='text'
            fullWidth
            onClick={() => {
              void push({
                query: {
                  ...query,
                  expand: network.chainId
                }
              })
            }}
            sx={{ mt: 1 }}
          >
            <UnfoldMoreIcon />
          </Button>
        </div>
      </Box>
    </>
  )
}

export default NetworkCard
