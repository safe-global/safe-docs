import React from 'react'
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

import css from './styles.module.css'
import { type Network } from './Networks'

import ChevronDownIcon from '../../assets/svg/chevron-down.svg'
import { Link } from 'nextra-theme-docs'
import {
  curatedBlockExplorers,
  shortNametoTxService,
  txServiceNetworks
} from './utils'

const NetworkModal: React.FC<{
  network: Network
  showMore: boolean
  setShowMore: (show: boolean) => void
  versions: string[]
}> = ({ network, showMore, setShowMore, versions }) => {
  const moduleTypes = network.modules
    .map(m => m.moduleName?.split('-').map(capitalize).join(' '))
    .filter((v, i, a) => a.indexOf(v) === i)
  return (
    <Modal
      open={showMore}
      onClose={() => {
        setShowMore(false)
      }}
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
                setShowMore(false)
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
                src={network.iconUrl}
              />
            </Grid>
            <Typography variant='h3' textAlign='center'>
              {network.name}
            </Typography>
            {txServiceNetworks.includes(network.chainId) && (
              <>
                <Typography textAlign='center'>{'Safe{Wallet} ✅'}</Typography>
                <Typography textAlign='center' mb={2}>
                  {'Safe{Core} SDK ✅'}
                </Typography>
                {/* <Typography mt={2} mb={0.5}>
                  {'Testnet'}
                </Typography> */}
                <Typography variant='h6' mt={2} mb={0.5}>
                  API Services:
                </Typography>
                <Link
                  href={`https://safe-transaction-${shortNametoTxService(
                    network.shortName
                  )}.safe.global`}
                >
                  <Chip
                    sx={{
                      borderRadius: '4px',
                      height: '23px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      ml: 2
                    }}
                    label='Transaction Service'
                  />
                </Link>
                <Chip
                  sx={{
                    borderRadius: '4px',
                    height: '23px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    ml: 2
                  }}
                  label='Event Service'
                />
              </>
            )}
            <Typography variant='h6' mt={3} mb={2}>
              Smart Account:
            </Typography>
            {versions.map((version, idx) => (
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
                  {network.smartAccounts
                    .filter(c => c.version === version)
                    .map((contract, idx) => (
                      <ContractAddress
                        key={idx}
                        contract={contract}
                        hasBlockExplorer={curatedBlockExplorers.includes(
                          network.explorers?.[0].url
                        )}
                        network={network}
                      />
                    ))}
                </AccordionDetails>
              </Accordion>
            ))}
            {moduleTypes.length > 0 && (
              <Typography variant='h6' mt={3} mb={2}>
                Modules:
              </Typography>
            )}
            {moduleTypes.map((type, idx) => {
              const versions = network.modules
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
                    {versions.reverse().map(version => (
                      <div key={version}>
                        <Typography variant='caption' mb={0.5}>
                          {version}
                        </Typography>
                        {network.modules
                          .filter(
                            m =>
                              m.moduleName
                                ?.split('-')
                                .map(capitalize)
                                .join(' ') === type
                          )
                          .map(contract => {
                            const hasBlockExplorer =
                              curatedBlockExplorers.includes(
                                network.explorers?.[0].url
                              )
                            return (
                              <ContractAddress
                                key={contract.name}
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

const ContractAddress: React.FC<{
  contract: {
    name: string
    address?: string
    addresses?: Array<[string, string]>
  }
  hasBlockExplorer: boolean
  network: Network
}> = ({ contract, network, hasBlockExplorer }) => {
  return (
    <li style={{ marginLeft: '12px' }} key={contract.name}>
      <code>{contract.name}.sol</code>:{' '}
      <Typography variant='caption' ml={0.5} mb={0.5}>
        {(contract.address?.length ?? 0) > 0 ? (
          hasBlockExplorer ? (
            <Link
              target='_blank'
              rel='noreferrer noopener'
              href={network.explorers[0].url + '/address/' + contract.address}
            >
              {contract.address}
            </Link>
          ) : (
            contract.address
          )
        ) : (
          contract.addresses?.map((a: [string, string]) =>
            hasBlockExplorer ? (
              <li key={a[1]} style={{ marginLeft: '12px' }}>
                {a[0].slice(0, -1)}:{' '}
                <Link
                  target='_blank'
                  rel='noreferrer noopener'
                  href={network.explorers[0].url + '/address/' + a[1]}
                >
                  {a[1]}
                </Link>
              </li>
            ) : (
              <li key={a[1]} style={{ marginLeft: '12px' }}>
                {a[0].slice(0, -1)}: {a[1]}
              </li>
            )
          )
        )}
      </Typography>
    </li>
  )
}

export default NetworkModal
