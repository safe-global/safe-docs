import { useEffect, type ReactElement } from 'react'
import type { AppProps } from 'next/app'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme
} from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/react'
import ReactGA from 'react-ga4'

import { createEmotionCache } from '../styles/emotion'
import { theme } from '../styles/theme'
import '../styles/styles.css'
import {
  CookieBannerContextProvider,
  useCookieBannerContext
} from '../components/CookieBanner/CookieBannerContext'
import { CookieBanner } from '../components/CookieBanner'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

// Extended theme for CssVarsProvider
const cssVarsTheme = extendMuiTheme(theme)

let isAnalyticsInitialized = false

const GoogleAnalytics: React.FC = () => {
  const { isAnalyticsEnabled } = useCookieBannerContext()

  // Enable/disable tracking
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true' && isAnalyticsEnabled) {
      ReactGA.initialize(String(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID), {
        gaOptions: {
          cookieFlags: 'SameSite=Strict;Secure',
          cookieDomain: process.env.GOOGLE_ANALYTICS_DOMAIN
        }
      })
      isAnalyticsInitialized = true
      return
    }

    if (!isAnalyticsEnabled && isAnalyticsInitialized) {
      // Injected script will otherwise remain in memory until new session
      location.reload()
    }
  }, [isAnalyticsEnabled])
  return null
}

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache
}: AppProps & {
  emotionCache?: EmotionCache
}): ReactElement => {
  return (
    <CacheProvider value={emotionCache}>
      <CssVarsProvider theme={cssVarsTheme}>
        <CookieBannerContextProvider>
          <CssBaseline />
          <GoogleAnalytics />
          <Component {...pageProps} />
          <CookieBanner />
        </CookieBannerContextProvider>
      </CssVarsProvider>
    </CacheProvider>
  )
}

export default App
