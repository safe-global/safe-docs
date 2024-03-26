import type { EmotionCache } from '@emotion/react'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import type { CssVarsThemeOptions } from '@mui/material/styles'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme
} from '@mui/material/styles'
import type { AppProps } from 'next/app'
import { useEffect, type ReactElement } from 'react'
import Head from 'next/head'
import ReactGA from 'react-ga4'

import MetaTags from '../components/MetaTags'
import { CookieBanner } from '../components/CookieBanner'
import {
  CookieBannerContextProvider,
  useCookieBannerContext
} from '../components/CookieBanner/CookieBannerContext'
import { createEmotionCache } from '../styles/emotion'
import '../styles/styles.css'
import { theme } from '../styles/theme'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

// Extended theme for CssVarsProvider
const cssVarsTheme = extendMuiTheme(theme as CssVarsThemeOptions)

let isAnalyticsInitialized = false

const GoogleAnalytics: React.FC = () => {
  const { isAnalyticsEnabled } = useCookieBannerContext()

  // Enable/disable tracking
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true' &&
      isAnalyticsEnabled
    ) {
      ReactGA.initialize(
        String(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID),
        {
          gaOptions: {
            cookieFlags: 'SameSite=Strict;Secure',
            cookieDomain: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DOMAIN
          }
        }
      )
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
  router,
  emotionCache = clientSideEmotionCache
}: AppProps & {
  emotionCache?: EmotionCache
}): ReactElement => {
  return (
    <>
      <Head>
        <MetaTags path={router.asPath} />
      </Head>
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
    </>
  )
}

export default App
