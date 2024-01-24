// import { signal } from '@preact/signals'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Grid from '@mui/material/Grid'

import FeedbackBad from '../../assets/svg/feedback-bad.svg'
import FeedbackOk from '../../assets/svg/feedback-ok.svg'
import FeedbackGood from '../../assets/svg/feedback-good.svg'

// const feedbackState = signal(JSON.parse(window.localStorage.getItem('feedback') ?? '{}'))

const Feedback: React.FC = () => (
  <Grid container justifyContent='center'>
    <Grid container alignItems='center' width='380px'>
      <Typography variant='caption' fontWeight='bold' color='white'>
        Was this page helpful?
      </Typography>
      <Grid>
        {feedbackButtons.map(button => (
          <FeedbackButton
            key={button.title}
            title={button.title}
            background={button.background}
            Icon={button.Icon}
          />
        ))}
      </Grid>
    </Grid>
  </Grid>
)

export default Feedback

const feedbackButtons = [
  {
    title: 'Poor content',
    background: '#ff918f',
    Icon: <FeedbackBad width='20px' />
  },
  {
    title: 'OK content',
    background: '#b95e04',
    Icon: <FeedbackOk width='20px' />
  },
  {
    title: 'Good content',
    background: '#008847',
    Icon: <FeedbackGood width='20px' />
  }
]

const FeedbackButton: React.FC<{
  title: string
  background: string
  Icon: JSX.Element
}> = ({ title, background, Icon }) => (
  <Tooltip title={title} placement='top'>
    <Button
      sx={{
        '&:hover': {
          background,
          color: 'black'
        },
        paddingLeft: '6px',
        paddingRight: '6px',
        marginLeft: 1,
        minWidth: 0,
        minHeight: 0,
        borderRadius: '48px',
        color: 'white'
      }}
    >
      {Icon}
    </Button>
  </Tooltip>
)
