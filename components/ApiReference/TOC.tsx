import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { type Theme, useMediaQuery } from '@mui/material'

import { useCurrentTocIndex } from '../../lib/mdx'
import { theme } from '../../styles/theme'
import Method from './Method'

export interface Heading {
  text: string
  link: string
  children?: Heading[]
  method?: string
}

export const tocWidthMd = 230
export const tocWidthSm = 200
export const navHeight = 94

const TableOfContents: React.FC<{
  headings: Heading[]
  onClick?: () => void
}> = ({ headings, onClick }) => {
  const currentIndex = useCurrentTocIndex(headings, navHeight)

  return (
    <Grid
      container
      item
      flexDirection='column'
      sx={{
        height: `calc(100vh - ${navHeight}px - 16px)`,
        position: 'sticky',
        top: navHeight,
        overflowX: 'hidden',
        overflowY: 'scroll',
        ml: [0, -1],
        pl: [2, 0],
        pr: 2
      }}
    >
      <Grid item sx={{ height: '100%', width: '100%' }}>
        <AccordionDetails
          sx={{
            textAlign: 'justify',
            borderRadius: '5px',
            mr: 2,
            mt: 2,
            mb: 1.5,
            p: 1,
            pl: 1,
            color: 'grey.500',
            backgroundColor: 'transparent',
            '&:hover': {
              color: 'text.primary',
              backgroundColor: 'rgba(224, 255, 240, 0.05)'
            },
            transition: '0.2s',
            display: ['none', 'block']
          }}
        >
          <Link
            href='/advanced/api-service-architecture'
            color='grey.600'
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              textDecoration: 'none',
              transition: 'color 0.1s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'inherit'
            }}
          >
            ← Go to Advanced
          </Link>
        </AccordionDetails>
        {headings.map((heading, index) => (
          <TocMenuItem {...{ heading, currentIndex, onClick }} key={index} />
        ))}
      </Grid>
    </Grid>
  )
}

export default TableOfContents

const TocMenuItem: React.FC<{
  heading: Heading
  currentIndex: string
  onClick?: () => void
}> = ({ heading, currentIndex, onClick }) => {
  const isSmOrBigger = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  )

  return (
    <Grid item container key={heading.text}>
      <Accordion
        disableGutters
        {...(isSmOrBigger && {
          expanded:
            currentIndex === heading.link ||
            heading.children?.some(child => currentIndex === child.link)
        })}
        sx={{
          '&.Mui-expanded': { margin: '0px' },
          backgroundColor: 'transparent',
          borderRadius: '5px',
          width: '100%',
          maxWidth: ['unset', 'unset', tocWidthMd.toString() + 'px'],
          boxShadow: 'none',
          ':before': {
            backgroundColor: 'transparent'
          }
        }}
      >
        <AccordionSummary
          sx={{
            color: currentIndex === heading.link ? 'text.primary' : 'grey.600',
            borderRadius: '5px',
            height: '62px',
            my: -1,
            mx: 0,
            px: 0,
            backgroundColor: 'transparent',
            width: '100%'
          }}
          aria-controls={`panel${currentIndex}d-content`}
          id={`panel${currentIndex}d-header`}
        >
          <Link
            href={heading.link}
            color='text.primary'
            sx={{
              ml: 1,
              fontSize: '14px',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'color 0.1s',
              width: '100%',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            {heading.text}
          </Link>
        </AccordionSummary>
        {heading.children?.map((child, index) => (
          <AccordionDetails
            key={index}
            sx={{
              textAlign: 'justify',
              borderRadius: '5px',
              mr: 2,
              mb: 0.5,
              p: 1,
              pl: 1,
              width: '100%',
              color: currentIndex === child.link ? 'primary.main' : 'grey.500',
              backgroundColor:
                currentIndex === child.link
                  ? theme.palette.background.light
                  : 'transparent',
              '&:hover': {
                color:
                  currentIndex === child.link ? 'primary.main' : 'text.primary',
                backgroundColor: 'rgba(224, 255, 240, 0.05)'
              },
              transition: '0.2s'
            }}
            {...(!isSmOrBigger && { onClick })}
          >
            <Link
              href={child.link}
              sx={{
                fontSize: '14px',
                fontWeight: currentIndex === child.link ? '700' : '400',
                textDecoration: 'none',
                transition: 'color 0.1s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'inherit',
                width: '100%'
              }}
            >
              <Grid container justifyContent='space-between' wrap='nowrap'>
                <Grid item sx={{ textAlign: 'left' }}>
                  {child.text}
                </Grid>
                <Grid item justifyContent='flex-end'>
                  <Method method={child.method} />
                </Grid>
              </Grid>
            </Link>
          </AccordionDetails>
        ))}
      </Accordion>
    </Grid>
  )
}
