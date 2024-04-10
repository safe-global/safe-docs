import { useContext } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

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
        overflow: 'scroll',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }}
    >
      <Method method={method} sx={{ m: 1 }} />
      <Box sx={{ width: 'calc(100% - 68px)', mt: 0.8 }}>
        <Box
          component='span'
          sx={{ color: ({ palette }) => palette.grey[600] }}
        >
          {network}
        </Box>
        {path.replace(/{/g, '\\{').replace(/}/g, '\\}')}
      </Box>
    </Grid>
  )
}

export default Path
