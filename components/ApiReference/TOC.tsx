import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import { useCurrentTocIndex } from '../../lib/mdx'
import { theme } from '../../styles/theme'
import Method from './Method'

export interface Heading {
  text: string
  link: string
  children?: Heading[]
  method?: string
}

export const tocWidthMd = 250
export const tocWidthSm = 200
export const navHeight = 94

const TableOfContents: React.FC<{ headings: Heading[] }> = ({ headings }) => {
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
        maxWidth: [tocWidthSm.toString() + 'px', tocWidthMd.toString() + 'px'],
        borderRight: '1px solid #2e3035'
      }}
    >
      <Grid item sx={{ height: '100%' }}>
        {headings.map((heading, index) => (
          <Grid
            item
            sx={{
              width: [
                tocWidthSm.toString() + 'px',
                tocWidthMd.toString() + 'px'
              ]
            }}
            key={heading.text}
          >
            <Accordion
              disableGutters
              expanded={
                currentIndex === heading.link ||
                heading.children?.some(child => currentIndex === child.link)
              }
              sx={{
                '&.Mui-expanded': { margin: '0px' },
                backgroundColor: 'transparent',
                borderRadius: '5px',
                boxShadow: 'none',
                ':before': {
                  backgroundColor: 'transparent'
                }
              }}
              // disabled={accordion.disabled}
            >
              <AccordionSummary
                sx={{
                  color: 'text.primary',
                  borderRadius: '5px',
                  my: -1,
                  backgroundColor:
                    currentIndex === heading.link
                      ? theme.palette.background.light
                      : 'transparent'
                }}
                aria-controls={`panel${index}d-content`}
                id={`panel${index}d-header`}
              >
                <Link
                  href={heading.link}
                  color={
                    currentIndex === heading.link ? 'text.primary' : 'grey.400'
                  }
                  sx={{
                    fontSize: '14px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    transition: 'color 0.1s',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {heading.text.length > 20
                    ? heading.text.slice(0, 20) + '...'
                    : heading.text}
                </Link>
              </AccordionSummary>
              {heading.children?.map((child, index) => (
                <AccordionDetails
                  key={index}
                  sx={{
                    textAlign: 'justify',
                    borderRadius: '5px',
                    mr: 2,
                    pb: 1,
                    backgroundColor:
                      currentIndex === child.link
                        ? theme.palette.background.light
                        : 'transparent'
                  }}
                >
                  <Link
                    href={child.link}
                    color={
                      currentIndex === child.link ? 'text.primary' : 'grey.600'
                    }
                    sx={{
                      ml: 2,
                      fontSize: '14px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'color 0.1s',
                      '&:hover': {
                        color: 'primary.main'
                      },
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {child.text.length > 20
                      ? child.text.slice(0, 20) + '...'
                      : child.text}
                    <Method method={child.method} />
                  </Link>
                </AccordionDetails>
              ))}
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

export default TableOfContents
