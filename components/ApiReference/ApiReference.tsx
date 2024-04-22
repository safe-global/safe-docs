import { useState } from 'react'
import { renderToString } from 'react-dom/server'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/icons-material/Menu'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChevronLeft from '@mui/icons-material/ChevronLeft'

import TOC from './TOC'

import {
  getHeadingsFromHtml,
  MDXComponents,
  useCurrentTocIndex
} from '../../lib/mdx'
import Mdx from './generated-reference.mdx'
import { NetworkProvider } from './Network'
import css from './styles.module.css'

const renderedMdx = <Mdx components={MDXComponents} />
const contentString = renderToString(renderedMdx)
const headings = getHeadingsFromHtml(contentString)

const ApiReference: React.FC = () => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const currentIndex = useCurrentTocIndex(headings, 100)

  return (
    <>
      <Grid container justifyContent='space-between'>
        <Grid
          item
          container
          display={['none', 'flex']}
          minWidth='200px'
          sm={2.7}
        >
          <TOC headings={headings} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={9.2}
          pr={1}
          maxWidth={['100%', 'calc(100% - 200px - 16px)']}
        >
          <NetworkProvider>
            <Button
              variant='outlined'
              sx={{
                borderRadius: '100px',
                mt: 2,
                width: '48px',
                height: '48px',
                minWidth: '48px',
                px: 0.8,
                position: 'fixed',
                bottom: 60,
                right: 17,
                zIndex: 1000,
                backgroundColor: 'background.paper',
                color: 'text.primary',
                display: ['block', 'none'],
                '&:hover': {
                  backgroundColor: 'background.paper'
                }
              }}
              onClick={() => {
                setIsFilterDrawerOpen(true)
              }}
            >
              <Menu />
            </Button>
            <Button
              variant='outlined'
              sx={{
                borderRadius: '100px',
                mt: 2,
                width: '48px',
                height: '48px',
                minWidth: '48px',
                px: 0.8,
                position: 'fixed',
                bottom: [120, 60],
                right: 17,
                zIndex: 1000,
                backgroundColor: 'background.paper',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'background.paper'
                },
                opacity: currentIndex !== '' ? 1 : 0,
                transition: 'opacity 0.3s'
              }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <ChevronLeft sx={{ rotate: '90deg' }} />
            </Button>
            {renderedMdx}
          </NetworkProvider>
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
            <Box p={2}>API Contents</Box>
          </Toolbar>
        </AppBar>
        <TOC
          headings={headings}
          onClick={() => {
            setIsFilterDrawerOpen(false)
          }}
        />
      </Dialog>
    </>
  )
}

export default ApiReference
