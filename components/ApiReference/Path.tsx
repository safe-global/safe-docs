import { useContext } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { CopyToClipboard } from 'nextra/components'

import Method from './Method'
import { NetworkContext } from './Network'

const Path: React.FC<{ path: string, method: string }> = ({ path, method }) => {
  const [network] = useContext(NetworkContext)
  return (
    <Grid
      container
      sx={{
        border: ({ palette }) => `1px solid ${palette.grey[800]}`,
        borderRadius: '8px',
        pl: 1,
        fontSize: '14px',
        whiteSpace: 'nowrap'
      }}
    >
      <Method method={method} sx={{ m: 1 }} />
      <Box
        sx={{
          width: `calc(100% - ${method.length * 8}px - 70px)`,
          mt: 0.8,
          overflow: 'scroll'
        }}
      >
        /api/{path.replace(/{/g, '\\{').replace(/}/g, '\\}')}
      </Box>
      <Box
        sx={{
          mt: 0.6
        }}
      >
        <CopyToClipboard getValue={() => `${network}/api${path}`} />
      </Box>
    </Grid>
  )
}

export default Path
