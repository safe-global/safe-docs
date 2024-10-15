import React, { useCallback, useEffect } from 'react'
import Img from 'next/image'
import {
  Typography,
  Chip,
  Button,
  Grid,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { capitalize } from 'lodash'
import Modal from '@mui/material/Modal'
import ClearIcon from '@mui/icons-material/Clear'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import css from './styles.module.css'
import { type Contract, networks, type Network } from './Networks'

import ChevronDownIcon from '../../assets/svg/chevron-down.svg'
import { Link } from 'nextra-theme-docs'
import { apiServices, curatedBlockExplorers } from './utils'
import txServiceNetworks from '../ApiReference/tx-service-networks.json'
import { useRouter } from 'next/router'
import { CopyToClipboard } from 'nextra/components'

const NetworkModal: React.FC<{
  versions: string[]
}> = ({ versions }) => {
  const { query, push } = useRouter()
  const { expand, ...rest } = query

  const network = networks.find(
    network => network?.chainId === parseInt(query.expand as string)
  )

  const moduleTypes = network?.modules
    .map(m => m.moduleName?.split('-').map(capitalize).join(' '))
    .filter((v, i, a) => a.indexOf(v) === i)

  const handleClose = useCallback((): void => {
    void push({
      query: {
        ...rest
      }
    })
  }, [push, rest])

  useEffect(() => {
    const handleClickAway: (event: MouseEvent) => void = event => {
      const target = event.target as HTMLElement
      if (target?.id === 'backdrop') {
        handleClose()
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleClickAway)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleClickAway)
      }
    }
  }, [handleClose])

  return (
    <Modal
      open={query.expand !== undefined}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <>
        <Grid
          container
          position='fixed'
          alignItems='center'
          justifyContent='center'
          height='calc(100vh - calc(100vh - 100%))'
          overflow='scroll'
          id='backdrop'
          py={4}
          px={2}
        >
          <Card
            sx={{
              padding: 5,
              width: '80%',
              overflowX: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <Button
              onClick={() => {
                void push({
                  query: {
                    ...rest
                  }
                })
              }}
              sx={{ position: 'relative', right: '-96%', top: '-20px' }}
            >
              <ClearIcon />
            </Button>
            <Grid container justifyContent='center'>
              <Img
                style={{ borderRadius: '48px' }}
                width={48}
                height={48}
                alt='network-logo'
                src={network?.iconUrl ?? '/unknown-logo.png'}
              />
            </Grid>
            <Typography variant='h3' textAlign='center'>
              {network?.name}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              className={css.description}
              mb={0.5}
              textAlign='center'
            >
              Chain ID: {network?.chainId}
            </Typography>
            {txServiceNetworks
              .map(n => n.chainId)
              .includes(network?.chainId ?? 0) && (
              <>
                {/* <Typography mt={2} mb={0.5}>
                  {'Testnet'}
                </Typography> */}
                <Typography variant='h6' mt={2} mb={0.5}>
                  Services
                </Typography>
                {apiServices(network?.chainId.toString() ?? '0').map(s => (
                  <Link
                    key={s.name}
                    target='_blank'
                    rel='noreferrer noopener'
                    href={s.link}
                  >
                    <Chip
                      sx={{
                        borderRadius: '4px',
                        height: '23px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        ml: 2
                      }}
                      label={
                        <>
                          {s.name}
                          <OpenInNewIcon
                            sx={{
                              fontSize: '14px',
                              ml: 1,
                              mt: -0.2
                            }}
                          />
                        </>
                      }
                    />
                  </Link>
                ))}
              </>
            )}
            <Typography variant='h6' mt={3} mb={2}>
              Smart Account
            </Typography>
            {versions
              .filter(v =>
                network?.smartAccounts.map(c => c.version).includes(v)
              )
              .map((version, idx) => (
                <Accordion
                  key={version}
                  defaultExpanded={idx === 0}
                  className={css.accordion}
                  sx={{ backgroundColor: 'transparent' }}
                >
                  <AccordionSummary expandIcon={<ChevronDownIcon />}>
                    <Typography>{version}</Typography>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      overflow: 'scroll'
                    }}
                  >
                    {network?.smartAccounts
                      .filter(c => c.version === version)
                      .map((contract, idx) => (
                        <ContractAddress
                          key={contract.name + idx}
                          contract={contract}
                          hasBlockExplorer={curatedBlockExplorers.includes(
                            network?.explorers?.[0].url
                          )}
                          network={network}
                        />
                      ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            {moduleTypes?.length != null && moduleTypes.length > 0 && (
              <Typography variant='h6' mt={3} mb={2}>
                Modules
              </Typography>
            )}
            {moduleTypes?.map((type, idx) => {
              const versions = network?.modules
                .filter(
                  m =>
                    m.moduleName?.split('-').map(capitalize).join(' ') === type
                )
                .map(m => m.version)
                .filter((v, i, a) => a.indexOf(v) === i)
              return (
                <Accordion
                  key={idx}
                  defaultExpanded={idx === 0}
                  className={css.accordion}
                  sx={{ backgroundColor: 'transparent' }}
                >
                  <AccordionSummary expandIcon={<ChevronDownIcon />}>
                    <Typography>{type}</Typography>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      overflow: 'scroll'
                    }}
                  >
                    {versions?.reverse().map(version => (
                      <div key={version}>
                        <Typography variant='caption' mb={0.5}>
                          {version}
                        </Typography>
                        {network?.modules
                          .filter(
                            m =>
                              m.moduleName
                                ?.split('-')
                                .map(capitalize)
                                .join(' ') === type && m.version === version
                          )
                          .map(contract => {
                            const hasBlockExplorer =
                              curatedBlockExplorers.includes(
                                network?.explorers?.[0].url
                              )
                            return (
                              <ContractAddress
                                key={contract.name + idx}
                                contract={contract}
                                hasBlockExplorer={hasBlockExplorer}
                                network={network}
                              />
                            )
                          })}
                      </div>
                    ))}
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Card>
        </Grid>
      </>
    </Modal>
  )
}

function splitAddress(address: string, charDisplayed: number = 8): string {
  const firstPart = address.slice(0, charDisplayed)
  const lastPart = address.slice(address.length - charDisplayed)

  return `${firstPart}...${lastPart}`
}

export const SplitAddress: React.FC<{ address: string }> = ({ address }) => {
  return (
    <>
      {splitAddress(address)}
      <CopyToClipboard getValue={() => address} style={{ marginLeft: '8px' }} />
    </>
  )
}

const ContractAddress: React.FC<{
  contract: Contract
  hasBlockExplorer: boolean
  network: Network
}> = ({ contract, network, hasBlockExplorer }) => {
  return (
    <li style={{ marginLeft: '12px' }} key={contract.name}>
      <code>{contract.name}.sol</code>:{' '}
      <Typography variant='caption' ml={0.5} mb={0.5}>
        {(contract.address?.length ?? 0) > 0 ? (
          hasBlockExplorer ? (
            <>
              <Link
                target='_blank'
                rel='noreferrer noopener'
                href={
                  network?.explorers[0].url + '/address/' + contract.address
                }
                style={{ marginRight: '8px' }}
              >
                {splitAddress(contract.address ?? '')}
              </Link>
              <CopyToClipboard getValue={() => contract.address ?? ''} />
            </>
          ) : (
            <SplitAddress address={contract.address ?? ''} />
          )
        ) : (
          contract.addresses?.map((a: [string, string]) =>
            hasBlockExplorer ? (
              <li key={a[1]} style={{ marginLeft: '12px' }}>
                {a[0].slice(0, -1)}:{' '}
                <Link
                  target='_blank'
                  rel='noreferrer noopener'
                  href={network?.explorers[0].url + '/address/' + a[1]}
                >
                  {a[1]}
                </Link>
                <CopyToClipboard getValue={() => a[1]} />
              </li>
            ) : (
              <li key={a[1]} style={{ marginLeft: '12px' }}>
                {a[0].slice(0, -1)}: {<SplitAddress address={a[1]} />}
              </li>
            )
          )
        )}
      </Typography>
    </li>
  )
}

export default NetworkModal
