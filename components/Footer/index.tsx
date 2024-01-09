import { ButtonBase, Container, Divider, Grid, Typography } from '@mui/material'
import type { ComponentType, SyntheticEvent } from 'react'

import DiscordIcon from '../../assets/svg/discord-icon.svg'
import XIcon from '../../assets/svg/x-icon.svg'
import YoutubeIcon from '../../assets/svg/youtube-icon.svg'
import DiscourseIcon from '../../assets/svg/discourse-icon.svg'
import MirrorIcon from '../../assets/svg/mirror-icon.svg'
import GithubIcon from '../../assets/svg/github-icon.svg'

import css from './Footer.module.css'
import Link from 'next/link'
import Logo from '../../assets/svg/safe-logo-white.svg'

const AppRoutes = {
  404: 'https://safe.global/404',
  wallet: 'https://safe.global/wallet',
  terms: 'https://safe.global/terms',
  privacy: 'https://safe.global/privacy',
  index: 'https://safe.global/',
  imprint: 'https://safe.global/imprint',
  ecosystem: 'https://safe.global/ecosystem',
  core: 'https://safe.global/core',
  cookie: 'https://safe.global/cookie',
  cla: {
    index: 'https://safe.global/cla'
  },
  careers: 'https://safe.global/careers',
  governance: 'https://safe.global/governance'
}

export const WALLET_LINK = 'https://app.safe.global'
export const SAFECON_LINK = 'https://conf.safe.global'
export const CORE_LINK = 'https://core.safe.global'
export const PRESS_LINK = 'https://press.safe.global'
export const HELP_LINK = 'https://help.safe.global'
export const DOCS_LINK = 'https://docs.safe.global'
export const FORUM_LINK = 'https://forum.safe.global'
export const IOS_LINK = 'https://apps.apple.com/app/id1515759131'
export const GPLAY_LINK =
  'https://play.google.com/store/apps/details?id=io.gnosis.safe'
export const LICENSES_LINK = 'https://app.safe.global/licenses'
export const GOVERNANCE_LINK = 'https://gov.safe.global'
export const ECOSYSTEM_LINK = 'https://ecosystem.safe.global'
export const GRANTS_LINK = 'https://grants.safe.global'
export const TWITTER_LINK = 'https://x.com/safe'
export const DISCORD_LINK = 'https://chat.safe.global'
export const YOUTUBE_LINK = 'https://www.youtube.com/@safeglobal'
export const MIRROR_LINK = 'https://safe.mirror.xyz'
export const GITHUB_LINK = 'https://github.com/safe-global'
export const EXPERIMENTAL_LINK = 'https://github.com/5afe'
export const DUNE_LINK = 'https://dune.com/safe'
export const STACKEXCHANGE_LINK = 'https://ethereum.stackexchange.com/questions/tagged/safe-core'

export const PROTOCOL_KIT_LINK =
  'https://docs.safe.global/safe-core-aa-sdk/protocol-kit'
export const AUTH_KIT_LINK =
  'https://docs.safe.global/safe-core-aa-sdk/auth-kit'
export const RELAY_KIT_LINK =
  'https://docs.safe.global/safe-core-aa-sdk/relay-kit'
export const ONRAMP_KIT_LINK =
  'https://docs.safe.global/safe-core-aa-sdk/onramp-kit'

const COOKIE_PREFERENCES = '#cookies'

const safeProtocolItems = [
  {
    label: 'Safe{Core}',
    href: CORE_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Developer Docs',
    href: DOCS_LINK,
    target: '_blank',
    rel: 'noreferrer'
  }
]

const communityItems = [
  {
    label: 'Governance',
    href: AppRoutes.governance
  },
  {
    label: 'Ecosystem',
    href: ECOSYSTEM_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Grants',
    href: GRANTS_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Safe{Con}',
    href: SAFECON_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Safe analytics',
    href: DUNE_LINK,
    target: '_blank',
    rel: 'noreferrer'
  }
]

const resourcesItems = [
  {
    label: 'Help Center',
    href: HELP_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Careers',
    href: AppRoutes.careers
  },
  {
    label: 'Brand Kit',
    href: PRESS_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Developer Support',
    href: STACKEXCHANGE_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Experimental tools',
    href: EXPERIMENTAL_LINK,
    target: '_blank',
    rel: 'noreferrer'
  }

]

const subFooterItems = [
  {
    label: 'Terms',
    href: AppRoutes.terms
  },
  {
    label: 'Privacy',
    href: AppRoutes.privacy
  },
  {
    label: 'Licenses',
    href: LICENSES_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Cookie Policy',
    href: AppRoutes.cookie
  },
  {
    label: 'Preferences',
    href: COOKIE_PREFERENCES
  },
  {
    label: 'Imprint',
    href: AppRoutes.imprint
  }
]

const createFooterButton = (
  label: string,
  href: string,
  IconComponent: ComponentType
): JSX.Element => {
  const buttonBaseAttributes = {
    disableRipple: true,
    target: '_blank',
    rel: 'noreferrer'
  }

  return (
    <ButtonBase {...buttonBaseAttributes} aria-label={label} href={href}>
      <IconComponent />
    </ButtonBase>
  )
}

const Footer: React.FC = () => {
  //   const { openBanner } = useCookieBannerContext()

  const showBanner = (e: SyntheticEvent): void => {
    // Prevent opening the hash link
    e.preventDefault()
    // openBanner()
  }

  return (
    <Container className={css.wrapper}>
      <Grid container flexDirection={{ xs: 'column', sm: 'row' }}>
        <Grid item xs={12} md={3} mb={{ xs: 4, md: 0 }}>
          <Link href={AppRoutes.index}>
            <Logo className={css.logo} />
          </Link>
        </Grid>

        <Grid item sm={6} md={2}>
          <Typography variant='caption' color='text.primary'>
            Safe Core Protocol
          </Typography>
          <ul className={css.list}>
            {safeProtocolItems.map(item => (
              <li className={css.listItem} key={item.href}>
                <Link href={item.href} target='_blank' rel='noreferrer'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Grid>

        <Grid item sm={6} md={2}>
          <Typography variant='caption' color='text.primary'>
            Community
          </Typography>
          <ul className={css.list}>
            {communityItems.map(item => (
              <li className={css.listItem} key={item.href}>
                <Link href={item.href} target={item.target} rel={item.rel}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Grid>

        <Grid item sm={6} md={2}>
          <Typography variant='caption' color='text.primary'>
            Resources
          </Typography>
          <ul className={css.list}>
            {resourcesItems.map(item => (
              <li className={css.listItem} key={item.href}>
                <Link href={item.href} target={item.target} rel={item.rel}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Grid>

        <Grid item xs={12} md={3} mt={{ xs: 6, md: 0 }}>
          <div className={css.socials}>
            {createFooterButton('X page', TWITTER_LINK, XIcon as React.FC)}
            {createFooterButton('Discourse forum', FORUM_LINK, DiscourseIcon as React.FC)}
            {createFooterButton('Discord server', DISCORD_LINK, DiscordIcon as React.FC)}
            {createFooterButton('Youtube channel', YOUTUBE_LINK, YoutubeIcon as React.FC)}
            {createFooterButton('Mirror blog', MIRROR_LINK, MirrorIcon as React.FC)}
            {createFooterButton('Github organization', GITHUB_LINK, GithubIcon as React.FC)}
          </div>
        </Grid>
      </Grid>

      <Divider sx={{ mt: 5, mb: { xs: 3, md: 0 } }} />

      <Grid container alignItems='center' justifyContent='space-between'>
        <Grid item>
          <ul className={css.subList}>
            {subFooterItems.map(item => {
              const isCookiePreference = item.href === COOKIE_PREFERENCES

              return (
                <li className={css.subListItem} key={item.href}>
                  <Link
                    href={item.href}
                    target={item.target}
                    rel={item.rel}
                    onClick={isCookiePreference ? showBanner : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </Grid>

        <Grid item my={2}>
          <Typography color='primary.light' fontSize='16px'>
            ©{new Date().getFullYear()} Safe Ecosystem Foundation
          </Typography>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Footer
