import type { EmotionCache } from '@emotion/react'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import type { CssVarsThemeOptions } from '@mui/material/styles'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme
} from '@mui/material/styles'
import type { AppProps } from 'next/app'
import { type ReactElement } from 'react'
import Head from 'next/head'
import { GoogleTagManager } from '@next/third-parties/google'

import MetaTags from '../components/MetaTags'
import { CookieBanner } from '../components/CookieBanner'
import { CookieBannerContextProvider } from '../components/CookieBanner/CookieBannerContext'
import { createEmotionCache } from '../styles/emotion'
import '../styles/styles.css'
import '@code-hike/mdx/dist/index.css'
import { theme } from '../styles/theme'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

// Extended theme for CssVarsProvider
const cssVarsTheme = extendMuiTheme(theme as CssVarsThemeOptions)

const App = ({
  Component,
  pageProps,
  router,
  emotionCache = clientSideEmotionCache
}: AppProps & {
  emotionCache?: EmotionCache
}): ReactElement => (
  <>
    <Head>
      <MetaTags path={router.asPath} />
    </Head>
    <GoogleTagManager
      gtmId={String(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID)}
    />
    <CacheProvider value={emotionCache}>
      <CssVarsProvider theme={cssVarsTheme}>
        <CookieBannerContextProvider>
          <CssBaseline />
          <Component {...pageProps} />
          <CookieBanner />
        </CookieBannerContextProvider>
      </CssVarsProvider>
    </CacheProvider>
  </>
)

export default App
