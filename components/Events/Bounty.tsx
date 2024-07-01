import Link from 'next/link'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const Bounty: React.FC<{
  width: string
  icon: JSX.Element
  name: string
  description: string
  prize?: string
  link?: string
  linkLabel?: string
}> = ({ width, icon, name, description, prize, link, linkLabel }) => (
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
    {link != null && (
      <Link href={link} target='_blank' rel='noopener noreferrer'>
        <Typography
          sx={{
            mt: '20px',
            '@media (min-width: 600px)': {
              fontSize: '18px',
              fontWeight: 600
            }
          }}
        >
          {linkLabel} {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
        </Typography>
      </Link>
    )}
  </Grid>
)

export default Bounty
