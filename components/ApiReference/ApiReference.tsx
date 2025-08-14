import { useEffect, useState } from 'react'
import { useData } from 'nextra/ssg'
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
import ExpandLess from '@mui/icons-material/ExpandLess'

import TOC, { type Heading } from './TOC'
import { MDXComponents, useCurrentTocIndex } from '../../lib/mdx'
import { NetworkProvider } from './Network'
import css from './styles.module.css'

const ApiReference: React.FC<{ networkName: string }> = ({ networkName }) => {
  const { headings } = useData()
  const [Mdx, setMdx] = useState<React.ComponentType<{
    components: typeof MDXComponents
  }> | null>(null)
  const renderedMdx = Mdx != null ? <Mdx components={MDXComponents} /> : null
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const currentIndex = useCurrentTocIndex(headings as Heading[], 100)

  useEffect(() => {
    void (async () => {
      const { default: Component } = await import(
        `./generated/${networkName}-reference.mdx`
      )
      setMdx(() => Component)
    })()
  }, [networkName])

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
          <TOC headings={headings} networkName={networkName} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={9.2}
          pr={1}
          maxWidth={['100%', 'calc(100% - 200px - 16px)']}
        >
          <NetworkProvider networkName={networkName}>
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
                backgroundColor: 'background.dark',
                border: 'none',
                color: 'text.primary',
                display: ['block', 'none'],
                '&:hover': {
                  backgroundColor: 'background.dark'
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
              disableRipple
              sx={{
                borderRadius: '100px',
                mt: 2,
                width: '48px',
                height: '48px',
                minWidth: '48px',
                px: 0.8,
                position: 'fixed',
                bottom: [120, 60],
                right: 16,
                zIndex: 1000,
                opacity: currentIndex !== '' ? 1 : 0,
                transition: 'opacity 0.3s',
                border: 'none',
                backgroundColor: 'background.dark',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'background.dark'
                }
              }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <ExpandLess />
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
          networkName={networkName}
          onClick={() => {
            setIsFilterDrawerOpen(false)
          }}
        />
      </Dialog>
    </>
  )
}

export default ApiReference
