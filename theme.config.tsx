import { useRouter } from 'next/router'
import type { DocsThemeConfig } from 'nextra-theme-docs'

import SafeLogo from './assets/svg/safe-logo-white.svg'
import Feedback from './components/Feedback'
import Footer from './components/Footer'
import type { PropsWithChildren } from 'react'

const Main: React.FC<PropsWithChildren> = ({ children }) => {
  const { asPath } = useRouter()
  return (
    <>
      {children}
      <Feedback asPath={asPath} />
    </>
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
        : asPath === '/ethglobal-brussels'
        ? 'ETHGlobal Brussels - '
        : '%s – ') + 'Safe Docs'
    return {
      titleTemplate
    }
  },
  main: Main
}

export default config
