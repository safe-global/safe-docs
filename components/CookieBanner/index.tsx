import Link from 'next/link'
import {
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'

import css from './styles.module.css'
import { useCookieBannerContext } from './CookieBannerContext'

export const enum CookieType {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics'
}

export const CookieBanner = (): ReactElement | null => {
  const {
    isAnalyticsEnabled,
    setIsAnalyticsEnabled,
    closeBanner,
    isBannerOpen
  } = useCookieBannerContext()
  const [analytics, setAnalytics] = useState<boolean>(false)

  const handleAccept = (): void => {
    setIsAnalyticsEnabled(analytics)
    closeBanner()
  }

  const handleAcceptAll = (): void => {
    setIsAnalyticsEnabled(true)
    closeBanner()
  }

  useEffect(() => {
    setAnalytics(isAnalyticsEnabled)
  }, [isAnalyticsEnabled])

  if (!isBannerOpen) {
    return null
  }

  return (
    <Paper className={css.container} elevation={3}>
      <div className={css.content}>
        <Typography align='center'>
          We use cookies to provide you with the best experience and to help
          improve our website and application. Please read our{' '}
          <Link target='_blank' href='https://safe.global/cookie'>Cookie Policy</Link> for more
          information. By clicking &quot;Accept all&quot;, you agree to the
          storing of cookies on your device to enhance site navigation, analyze
          site usage and provide customer support.
        </Typography>

        <form className={css.grid}>
          <FormControlLabel
            control={<Checkbox name={CookieType.NECESSARY} checked disabled />}
            label='Necessary'
          />

          <FormControlLabel
            control={
              <Checkbox name={CookieType.ANALYTICS} checked={analytics} />
            }
            label='Analytics'
            onChange={(_, checked) => {
              setAnalytics(checked)
            }}
          />

          <div className={css.grid}>
            <Button
              onClick={handleAccept}
              variant='outlined'
              disableElevation
              size='large'
            >
              Accept selection
            </Button>
            <Button
              onClick={handleAcceptAll}
              variant='contained'
              disableElevation
              size='large'
            >
              Accept all
            </Button>
          </div>
        </form>
      </div>
    </Paper>
  )
}
