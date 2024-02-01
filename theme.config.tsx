import React from 'react'
import type { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

import SafeLogo from './assets/svg/safe-logo-white.svg'
import Footer from './components/Footer'
// import Feedback from './components/Feedback'

const config: DocsThemeConfig = {
  darkMode: false,
  nextThemes: {
    forcedTheme: 'dark'
  },
  primaryHue: 150,
  logo: <SafeLogo />,
  project: {
    link: 'https://github.com/safe-global'
  },
  docsRepositoryBase: 'https://github.com/safe-global/safe-docs/tree/main',
  footer: {
    text: <Footer />
  },
  sidebar: {
    defaultMenuCollapseLevel: 1
  },
  head: <link rel='icon' type='image/png' sizes='32x32' href='/favicon.png' />,
  useNextSeoProps: () => {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Safe Docs'
      }
    }
  }
  // main: ({ children }) => (
  //   <>
  //     {children}
  //     <Feedback />
  //   </>
  // )
}

export default config
