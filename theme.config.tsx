import { useRouter } from 'next/router'
// import localFont from 'next/font/local'
import type { DocsThemeConfig } from 'nextra-theme-docs'

import type { PropsWithChildren } from 'react'
import SafeLogo from './assets/svg/safe-logo-white.svg'
import Feedback from './components/Feedback'
import Footer from './components/Footer'

// const citerne = localFont({ src: './public/fonts/Citerne-Light.woff' })

const Main: React.FC<PropsWithChildren> = ({ children }) => {
  const { asPath } = useRouter()
  return (
    // <div className={citerne.className}>
    <div>
      {children}
      <Feedback asPath={asPath} />
    </div>
  )
}

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
    const titleTemplate =
      (asPath === '/'
        ? ''
        : asPath === '/build-the-new-internet'
          ? 'Build the New Internet - '
          : '%s – ') + 'Safe Docs'
    return {
      titleTemplate
    }
  },
  main: Main
}

export default config
