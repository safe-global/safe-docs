import Img from 'next/image'
import Link from 'next/link'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import eventData from './event-data.json'
import css from './styles.module.css'
import DevDiamond from '../../assets/diamond-dev.png'

const Survey: React.FC = () => (
  <Grid container sx={{ maxWidth: '1440px', px: '30px' }}>
    <Grid
      container
      justifyContent='space-between'
      alignItems='center'
      mt='200px'
      mb='100px'
    >
      <Grid item width={1 / 2} display={['none', 'flex']}>
        <Img src={DevDiamond} width={600} alt='dev-diamond' />
      </Grid>
      <Grid item width={[1, 1 / 2]}>
        <Grid container flexDirection='column'>
          <Typography variant='h2' className={css.heading}>
            Share your thoughts!
          </Typography>
          <Typography sx={{ my: '40px' }} className={css.body}>
            Take a moment to fill out our survey and let us know about your
            experience with Safe Documentation.
          </Typography>
          <Link href={eventData.url} target='_blank' rel='noopener noreferrer'>
            <Typography className={css.link}>
              Take survey {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
)

export default Survey
