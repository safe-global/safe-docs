import { useState } from 'react'
import {
  Button,
  Grid,
  Input,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import NextLink from 'next/link'
import ReactGA from 'react-ga4'
import { useRouter } from 'next/router'

const Feedback: React.FC = () => {
  const { asPath } = useRouter()
  const [isPositive, setIsPositive] = useState<boolean | null>(null)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [steps, setSteps] = useState('')
  const [version, setVersion] = useState('')
  const [errorFix, setErrorFix] = useState('')
  const [contactInfo, setContactInfo] = useState('')

  if (asPath === '/what-is-safe' || asPath === '/support') return null

  const handleSubmit = (): void => {
    setLoading(true)
    ReactGA.event('feedback', {
      path: window.location.pathname,
      positive: isPositive,
      feedback,
      steps,
      version,
      errorFix
    })
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <Grid>
      {submitted ? (
        <Typography variant='h5'>
          Thank you, your feedback has been submitted.
        </Typography>
      ) : (
        <Grid container alignItems='center'>
          {isPositive != null ? (
            <Grid container flexDirection='column'>
              {isPositive ? (
                <>
                  <Typography variant='h5' mb={2}>
                    What was most helpful?
                  </Typography>
                  <Input
                    value={feedback}
                    multiline
                    rows={4}
                    sx={{
                      backgroundColor: 'rgba(249,250,251,.1)',
                      p: 1
                    }}
                    onChange={e => {
                      setFeedback(e.target.value)
                    }}
                  />
                </>
              ) : (
                <>
                  <Typography variant='h5' mb={2}>
                    What can we improve?
                  </Typography>
                  <Input
                    value={feedback}
                    multiline
                    rows={4}
                    sx={{
                      backgroundColor: 'rgba(249,250,251,.1)'
                    }}
                    onChange={e => {
                      setFeedback(e.target.value)
                    }}
                  />
                  <Accordion
                    sx={{
                      mt: 2,
                      backgroundColor: 'transparent',
                      boxShadow: 'none'
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<AddIcon />}
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                      sx={{ fontSize: '16px', pl: 0 }}
                    >
                      More details
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0 }}>
                      <Typography variant='h5' mt={3} mb={1}>
                        Can you provide the exact steps you took before
                        receiving the error? For example, the commands you ran.
                      </Typography>
                      <Input
                        fullWidth
                        multiline
                        rows={4}
                        placeholder='1. I ran npm dev...'
                        onChange={e => {
                          setSteps(e.target.value)
                        }}
                        value={steps}
                        sx={{
                          backgroundColor: 'rgba(249,250,251,.1)',
                          p: 1
                        }}
                      />
                      <Typography variant='h5' mt={3} mb={1}>
                        If applicable, what version of Safe are you using? If a
                        package is related to the error, please provide a
                        version of that as well.
                      </Typography>
                      <Input
                        fullWidth
                        multiline
                        rows={4}
                        placeholder='Safe{Core} SDK: v2'
                        onChange={e => {
                          setVersion(e.target.value)
                        }}
                        value={version}
                        sx={{
                          backgroundColor: 'rgba(249,250,251,.1)',
                          p: 1
                        }}
                      />
                      <Typography variant='h5' mt={3} mb={1}>
                        Were you able to fix the error? If so, what steps did
                        you follow?
                      </Typography>
                      <Input
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="1. I right-clicked and selected 'Fix all issues automatically'..."
                        onChange={e => {
                          setErrorFix(e.target.value)
                        }}
                        value={errorFix}
                        sx={{
                          backgroundColor: 'rgba(249,250,251,.1)',
                          p: 1
                        }}
                      />
                      <Typography variant='h5' mt={3} mb={1}>
                        Can you provide your email or discord username? This
                        would allow us to contact you for further info or assist
                        you with your issue.
                      </Typography>
                      <Input
                        fullWidth
                        placeholder='user@example.com'
                        onChange={e => {
                          setContactInfo(e.target.value)
                        }}
                        value={contactInfo}
                        sx={{
                          backgroundColor: 'rgba(249,250,251,.1)',
                          p: 1
                        }}
                      />
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
              <Grid container>
                <Button
                  variant='outlined'
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          ) : (
            <>
              <Typography variant='h5' mr={3}>
                Was this page helpful?
              </Typography>
              <Button
                onClick={() => {
                  setIsPositive(true)
                }}
              >
                Yes
              </Button>

              <Button
                onClick={() => {
                  setIsPositive(false)
                }}
              >
                No
              </Button>
              <NextLink
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/safe-global/safe-docs/issues/new?assignees=&labels=nextra-feedback&projects=&template=nextra-feedback.yml&title=%5BFeedback%5D+'
              >
                <Button>Report issue</Button>
              </NextLink>
            </>
          )}
        </Grid>
      )}
    </Grid>
  )
}

export default Feedback
