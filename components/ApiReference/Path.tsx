import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { CopyToClipboard } from 'nextra/components'
import { useContext } from 'react'

import Method from './Method'
import { NetworkContext } from './Network'

const Path: React.FC<{ path: string; method: string }> = ({ path, method }) => {
  const [network] = useContext(NetworkContext)
  return (
    <Grid
      container
      sx={{
        border: ({ palette }) => `1px solid ${palette.grey[800]}`,
        borderRadius: '8px',
        mb: 2,
        fontSize: '14px',
        whiteSpace: 'nowrap'
      }}
    >
      <Method method={method} sx={{ m: 1 }} />
      <Box
        sx={{
          width: `calc(100% - ${method.length * 8}px - 70px)`,
          mt: 0.8,
          overflow: 'auto'
        }}
      >
        {path.split('/').map((p, i) => {
          const isParam = p.startsWith('{')
          return (
            <span key={i}>
              <Box
                component='span'
                sx={{
                  color: isParam
                    ? ({ palette }) => palette.warning.main
                    : 'inherit',
                  fontWeight: isParam ? 'bold' : 'inherit'
                }}
              >
                {p}
                {i < path.split('/').length - 1 && !isParam && <span>/</span>}
              </Box>
              {isParam && <span>/</span>}
            </span>
          )
        })}
      </Box>
      <Box
        sx={{
          mt: 0.6
        }}
      >
        <CopyToClipboard getValue={() => `${network}${path}`} />
      </Box>
    </Grid>
  )
}

export default Path
