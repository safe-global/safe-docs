import AddIcon from '@mui/icons-material/Add'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Input,
  Typography
} from '@mui/material'
import { sendGAEvent } from '@next/third-parties/google'
import cuid from 'cuid'
import NextLink from 'next/link'
import { useContext, useEffect, useState } from 'react'

import Check from '../../assets/svg/check.svg'
import FeedbackBad from '../../assets/svg/feedback-bad.svg'
import FeedbackGood from '../../assets/svg/feedback-good.svg'
import { NetworkContext } from '../ApiReference/Network'

const ReportIssue: React.FC<{
  small?: boolean
  asPath?: string
  network?: string
}> = ({ small = false, asPath, network }) => (
  <NextLink
    target='_blank'
    rel='noopener noreferrer'
    href='https://github.com/safe-global/safe-docs/issues/new?assignees=&labels=nextra-feedback&projects=&template=nextra-feedback.yml&title=%5BFeedback%5D+'
  >
    <Button
      onClick={() => {
        sendGAEvent('event', 'issue', {
          ...(asPath?.includes('transaction-service-reference') === true
            ? { network }
            : {})
        })
      }}
      size={small ? 'small' : undefined}
      sx={{
        color: 'rgba(249,250,251,.7)',
        backgroundColor: small
          ? ({ palette }) => palette.grey[900]
          : 'transparent'
      }}
    >
      Report issue
    </Button>
  </NextLink>
)

const Feedback: React.FC<{
  label?: string
  asPath?: string
  small?: boolean
}> = ({ label, asPath, small = false }) => {
  const [network] = useContext(NetworkContext)
  const [isPositive, setIsPositive] = useState<boolean | null>(null)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [steps, setSteps] = useState('')
  const [version, setVersion] = useState('')
  const [errorFix, setErrorFix] = useState('')

  useEffect(() => {
    setIsPositive(null)
    setFeedback('')
    setSteps('')
    setVersion('')
    setErrorFix('')
    setSubmitted(false)
  }, [asPath])

  if (asPath === '/support' || asPath === '/resource-hub') return null

  const handleSubmit = async (): Promise<void> => {
    const feedbackId = cuid()
    setLoading(true)
    sendGAEvent('event', 'feedback_comments', {
      positive: isPositive === true ? 1 : 0,
      feedbackId,
      ...(asPath?.includes('transaction-service-reference') === true
        ? { network }
        : {})
    })
    if (
      process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL != null &&
      process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true'
    ) {
      await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({
          date: new Date().getTime(),
          feedbackId,
          asPath,
          positive: isPositive === true ? 1 : 0,
          feedback,
          steps,
          version,
          errorFix,
          ...(asPath?.includes('transaction-service-reference') === true
            ? { network }
            : {})
        })
      }).catch(console.error)
    }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <Grid
      sx={{
        p: small ? 1 : 3,
        mt: 3,
        borderRadius: '8px',
        border: label != null ? 'none' : '1px solid rgba(249,250,251,.1)'
      }}
    >
      {submitted ? (
        <Grid
          container
          flexDirection={small ? 'row' : 'column'}
          justifyContent='center'
          alignItems='center'
        >
          <Check width='32px' />
          <Typography variant='h5' fontWeight='700' color='white' mt={2} mb={1}>
            Thank you for your feedback!
          </Typography>
        </Grid>
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
                      backgroundColor: 'rgba(249,250,251,.1)',
                      p: 1
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
                      <TextArea
                        placeholder='1. I ran npm dev.'
                        onChange={e => {
                          setSteps(e.target.value)
                        }}
                        value={steps}
                      />
                      <Typography variant='h5' mt={3} mb={1}>
                        What version of Safe Smart Account, SDK, or API are you
                        using, if applicable? If a package is related to the
                        error, please provide a version.
                      </Typography>
                      <TextArea
                        placeholder='@safe-global/protocol-kit v4.0.3'
                        onChange={e => {
                          setVersion(e.target.value)
                        }}
                        value={version}
                      />
                      <Typography variant='h5' mt={3} mb={1}>
                        Were you able to fix the error? If so, what steps did
                        you follow?
                      </Typography>
                      <TextArea
                        placeholder="1. I right-clicked and selected 'Fix all issues automatically'."
                        onChange={e => {
                          setErrorFix(e.target.value)
                        }}
                        value={errorFix}
                      />
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
              <Grid container>
                <Button
                  variant='outlined'
                  sx={{ mt: 2 }}
                  onClick={() => {
                    void handleSubmit()
                  }}
                  disabled={loading || feedback === ''}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              {...(label != null
                ? { alignItems: 'center' }
                : { flexDirection: 'column', alignItems: 'center' })}
            >
              {label != null ? (
                <Grid container alignItems='center'>
                  <Typography
                    color={small ? 'text' : 'primary'}
                    variant='h5'
                    sx={{
                      mb: small ? 1 : 0,
                      mr: small ? 1 : 3,
                      mt: small ? 1 : 0,
                      fontSize: small ? '13px' : undefined
                    }}
                  >
                    {label}
                  </Typography>
                  <Button
                    sx={{
                      color: 'white',
                      backgroundColor: ({ palette }) => palette.grey[900],
                      mr: 0.5,
                      minWidth: '48px'
                    }}
                    size={small ? 'small' : undefined}
                    onClick={() => {
                      sendGAEvent('event', 'feedback', {
                        positive: 1,
                        ...(asPath?.includes(
                          'transaction-service-reference'
                        ) === true
                          ? { network }
                          : {})
                      })
                      setIsPositive(true)
                    }}
                  >
                    Yes
                  </Button>

                  <Button
                    sx={{
                      color: 'white',
                      backgroundColor: ({ palette }) => palette.grey[900],
                      mr: 0.5,
                      minWidth: '48px'
                    }}
                    size={small ? 'small' : undefined}
                    onClick={() => {
                      sendGAEvent('event', 'feedback', {
                        asPath,
                        positive: 0,
                        ...(asPath?.includes(
                          'transaction-service-reference'
                        ) === true
                          ? { network }
                          : {})
                      })
                      setIsPositive(false)
                    }}
                  >
                    No
                  </Button>
                  <ReportIssue {...{ asPath, network }} small />
                </Grid>
              ) : (
                <>
                  <Typography textAlign='center' fontWeight='700' color='white'>
                    Was this page helpful?
                  </Typography>
                  <Grid item justifyContent='space-around' mt={1}>
                    <Button
                      sx={{
                        p: 0.5,
                        mr: 1.5,
                        minWidth: 0,
                        borderRadius: 48,
                        '&:hover': {
                          svg: {
                            path: {
                              stroke: 'rgba(18, 255, 128, 1)'
                            }
                          }
                        }
                      }}
                      onClick={() => {
                        sendGAEvent('event', 'feedback', {
                          positive: 1,
                          ...(asPath?.includes(
                            'transaction-service-reference'
                          ) === true
                            ? { network }
                            : {})
                        })
                        setIsPositive(true)
                      }}
                    >
                      <FeedbackGood width='24px' />
                    </Button>
                    <Button
                      color='error'
                      sx={{
                        p: 0.5,
                        minWidth: 0,
                        borderRadius: 48,
                        '&:hover': {
                          svg: {
                            path: {
                              stroke: 'rgba(255, 95, 114, 1)'
                            }
                          }
                        }
                      }}
                      onClick={() => {
                        sendGAEvent('event', 'feedback', {
                          positive: 0,
                          ...(asPath?.includes(
                            'transaction-service-reference'
                          ) === true
                            ? { network }
                            : {})
                        })
                        setIsPositive(false)
                      }}
                    >
                      <FeedbackBad width='24px' stroke='red' />
                    </Button>
                  </Grid>
                </>
              )}
              {!small && <ReportIssue />}
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  )
}

const TextArea: React.FC<{
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  value: string
  placeholder: string
}> = ({ onChange, value, placeholder }) => (
  <Input
    fullWidth
    multiline
    rows={4}
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    inputProps={{
      sx: { fontSize: '15px' }
    }}
    sx={{
      backgroundColor: 'rgba(249,250,251,.1)',
      p: 1,
      borderRadius: '4px'
    }}
  />
)

export default Feedback
