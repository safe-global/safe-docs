import { ButtonBase, Container, Divider, Grid, Typography } from '@mui/material'
import Link from 'next/link'
import type { ComponentType, SyntheticEvent } from 'react'
import DiscordIcon from '../../assets/svg/discord-icon.svg'
import DiscourseIcon from '../../assets/svg/discourse-icon.svg'
import GithubIcon from '../../assets/svg/github-icon.svg'
import MirrorIcon from '../../assets/svg/mirror-icon.svg'
import Logo from '../../assets/svg/safe-logo-white.svg'
import XIcon from '../../assets/svg/x-icon.svg'
import YoutubeIcon from '../../assets/svg/youtube-icon.svg'
import css from './Footer.module.css'
import { useCookieBannerContext } from './CookieBannerContext'

const SAFE_LINK = 'https://safe.global'

// Safe
const CORE_LINK = 'https://core.safe.global'

// Community
const GOVERNANCE_LINK = 'https://safe.global/governance' // Do not use: https://governance.safe.global
const ECOSYSTEM_LINK = 'https://ecosystem.safe.global'
const GRANTS_LINK = 'https://grants.safe.global'
const SAFECON_LINK = 'https://conf.safe.global'
const DUNE_LINK = 'https://dune.com/safe'

// Resources
const HELP_LINK = 'https://help.safe.global'
const CAREERS_LINK = 'https://safe.global/careers'
const BRAND_LINK = 'https://press.safe.global'
const STACKEXCHANGE_LINK =
  'https://ethereum.stackexchange.com/questions/tagged/safe-core'
const EXPERIMENTAL_LINK = 'https://github.com/5afe'

// Sub-Footer
const TERMS_LINK = 'https://safe.global/terms'
const PRIVACY_LINK = 'https://safe.global/privacy'
const LICENSES_LINK = 'https://app.safe.global/licenses'
const COOKIE_LINK = 'https://safe.global/cookie'
const COOKIE_PREFERENCES_LINK = '#cookies'
const IMPRINT_LINK = 'https://safe.global/imprint'

// Socials
const X_LINK = 'https://x.com/safe'
const FORUM_LINK = 'https://forum.safe.global'
const DISCORD_LINK = 'https://chat.safe.global'
const YOUTUBE_LINK = 'https://www.youtube.com/@safeglobal'
const MIRROR_LINK = 'https://safe.mirror.xyz'
const GITHUB_LINK = 'https://github.com/safe-global'

interface FooterLink {
  label: string
  href: string
  target: string
  rel: string
}

const safeItems: FooterLink[] = [
  {
    label: 'Safe{Core}',
    href: CORE_LINK,
    target: '_blank',
    rel: 'noreferrer'
  }
]

const communityItems: FooterLink[] = [
  {
    label: 'Governance',
    href: GOVERNANCE_LINK,
    target: '_blank',
    rel: 'noreferrer'
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
    label: 'Safe Analytics',
    href: DUNE_LINK,
    target: '_blank',
    rel: 'noreferrer'
  }
]

const resourcesItems: FooterLink[] = [
  {
    label: 'Help Center',
    href: HELP_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Careers',
    href: CAREERS_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Brand Kit',
    href: BRAND_LINK,
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
    label: 'Experimental Tools',
    href: EXPERIMENTAL_LINK,
    target: '_blank',
    rel: 'noreferrer'
  }
]

const subFooterItems: FooterLink[] = [
  {
    label: 'Terms',
    href: TERMS_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Privacy',
    href: PRIVACY_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Licenses',
    href: LICENSES_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Cookie Policy',
    href: COOKIE_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Preferences',
    href: COOKIE_PREFERENCES_LINK,
    target: '_blank',
    rel: 'noreferrer'
  },
  {
    label: 'Imprint',
    href: IMPRINT_LINK,
    target: '_blank',
    rel: 'noreferrer'
  }
]

const LinksColumn: React.FC<{ title: string, items: FooterLink[] }> = ({
  title,
  items
}) => (
  <Grid item sm={6} md={2}>
    <Typography variant='caption' color='text.primary'>
      {title}
    </Typography>
    <ul className={css.list}>
      {items.map(item => (
        <li className={css.listItem} key={item.href}>
          <Link href={item.href} target={item.target} rel={item.rel}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </Grid>
)

const Socials: React.FC = () => (
  <Grid item xs={12} md={3} mt={{ xs: 6, md: 0 }}>
    <div className={css.socials}>
      {createFooterButton('X page', X_LINK, XIcon as React.FC)}
      {createFooterButton(
        'Discourse forum',
        FORUM_LINK,
        DiscourseIcon as React.FC
      )}
      {createFooterButton(
        'Discord server',
        DISCORD_LINK,
        DiscordIcon as React.FC
      )}
      {createFooterButton(
        'Youtube channel',
        YOUTUBE_LINK,
        YoutubeIcon as React.FC
      )}
      {createFooterButton('Mirror blog', MIRROR_LINK, MirrorIcon as React.FC)}
      {createFooterButton(
        'Github organization',
        GITHUB_LINK,
        GithubIcon as React.FC
      )}
    </div>
  </Grid>
)

const SubFooter: React.FC = () => {
  const { openBanner } = useCookieBannerContext()

  const showBanner = (e: SyntheticEvent): void => {
    // Prevent opening the hash link
    e.preventDefault()
    openBanner()
  }

  return (
    <Grid container alignItems='center' justifyContent='space-between'>
      <Grid item>
        <ul className={css.subList}>
          {subFooterItems.map(item => {
            const isCookiePreferencesLink = false // item.href === COOKIE_PREFERENCES_LINK
            return (
              <li className={css.subListItem} key={item.href}>
                <Link
                  href={item.href}
                  target={item.target}
                  rel={item.rel}
                  onClick={isCookiePreferencesLink ? showBanner : undefined}
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
  )
}

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

const Footer: React.FC = () => (
  <Container className={css.wrapper}>
    <Grid container flexDirection={{ xs: 'column', sm: 'row' }}>
      <Grid item xs={12} md={3} mb={{ xs: 4, md: 0 }}>
        <Link href={SAFE_LINK} target='_blank' rel='noreferrer'>
          <Logo className={css.logo} />
        </Link>
      </Grid>
      <LinksColumn title='Safe' items={safeItems} />
      <LinksColumn title='Community' items={communityItems} />
      <LinksColumn title='Resources' items={resourcesItems} />
      <Socials />
    </Grid>
    <Divider sx={{ mt: 5, mb: { xs: 3, md: 0 } }} />
    <SubFooter />
  </Container>
)

export default Footer
