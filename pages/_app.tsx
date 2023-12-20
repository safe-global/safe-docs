import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme
} from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/react'
import type { AppProps } from 'next/app'
import type { ReactElement } from 'react'

import { createEmotionCache } from '../styles/emotion'
// import { CookieBannerContextProvider } from '../components/common/CookieBanner/CookieBannerContext'
// import { CookieBanner } from '../components/common/CookieBanner'

import { theme } from '../styles/theme'

import '../styles/styles.css'
// import PageLayout from '../components/common/PageLayout'
// import { useGa } from '../hooks/useGa'
// import useHotjar from '../hooks/useHotjar'
// import DOMPurify from 'isomorphic-dompurify'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

// Extended theme for CssVarsProvider
const cssVarsTheme = extendMuiTheme(theme)

// Allow external links when sanitizing json data
// DOMPurify.addHook('afterSanitizeAttributes', function (node) {
//   // set all elements owning target to target=_blank
//   if ('target' in node) {
//     node.setAttribute('target', '_blank')
//   }
// })

// const InitHooks = () => {
//   useGa()
//   useHotjar()

//   return null
// }

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

        {/* <CookieBannerContextProvider>
          <InitHooks />

          <PageLayout> */}
        <Component {...pageProps} />
        {/* </PageLayout>

          <CookieBanner />
        </CookieBannerContextProvider> */}
      </CssVarsProvider>
    </CacheProvider>
  )
}

export default App
