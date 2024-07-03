import Img from 'next/image'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import type { TeamMemberType, WorkshopType } from './types'
import css from './styles.module.css'

const Workshop: React.FC<{
  workshop: WorkshopType
  speaker: TeamMemberType
}> = ({ workshop, speaker }) => (
  <Box
    sx={{
      width: ' 100%',
      p: 4,
      border: 'solid 1px',
      borderColor: ({ palette }) => palette.border.light,
      borderRadius: '8px'
    }}
  >
    <Button
      variant='outlined'
      disabled
      sx={{
        fontSize: '16px',
        fontWeight: 400,
        textTransform: 'none',
        '&.Mui-disabled': {
          color: ({ palette }) => palette.primary.main,
          borderColor: ({ palette }) => palette.border.main
        }
      }}
    >
      {new Date(workshop.start).toDateString()} -{' '}
      {new Date(workshop.start).toLocaleTimeString().slice(0, -3)} -{' '}
      {new Date(workshop.end).toLocaleTimeString().slice(0, -3)}
    </Button>
    <Typography sx={{ my: 4 }} className={css.heading2}>
      {workshop.title}
    </Typography>
    <Typography color='text.dark' className={css.body}>
      {workshop.location}
    </Typography>
    <Grid container mt={3}>
      <Img
        style={{ borderRadius: '40px' }}
        src={speaker.image}
        alt='speaker'
        width={80}
      />
      <Grid
        container
        flexDirection='column'
        justifyContent='center'
        ml={2}
        width='calc(100% - 100px)'
      >
        <Typography className={css.heading3}>{speaker.name}</Typography>
        <Typography color='text.dark' sx={{ mt: 1 }} className={css.body}>
          {speaker.position}
        </Typography>
      </Grid>
    </Grid>
  </Box>
)

export default Workshop
