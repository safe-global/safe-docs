import { useRouter } from 'next/router'
import type { DocsThemeConfig } from 'nextra-theme-docs'

import SafeLogo from './assets/svg/safe-logo-white.svg'
import Feedback from './components/Feedback'
import Footer from './components/Footer'

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
  toc: {
    backToTop: true
  },
  feedback: {
    useLink: () =>
      'https://github.com/safe-global/safe-docs/issues/new?assignees=&labels=nextra-feedback&projects=&template=nextra-feedback.yml&title=%5BFeedback%5D+'
  },
  head: <link rel='icon' type='image/png' sizes='32x32' href='/favicon.png' />,
  useNextSeoProps: () => {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        noindex: process.env.NEXT_PUBLIC_IS_PRODUCTION !== 'true',
        nofollow: process.env.NEXT_PUBLIC_IS_PRODUCTION !== 'true',
        titleTemplate: '%s – Safe Docs'
      }
    }
  },
  main: ({ children }) => (
    <>
      {children}
      <Feedback />
    </>
  ),
  banner: {
    key: 'ethglobal-london-2024',
    text: <a href="https://ethglobal.com/events/london2024/prizes#safe" target="_blank">
    💰 Are you hacking at ETHGlobal London? Check our bounties →
  </a>,
  dismissible: true
  }
}

export default config
