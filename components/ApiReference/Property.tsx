import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Property: React.FC<{ property: any, required?: boolean }> = ({
  property,
  required
}) => (
  <Grid container pl={2} sx={{ color: ({ palette }) => palette.grey[500] }}>
    <Grid xs={9}>
      <code>{property.name}</code>
      {required === true && (
        <>
          {' - '}
          <code style={{ color: 'red', fontSize: '14px' }}>required</code>
        </>
      )}
    </Grid>
    <Grid xs={3}>
      <Typography variant='body1'>{property.value?.type}</Typography>
    </Grid>
  </Grid>
)

export default Property
