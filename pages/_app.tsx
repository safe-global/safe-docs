import type { ReactElement } from 'react'
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

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

// Extended theme for CssVarsProvider
const cssVarsTheme = extendMuiTheme(theme)

const GoogleAnalytics: React.FC = () => {
  if (typeof window === 'undefined') return null
  if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID === undefined) return null
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID, {
    gaOptions: {
      cookieFlags: 'SameSite=Strict;Secure',
      cookieDomain: process.env.GOOGLE_ANALYTICS_DOMAIN
    }
  })
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
        <CssBaseline />
        <GoogleAnalytics />
        <Component {...pageProps} />
      </CssVarsProvider>
    </CacheProvider>
  )
}

export default App
