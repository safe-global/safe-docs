import Img from 'next/image'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import type { TeamMemberType } from './types'

const TeamMember: React.FC<{ member: TeamMemberType, width: string }> = ({
  member,
  width
}) => (
  <Grid
    container
    flexDirection='column'
    alignItems='center'
    sx={{
      width,
      p: 4,
      border: 'solid 1px',
      borderColor: ({ palette }) => palette.border.light,
      borderRadius: '8px'
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
        textAlign: 'center',
        '@media (min-width: 600px)': {
          fontSize: '24px',
          fontWeight: 400
        }
      }}
    >
      {member.name}
    </Typography>
    <Typography
      color='text.dark'
      sx={{
        textAlign: 'center',
        mt: 1,
        '@media (min-width: 600px)': {
          fontSize: '20px',
          fontWeight: 300
        }
      }}
    >
      {member.position}
    </Typography>
  </Grid>
)

export default TeamMember
