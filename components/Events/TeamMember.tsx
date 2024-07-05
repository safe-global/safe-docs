import Img from 'next/image'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import css from './styles.module.css'
import type { TeamMemberType } from './types'

const TeamMember: React.FC<{
  member: TeamMemberType
  width: string | string[]
}> = ({ member, width }) => (
  <Grid
    container
    flexDirection='column'
    alignItems='center'
    sx={{
      width,
      p: 4,
      border: 'solid 1px',
      borderColor: ({ palette }) => palette.border.light,
      borderRadius: '8px',
      mt: ['30px', '30px', '0px']
    }}
  >
    <Img
      style={{ borderRadius: '40px' }}
      width={80}
      src={member.image}
      alt={member.name}
    />
    <Typography
      sx={{
        mt: 3,
        textAlign: 'center'
      }}
      className={css.heading3}
    >
      {member.name}
    </Typography>
    <Typography
      color='text.dark'
      sx={{
        textAlign: 'center',
        mt: 1
      }}
      className={css.body}
    >
      {member.position}
    </Typography>
  </Grid>
)

export default TeamMember
