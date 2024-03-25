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
    return {
      noindex: process.env.NEXT_PUBLIC_IS_PRODUCTION !== 'true',
      nofollow: process.env.NEXT_PUBLIC_IS_PRODUCTION !== 'true',
      titleTemplate: asPath !== '/' ? '%s – Safe Docs' : 'Safe Docs',
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: `${process.env.NEXT_PUBLIC_HOST_URL}${asPath}`,
        site_name: 'Safe Docs',
        description:
          'Safe{Core} is an open-source and modular account abstraction stack. Learn about its features and how to use it.',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_HOST_URL}/og_image.png`,
            width: 1200,
            height: 672,
            alt: 'Safe Logo',
            type: 'image/png'
          }
        ]
      }
    }
  },
  main: ({ children }) => (
    <>
      {children}
      <Feedback />
    </>
  )
}

export default config
