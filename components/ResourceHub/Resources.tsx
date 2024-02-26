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
  Container
} from '@mui/material'
import type { GridProps } from '@mui/material'
import { Fragment, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import type { NextRouter } from 'next/router'
import AddIcon from '@mui/icons-material/Add'

import SearchIcon from '../../assets/svg/search.svg'
import CrossIcon from '../../assets/svg/cross.svg'
import CloseIcon from '../../assets/svg/close.svg'
import FilterIcon from '../../assets/svg/filter.svg'
import ArrowBackIcon from '../../assets/svg/arrow-back.svg'
import { useResourceSearch } from './useResourceSearch'
import { SidebarAccordion } from './SidebarAccordion'
import { ProjectCard } from './Card'
import companyResources from './company-resources.json'
import communityResources from './community-resources.json'
import css from './styles.module.css'

export const uploadResourceUrl =
  'https://github.com/safe-global/safe-docs/issues/new?assignees=&labels=resource-hub&projects=&template=resource-hub-submission.yml&title=%5BResource+Hub%5D+'

const resources = [
  ...communityResources.map(r => ({ ...r, origin: 'Community' })),
  ...companyResources.map(r => ({ ...r, origin: 'Safe Team' }))
]

export interface KnowledgeResource {
  url: string
  name: string
  type: string
  date: string
  origin: string
  abstract?: string
  tags: string[]
}

const getUniqueStrings = (entries: string[]): string[] => {
  const uniqueEntries = new Set(entries)
  return Array.from(uniqueEntries).sort()
}

const isMatch = (all: string[], selected: string[]): boolean => {
  // No selection means no filter applied
  if (selected.length === 0) {
    return true
  }

  return selected.some(item => {
    return all.includes(item)
  })
}

const isStrictMatch = (all: string[], selected: string[]): boolean => {
  // No selection means no filter applied
  if (selected.length === 0) {
    return true
  }

  return selected.every(item => {
    return all.includes(item)
  })
}

export const _getFilteredResources = ({
  resources,
  selectedTypes,
  selectedSources,
  selectedTags
}: {
  resources: KnowledgeResource[]
  selectedTypes: string[]
  selectedSources: string[]
  selectedTags: string[]
}): KnowledgeResource[] =>
  resources.filter(
    resource =>
      isMatch([resource.type], selectedTypes) &&
      isMatch([resource.origin], selectedSources) &&
      isStrictMatch(resource.tags, selectedTags)
  )

const SpecificTypeFilter = ({
  category,
  onClick
}: {
  category: KnowledgeResource['type']
  onClick: (category: KnowledgeResource['type']) => void
}): JSX.Element => {
  return (
    <button
      className={css.baseButton}
      onClick={() => {
        onClick(category)
      }}
    >
      {category}
    </button>
  )
}

const GRID_SPACING: GridProps['spacing'] = {
  xs: 2,
  md: '30px'
}

const PAGE_LENGTH = 12

const getPage = (query: NextRouter['query']): number => {
  const page = Array.isArray(query.page) ? query.page[0] : query.page

  return parseInt(page ?? '1')
}

const getFilters = (query: NextRouter['query'], filter: string): string[] => {
  const filters = Array.isArray(query[filter])
    ? (query[filter] as string[])
    : ([query[filter] ?? ''] as string[])

  return (
    filters?.map(s => decodeURIComponent(s)).filter(s => s.length !== 0) ?? []
  )
}

const getSearchQuery = (query: NextRouter['query']): string => {
  const searchQuery = Array.isArray(query.search)
    ? query.search[0]
    : query.search
  return decodeURIComponent(searchQuery ?? '')
}

export const Resources: React.FC = () => {
  const { query, push } = useRouter()
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  const searchQuery = getSearchQuery(query)
  const selectedTypes = getFilters(query, 'type')
  const selectedSources = getFilters(query, 'source')
  const selectedTags = getFilters(query, 'tag')

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

  // Types
  const allTypes = resources.flatMap(resource => resource.type)
  const uniqueTypes = getUniqueStrings(allTypes)

  // Sources
  const allSources = resources.flatMap(resource => resource.origin)
  const uniqueSources = getUniqueStrings(allSources)

  // Tags
  const allTags = resources.flatMap(resource => resource.tags)
  const uniqueTags = getUniqueStrings(allTags)

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
              ([key]) => key !== 'tag' && key !== 'type' && key !== 'source'
            )
          )
        }
      },
      undefined,
      { shallow: true }
    )
  }

  const onSelect =
    (prev: string[], filterName: string) =>
      (property: string, checked: boolean) => {
        if (checked) {
          setSelectedFilter(prev.concat(property), filterName)
        } else {
          setSelectedFilter(
            prev.filter(item => item !== property),
            filterName
          )
        }
      }

  const onSelectType = onSelect(selectedTypes, 'type')
  const onSelectSource = onSelect(selectedSources, 'source')
  const onSelectTag = onSelect(selectedTags, 'tag')

  const toggleSpecificTag = (tag: string): void => {
    onSelectTag(tag, !selectedTags.includes(tag))
  }

  const noFilters = useMemo(() => {
    return (
      selectedTypes.length === 0 &&
      selectedSources.length === 0 &&
      selectedTags.length === 0
    )
  }, [selectedTypes, selectedSources, selectedTags])

  // Type filtered results
  const filteredResources = useMemo(() => {
    if (noFilters) {
      return resources
    }

    return _getFilteredResources({
      resources,
      selectedTypes,
      selectedSources,
      selectedTags
    })
  }, [noFilters, selectedTypes, selectedSources, selectedTags])

  // Search results
  const searchResults = useResourceSearch(filteredResources, searchQuery)

  // Paginated filtered/search-based results
  const visibleResults = searchResults.slice(0, PAGE_LENGTH * page)

  const shouldShowMoreButton = visibleResults.length < searchResults.length

  const sidebar = (
    <>
      <NextLink href={uploadResourceUrl} target='_blank' rel='noreferrer'>
        <Button
          endIcon={<AddIcon sx={{ mr: [1.5, 1] }} />}
          sx={{
            alignItems: 'space-between',
            border: ['none', 'solid 1px rgba(161, 163, 167, 1)'],
            color: 'white',
            my: 2
          }}
          fullWidth
        >
          <Typography
            sx={{ width: '100%', textAlign: 'left', ml: 1 }}
            color='white'
            variant='caption'
          >
            Suggest new resource
          </Typography>
        </Button>
      </NextLink>
      <SidebarAccordion
        title='Resource type'
        items={uniqueTypes}
        selectedItems={selectedTypes}
        onChange={onSelectType}
      />

      <SidebarAccordion
        title='Source'
        items={uniqueSources}
        selectedItems={selectedSources}
        onChange={onSelectSource}
      />

      <SidebarAccordion
        title='Topics'
        items={uniqueTags.sort((a, b) =>
          a === '4337' && b === 'Introduction'
            ? -1
            : a === 'Introduction' && b === '4337'
              ? 1
              : a === 'Introduction'
                ? -1
                : b === 'Introduction'
                  ? 1
                  : a.localeCompare(b)
        )}
        selectedItems={selectedTags}
        onChange={onSelectTag}
      />
    </>
  )

  return (
    <Container>
      <Grid container mb={8} mt={4}>
        <Grid
          item
          container
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
        >
          <Typography textAlign='center' variant='h1' mb={[2, 0]}>
            Resource Hub
          </Typography>
          <TextField
            className={css.searchField}
            variant='outlined'
            placeholder='Search by name, description, or tag'
            InputProps={{
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
            sx={{ border: 'none', width: '80%', mt: [2, 0] }}
            onChange={e => {
              if (e.target.value.length === 0) onResetSearch()
              else setSelectedFilter([e.target.value], 'search')
            }}
            fullWidth
          />
          <Typography textAlign={['center', 'left']} mt={2}>
            <Typography component='span' color='primary.light'>
              Example:
            </Typography>{' '}
            {uniqueTags.slice(0, 3).map((primaryTag, idx, { length }) => {
              return (
                <Fragment key={primaryTag + idx}>
                  <SpecificTypeFilter
                    category={primaryTag}
                    onClick={toggleSpecificTag}
                  />
                  {idx !== length - 1 && ', '}
                </Fragment>
              )
            })}
          </Typography>
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
          {selectedTypes.map(category => (
            <Chip
              key={category}
              label={category}
              onDelete={() => {
                onSelectType(category, false)
              }}
              sx={{
                borderRadius: '4px',
                height: '23px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              deleteIcon={<CrossIcon />}
            />
          ))}

          {selectedSources.map(integration => (
            <Chip
              key={integration}
              label={integration}
              onDelete={() => {
                onSelectSource(integration, false)
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

          {selectedTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => {
                onSelectTag(tag, false)
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

        <Grid item xs={12} md={9}>
          {visibleResults.length > 0 ? (
            <Grid
              container
              spacing={GRID_SPACING}
              display='flex'
              alignContent='flex-start'
            >
              {visibleResults.map((resource, idx) => (
                <Grid item xs={12} md={6} key={resource.name + idx}>
                  <ProjectCard {...resource} />
                </Grid>
              ))}
              {shouldShowMoreButton && (
                <Grid
                  item
                  xs={12}
                  mt={{ xs: 2, md: 0 }}
                  display='flex'
                  justifyContent='center'
                >
                  <NextLink
                    href={{ query: { page: page + 1 } }}
                    shallow
                    // Pagination marker for search engines
                    rel='next'
                    scroll={false}
                  >
                    <Button variant='contained' size='large'>
                      Show more
                    </Button>
                  </NextLink>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography
                  variant='body2'
                  maxWidth={470}
                  mb={{ md: 8 }}
                  mx='auto'
                  textAlign='center'
                >
                  Listings are not endorsements and are only for educational
                  purposes.
                </Typography>
              </Grid>
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
  )
}

export default Resources
