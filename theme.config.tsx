import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Img from 'next/image'

import SafeLogo from './assets/svg/safe-logo.svg'
import Twiter from './assets/svg/x-icon.svg'
import Footer from './components/Footer'

const config: DocsThemeConfig = {
  logo: <SafeLogo />,
  project: {
    link: 'https://github.com/safe-global'
  },
  docsRepositoryBase: 'https://github.com/safe-global/safe-docs/tree/main',
  footer: {
    text: <Footer />
  }
}

export default config
