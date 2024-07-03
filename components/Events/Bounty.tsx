import Link from 'next/link'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import css from './styles.module.css'

const Bounty: React.FC<{
  width: string | string[]
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
      borderRadius: '8px',
      mt: ['30px', '0px']
    }}
  >
    {icon}
    <Typography sx={{ mt: '30px' }} className={css.heading3}>
      {name}
    </Typography>
    <Typography color='text.dark' sx={{ my: '40px' }} className={css.body}>
      {description}
    </Typography>
    <Typography className={css.heading3}>{prize}</Typography>{' '}
    {link != null && (
      <Link href={link} target='_blank' rel='noopener noreferrer'>
        <Typography className={css.link} sx={{ mt: '20px' }}>
          {linkLabel} {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
        </Typography>
      </Link>
    )}
  </Grid>
)

export default Bounty
