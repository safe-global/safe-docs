import {
  Divider,
  Grid,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Link,
  Container,
  useMediaQuery
} from '@mui/material'
import type { GridProps } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import type { NextRouter } from 'next/router'
import { capitalize } from 'lodash'
import { sendGAEvent } from '@next/third-parties/google'
import AddIcon from '@mui/icons-material/Add'

import NetworkCard from './Card'
import NetworkModal from './NetworkModal'
import { theme } from '../../styles/theme'
import { useNetworksSearch } from './useNetworksSearch'
import { SidebarAccordion } from './SidebarAccordion'
import { apiServices, deprecatedNetworks } from './utils'
import { palette } from '../../styles/palette'
import deployments from './networks.json'
import txServiceNetworks from '../ApiReference/tx-service-networks.json'
import css from './styles.module.css'
import SearchIcon from '../../assets/svg/search.svg'
import CrossIcon from '../../assets/svg/cross.svg'
import CloseIcon from '../../assets/svg/close.svg'
import FilterIcon from '../../assets/svg/filter.svg'
import ArrowBackIcon from '../../assets/svg/arrow-back.svg'

export const networks = deployments.filter(
  network => !deprecatedNetworks.includes(network.chainId)
) as Network[]

const modules = deployments
  .map(network =>
    network.modules.map(m => m.moduleName?.split('-').map(capitalize).join(' '))
  )
  .flat(2)
  .filter((v, i, a) => a.indexOf(v) === i)

const versions = networks
  .map(network => network.smartAccounts.map(c => c.version))
  .flat(2)
  .filter((v, i, a) => a.indexOf(v) === i)
  .reverse()

export interface Contract {
  name: string
  version: string
  address?: string
  addresses?: Array<[string, string]>
  chainId: string
  chainName: string
  blockExplorerUrl: string
  moduleName?: string
}

export interface Network {
  name: string
  chainId: number
  shortName: string
  iconUrl: string
  icon?: string
  smartAccounts: Contract[]
  modules: Contract[]
  explorers: Array<{ url: string }>
}

const isMatch = (
  all: string[],
  selected: string[],
  strict?: boolean
): boolean => {
  // No selection means no filter applied
  if (selected.length === 0) {
    return true
  }

  return selected[strict === true ? 'every' : 'some'](item => {
    return all.includes(item)
  })
}

export const _getFilteredNetworks = ({
  networks,
  selectedVersions,
  selectedServices,
  selectedModules
}: {
  networks: Network[]
  selectedVersions: string[]
  selectedServices: string[]
  selectedModules: string[]
}): Network[] =>
  networks.filter(
    network =>
      isMatch(
        network.smartAccounts.map(c => c.version).flat(),
        selectedVersions,
        true
      ) &&
      isMatch(
        txServiceNetworks.map(n => n.chainId).includes(network.chainId)
          ? apiServices(network.chainId.toString()).map(s => s.name)
          : [],
        selectedServices,
        true
      ) &&
      isMatch(
        network.modules
          .map(m => m.moduleName?.split('-').map(capitalize).join(' '))
          .filter((v, i, a) => a.indexOf(v) === i) as string[],
        selectedModules,
        true
      )
  )

const GRID_SPACING: GridProps['spacing'] = {
  xs: 2,
  md: '30px'
}

const PAGE_LENGTH = 12

const getPage = (query: NextRouter['query']): number => {
  const page = Array.isArray(query.page) ? query.page[0] : query.page

  return parseInt(page ?? '1')
}

export const getFilters = (
  query: NextRouter['query'],
  filter: string
): string[] => {
  const filters = Array.isArray(query[filter])
    ? query[filter]
    : ([query[filter] ?? ''] as string[])

  return (
    filters?.map(f => decodeURIComponent(f)).filter(f => f.length !== 0) ?? []
  )
}

const getSearchQuery = (query: NextRouter['query']): string => {
  const searchQuery = Array.isArray(query.search)
    ? query.search[0]
    : query.search
  return decodeURIComponent(searchQuery ?? '')
}

const SupportedNetworks: React.FC = () => {
  const { query, push } = useRouter()
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const isSmOrHigher = useMediaQuery(theme.breakpoints.up('sm'))

  const searchQuery = getSearchQuery(query)
  const selectedVersions = getFilters(query, 'version')
  const selectedServices = getFilters(query, 'service')
  const selectedModules = getFilters(query, 'module')

  const setSelectedFilter = (filters: string[], filterName: string): void => {
    void push(
      {
        query: {
          ...query,
          [filterName]: filters
        }
      },
      undefined,
      { shallow: true }
    )
  }

  const page = getPage(query)

  const onResetSearch = (): void => {
    void push(
      {
        query: {
          ...Object.fromEntries(
            Object.entries(query).filter(([key]) => key !== 'search')
          )
        }
      },
      undefined,
      { shallow: true }
    )
  }

  const onResetFilters = (): void => {
    void push(
      {
        query: {
          ...Object.fromEntries(
            Object.entries(query).filter(
              ([key]) =>
                key !== 'version' && key !== 'service' && key !== 'module'
            )
          )
        }
      },
      undefined,
      { shallow: true }
    )
  }

  const onSelect = (prev: string[], filterName: string) => {
    return (property: string, checked: boolean) => {
      if (checked) {
        setSelectedFilter(prev.concat(property), filterName)
        sendGAEvent('event', 'supported_networks_filter', {
          event_label: property,
          filter_name: filterName
        })
      } else {
        setSelectedFilter(
          prev.filter(item => item !== property),
          filterName
        )
      }
    }
  }

  const onSelectVersion = onSelect(selectedVersions, 'version')
  const onSelectService = onSelect(selectedServices, 'service')
  const onSelectModule = onSelect(selectedModules, 'module')

  const noFilters = useMemo(
    () =>
      selectedServices.length === 0 &&
      selectedVersions.length === 0 &&
      selectedModules.length === 0,

    [selectedServices, selectedVersions, selectedModules]
  )

  // Type filtered results
  const filteredResources = useMemo(() => {
    if (noFilters) {
      return networks
    }

    return _getFilteredNetworks({
      networks,
      selectedVersions,
      selectedServices,
      selectedModules
    })
  }, [noFilters, selectedServices, selectedVersions, selectedModules])

  // Search results
  const searchResults = useNetworksSearch(filteredResources, searchQuery)

  // Paginated filtered/search-based results
  const visibleResults = searchResults.slice(0, PAGE_LENGTH * page)

  const sidebar = (
    <>
      <NextLink
        href='/core-api/safe-contracts-deployment'
        target='_blank'
        rel='noreferrer'
      >
        <Button
          endIcon={<AddIcon sx={{ mr: [1.5, 1] }} />}
          sx={{
            alignItems: 'space-between',
            border: ['none', `solid 1px ${palette.text.dark}`],
            color: 'white',
            mb: 2
          }}
          fullWidth
        >
          <Typography
            sx={{ width: '100%', textAlign: 'left', ml: 1 }}
            color='white'
            variant='caption'
          >
            Add new network
          </Typography>
        </Button>
      </NextLink>
      <SidebarAccordion
        title='Version'
        items={versions}
        selectedItems={selectedVersions}
        onChange={onSelectVersion}
      />
      <SidebarAccordion
        title='Services'
        items={apiServices('1').map(s => s.name)}
        selectedItems={selectedServices}
        onChange={onSelectService}
      />
      <SidebarAccordion
        title='Modules'
        items={modules}
        selectedItems={selectedModules}
        onChange={onSelectModule}
      />
    </>
  )

  const handleScroll = (): void => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (
      scrollPosition > page * (isSmOrHigher ? 1800 : 3000) &&
      visibleResults.length < searchResults.length
    ) {
      void push({ query: { ...query, page: page + 1 } }, undefined, {
        scroll: false
      })
    }
  }, [
    scrollPosition,
    push,
    visibleResults.length,
    searchResults.length,
    query,
    page,
    isSmOrHigher
  ])

  return (
    <>
      <Container>
        <Link
          href='/advanced/smart-account-overview'
          sx={{
            fontSize: '14px',
            fontWeight: '400',
            textDecoration: 'none',
            transition: 'color 0.1s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'grey.600',
            mt: 2
          }}
        >
          ← Go to Advanced
        </Link>
        <Grid container mb={8} mt={4}>
          <Grid
            item
            container
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
          >
            <Typography textAlign='center' variant='h1' fontSize='42px' mb={4}>
              Supported Networks
            </Typography>
            <TextField
              className={css.searchField}
              variant='outlined'
              placeholder='Search by network name, chain ID, or contract address'
              InputProps={{
                style: {
                  color: 'white',
                  backgroundColor: 'rgba(28, 28, 28, 1)',
                  borderRadius: '8px',
                  border: 'none'
                },
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  searchQuery.length !== 0 ? (
                    <InputAdornment position='end'>
                      <IconButton onClick={onResetSearch}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined
              }}
              value={searchQuery}
              sx={{ border: 'none', width: ['80%', '500px'], mt: [2, 0] }}
              onChange={e => {
                if (e.target.value.length === 0) onResetSearch()
                else setSelectedFilter([e.target.value], 'search')
              }}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={GRID_SPACING}>
          <Grid
            item
            xs={12}
            md={3}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography>
              {searchResults.length}{' '}
              <Typography color='primary.light' component='span'>
                result{searchResults.length === 1 ? '' : 's'}
              </Typography>
            </Typography>
            {!noFilters && (
              <Link
                onClick={onResetFilters}
                className={css.reset}
                variant='caption'
                sx={{
                  textDecoration: 'none',
                  color: 'text.primary',
                  cursor: 'pointer'
                }}
              >
                Reset all
              </Link>
            )}
            <Button
              variant='outlined'
              className={css.filterButton}
              onClick={() => {
                setIsFilterDrawerOpen(true)
              }}
              sx={{ display: ['flex', 'flex', 'none'] }}
            >
              <FilterIcon />
              Filter
            </Button>
          </Grid>

          <Grid item xs={12} md={9} className={css.chipContainer}>
            {selectedVersions.map(version => (
              <Chip
                key={version}
                label={version}
                onDelete={() => {
                  onSelectVersion(version, false)
                }}
                deleteIcon={<CrossIcon />}
                sx={{
                  borderRadius: '4px',
                  height: '23px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              />
            ))}
            {selectedServices.map(service => (
              <Chip
                key={service}
                label={service}
                onDelete={() => {
                  onSelectService(service, false)
                }}
                deleteIcon={<CrossIcon />}
                sx={{
                  borderRadius: '4px',
                  height: '23px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Grid>

          <Grid item sx={{ display: ['none', 'none', 'block'] }} md={3}>
            {sidebar}
          </Grid>

          <Grid item xs={12} md={9} mb={6}>
            {query.expand !== undefined ? (
              <NetworkModal versions={versions} />
            ) : visibleResults.length > 0 ? (
              <Grid
                container
                spacing={GRID_SPACING}
                display='flex'
                alignContent='flex-start'
              >
                {visibleResults.map((network, idx) => (
                  <Grid item xs={12} sm={6} key={network.name + idx}>
                    <NetworkCard {...network} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container flexDirection='column' alignItems='center'>
                <SearchIcon />
                <Typography variant='h4' my={2}>
                  No results found for{' '}
                  {searchQuery.length !== 0
                    ? `"${searchQuery}"`
                    : 'selected filters'}
                </Typography>
                <Typography color='primary.light'>
                  Try searching something else
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Dialog fullScreen open={isFilterDrawerOpen}>
          <AppBar className={css.appBar}>
            <Toolbar disableGutters>
              <IconButton
                onClick={() => {
                  setIsFilterDrawerOpen(false)
                }}
                className={css.backButton}
                disableRipple
              >
                <ArrowBackIcon />
              </IconButton>
              <Divider orientation='vertical' />
              <Box p={2}>Filter</Box>
            </Toolbar>
          </AppBar>

          <div className={css.filterWrapper}>
            {sidebar}

            <span style={{ flex: 1 }} />

            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={() => {
                setIsFilterDrawerOpen(false)
              }}
            >
              Show results
            </Button>
          </div>
        </Dialog>
      </Container>
    </>
  )
}

export default SupportedNetworks
