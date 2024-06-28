import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const Bounty: React.FC<{
  width: string
  icon: JSX.Element
  name: string
  description: string
  prize: string
}> = ({ width, icon, name, description, prize }) => (
  <Grid
    container
    flexDirection='column'
    sx={{
      p: 4,
      width,
      border: 'solid 1px',
      borderColor: ({ palette }) => palette.border.light,
      borderRadius: '8px'
    }}
  >
    {icon}
    <Typography
      sx={{
        mt: '30px',
        '@media (min-width: 600px)': {
          fontSize: '24px',
          fontWeight: 400
        }
      }}
    >
      {name}
    </Typography>
    <Typography
      color='text.dark'
      sx={{
        my: '40px',
        '@media (min-width: 600px)': {
          fontSize: '20px',
          fontWeight: 300
        }
      }}
    >
      {description}
    </Typography>
    <Typography
      sx={{
        '@media (min-width: 600px)': {
          fontSize: '24px',
          fontWeight: 400
        }
      }}
    >
      {prize}
    </Typography>{' '}
  </Grid>
)

export default Bounty
