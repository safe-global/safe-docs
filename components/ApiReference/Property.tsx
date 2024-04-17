import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { theme } from '../../styles/theme'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Property: React.FC<{ property: any, required?: boolean }> = ({
  property,
  required
}) => (
  <Grid
    container
    pl={2}
    my={1}
    sx={{ color: ({ palette }) => palette.grey[400] }}
  >
    <Grid item xs={6}>
      <code style={{ fontSize: '14px' }}>{property.name}</code>
      {required === true && (
        <>
          {' - '}
          <code style={{ color: theme.palette.error.main, fontSize: '14px' }}>
            required
          </code>
        </>
      )}
    </Grid>
    <Grid item xs={6} flexDirection='column'>
      <code style={{ fontSize: '14px' }}>{property.value?.type}</code>
      <Typography
        variant='body1'
        color='grey.300'
        sx={{
          '@media (min-width:600px)': {
            fontSize: '14px'
          }
        }}
      >
        {property.value?.description}
      </Typography>
    </Grid>
  </Grid>
)

export default Property
