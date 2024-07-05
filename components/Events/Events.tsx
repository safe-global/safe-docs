import { useState } from 'react'
import Link from 'next/link'
import Img from 'next/image'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Add from '@mui/icons-material/Add'
import Minimize from '@mui/icons-material/Minimize'

import Bounty from './Bounty'
import Workshop from './Workshop'
import TeamMember from './TeamMember'
import eventData from './event-data.json'
import Gift from '../../assets/svg/gift.svg'
import Building from '../../assets/svg/building.svg'
import Layers from '../../assets/svg/layers.svg'
import DevStar from '../../assets/diamond-bg.png'
import DevDiamond from '../../assets/diamond-dev.png'
import German from '../../assets/german.png'
import Louis from '../../assets/louis.jpeg'
import Valle from '../../assets/valle.jpg'
import TrophyIcon from '../../assets/svg/trophy.svg'
import Teach from '../../assets/svg/teach.svg'
import Discord from '../../assets/svg/discord.svg'
import StackExchange from '../../assets/svg/stack-exchange.svg'
import Ellipse1 from '../../assets/svg/ellipse-1.svg'
import Ellipse2 from '../../assets/svg/ellipse-2.svg'
import Ellipse3 from '../../assets/svg/ellipse-3.svg'
import Ellipse4 from '../../assets/svg/ellipse-4.svg'
import type { TeamMemberType } from './types'
import css from './styles.module.css'
import { type Theme, useMediaQuery } from '@mui/material'

const EventsPage: React.FC = () => {
  const isBiggerThanXs = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  )

  const isBiggerThanMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('lg')
  )
  const [expanded, setExpanded] = useState<number | null>(0)

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : null)
    }

  return (
    <Box width='100%' overflow='hidden'>
      <Grid container justifyContent='space-between'>
        <Ellipse1 />
        <Ellipse2 style={{ position: 'absolute', right: 0 }} />
      </Grid>
      <Grid
        container
        sx={{
          background: 'url(./event-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          mb: '200px',
          position: 'fixed',
          top: 0,
          zIndex: [-1]
        }}
      >
        <Grid
          container
          flexDirection='column'
          sx={{ maxWidth: '1440px', px: '30px' }}
        >
          <Typography variant='h1' className={css.title} sx={{ mt: '100px' }}>
            Safe at
          </Typography>
          <Typography variant='h1' className={css.title}>
            {eventData.name}
          </Typography>
          <Typography className={css.body} sx={{ mt: '50px' }}>
            We proudly support this event by sponsoring{' '}
            {eventData.bounties.length} submission tracks for a total of{' '}
            {eventData.bounties.reduce(
              (acc, curr) => acc + curr.prize.value,
              0
            )}
            {eventData.bounties[0].prize.currency}.
          </Typography>
          <Grid container flexDirection={['column', 'row']}>
            <Grid
              item
              height='220px'
              container
              flexDirection='column'
              justifyContent='space-between'
              sx={{ width: ['100%', '35%'] }}
            >
              <div>
                <Typography
                  color='text.dark'
                  sx={{ mt: '50px' }}
                  className={css.body}
                >
                  Date
                </Typography>
                <Typography sx={{ mt: '10px' }} className={css.body}>
                  {new Date(eventData.start).toDateString()} -{' '}
                  {new Date(eventData.end).toDateString()}
                </Typography>
              </div>
              <Link
                href={eventData.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Typography className={css.link}>
                  Visit event page{' '}
                  {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
                </Typography>
              </Link>
            </Grid>
            <Grid
              item
              height='220px'
              container
              flexDirection='column'
              justifyContent='space-between'
              sx={{ width: ['100%', '35%'] }}
            >
              <div>
                <Typography
                  color='text.dark'
                  sx={{ mt: '50px' }}
                  className={css.body}
                >
                  Venue
                </Typography>
                <Typography sx={{ mt: '10px' }} className={css.body}>
                  {eventData.venue.name}
                  <br />
                  {eventData.venue.address}
                </Typography>
              </div>
              <Link
                href={eventData.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Typography className={css.link}>
                  Get directions{' '}
                  {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
                </Typography>
              </Link>
            </Grid>
          </Grid>
          <Grid
            container
            alignItems='center'
            flexDirection='column'
            justifyContent='center'
            sx={{ mt: ['60px', '200px'] }}
          >
            <Link
              href={eventData.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Typography className={css.link}>Tracks and prizes</Typography>
            </Link>
            <ExpandMoreIcon sx={{ width: '16px' }} />
          </Grid>
        </Grid>
      </Grid>
      <Grid container flexDirection='column'>
        <Grid
          container
          alignItems='center'
          flexDirection='column'
          justifyContent='center'
        >
          <Typography variant='h2' textAlign='center' className={css.heading}>
            Get rewarded by contributing to the ecosystem
          </Typography>
          <Typography sx={{ mt: '20px' }} className={css.body}>
            Tracks you can work on at this event:
          </Typography>
        </Grid>
        <Grid container alignItems='center' flexDirection='column'>
          <Grid
            container
            sx={{ maxWidth: '1440px', px: '30px' }}
            justifyContent='space-between'
            mt='50px'
            mb='80px'
            flexDirection={['column', 'row']}
          >
            {eventData.bounties.map((bounty, index) => (
              <Bounty
                width={[
                  '100%',
                  `calc(${(1 / eventData.bounties.length) * 100}% - 20px)`
                ]}
                icon={icons[index]}
                name={bounty.name}
                description={bounty.description}
                prize={bounty.prize.value + bounty.prize.currency}
                key={index}
              />
            ))}
          </Grid>
          <Link href={eventData.url} target='_blank' rel='noopener noreferrer'>
            <Typography className={css.link}>
              Learn more at bounty&apos;s page{' '}
              {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
            </Typography>
          </Link>
        </Grid>
      </Grid>
      <Grid container alignItems='center' flexDirection='column' mt='200px'>
        <Grid
          container
          alignItems='flex-start'
          justifyContent='space-between'
          position='relative'
          sx={{ maxWidth: ['100%', '1440px'], px: '30px', mb: 10 }}
        >
          <Grid
            container
            flexDirection='column'
            width={['100%', '400px', '800px']}
            overflow='hidden'
          >
            <Typography
              variant='caption'
              sx={{ mt: [0, '100px'] }}
              className={css.caption}
            >
              Workshops
            </Typography>
            <Typography variant='h2' className={css.heading}>
              Hands-on insights directly from our engineers
            </Typography>
          </Grid>
          {isBiggerThanXs && (
            <Grid
              item
              container
              sx={{
                width: [0, '500px', '600px'],
                overflow: 'hidden',
                position: 'absolute',
                top: [0, -50, -100, -150],
                right: [0, -150, -230, -50]
              }}
            >
              <Img
                width={isBiggerThanMd ? 600 : 500}
                src={DevStar}
                alt='dev-star'
              />
            </Grid>
          )}
          {!isBiggerThanXs && (
            <Grid
              container
              justifyContent='flex-end'
              sx={{ width: '100%', overflow: 'hidden', my: '-100px' }}
            >
              <Box sx={{ width: '200%', mr: -10 }}>
                <Img objectFit='contain' src={DevStar} alt='dev-star' />
              </Box>
            </Grid>
          )}
        </Grid>
        <Grid container sx={{ maxWidth: '1440px', px: '30px' }}>
          <Grid container alignContent='flex-end' flexDirection='column'>
            <Grid container width={['100%', '70%']}>
              {eventData.workshops.map((workshop, index) => (
                <Workshop
                  key={index}
                  workshop={workshop}
                  speaker={
                    team.find(
                      member => member.name === workshop.speaker
                    ) as TeamMemberType
                  }
                />
              ))}
              <Typography sx={{ mt: '120px' }} className={css.heading2}>
                Meet the team at the event
              </Typography>
              <Grid
                container
                justifyContent='space-between'
                flexDirection={['column', 'column', 'row']}
                mt={4}
              >
                {eventData.team.map((member, index) => (
                  <TeamMember
                    key={index}
                    member={
                      team.find(
                        teamMember => teamMember.name === member
                      ) as TeamMemberType
                    }
                    width={[
                      '100%',
                      '100%',
                      `calc(${(1 / eventData.team.length) * 100}% - 20px)`
                    ]}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            width={['100%', '100%', 'calc(100% - 450px)']}
            flexDirection='column'
            justifyContent='center'
          >
            <Typography
              variant='caption'
              sx={{ mt: ['100px', '300px'] }}
              className={css.caption}
            >
              Safe Docs
            </Typography>
            <Typography variant='h1' className={css.heading}>
              Ready to build with Safe?
            </Typography>
            <Typography sx={{ mt: '20px' }} className={css.body}>
              Start building on a robust and extensively documented line of
              products.
            </Typography>
          </Grid>
          <Grid
            container
            mt='80px'
            alignItems='flex-start'
            justifyContent='space-between'
          >
            <Grid
              item
              container
              flexDirection='column'
              sx={{
                width: ['100%', '100%', 'calc(33.3% - 48px)'],
                height: ['auto', 'auto', '100%'],
                p: 6,
                border: 'solid 1px',
                borderColor: ({ palette }) => palette.primary.main,
                borderRadius: '8px'
              }}
            >
              <Box height='50%'>
                <TrophyIcon style={{ width: '50px', height: '50px' }} />
              </Box>
              <Typography className={css.heading2} mt={[12, 12, 0]}>
                Safe Hackathon Success Guide
              </Typography>
              <Typography sx={{ my: '40px' }} className={css.body}>
                Learning materials, Previous Hackathon Winner and Ideas.
              </Typography>
              <Link
                href={eventData.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Typography className={css.link}>
                  Read guide {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
                </Typography>
              </Link>
            </Grid>
            <Grid
              item
              container
              flexDirection='column'
              mt={[10, 6, 0]}
              width={['100%', '100%', '66.6%']}
              height='100%'
            >
              <Grid item container justifyContent='space-between'>
                <Grid
                  container
                  flexDirection='column'
                  sx={{
                    mb: '80px',
                    width: ['100%', 'calc(50% - 20px)'],
                    p: 6,
                    border: 'solid 1px',
                    borderColor: ({ palette }) => palette.border.light,
                    borderRadius: '8px'
                  }}
                >
                  <Typography sx={{ mb: '160px' }} className={css.heading2}>
                    7579 Quickstart with Permissionless.js
                  </Typography>
                  <Link
                    href={eventData.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Typography className={css.link}>
                      Read guide{' '}
                      {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
                    </Typography>
                  </Link>
                </Grid>
                <Grid
                  container
                  flexDirection='column'
                  sx={{
                    mb: '80px',
                    width: ['100%', 'calc(50% - 20px)'],
                    p: 6,
                    border: 'solid 1px',
                    borderColor: ({ palette }) => palette.border.light,
                    borderRadius: '8px'
                  }}
                >
                  <Typography sx={{ mb: '160px' }} className={css.heading2}>
                    Build a full-stack app with Safe and Passkeys
                  </Typography>
                  <Link
                    href={eventData.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Typography className={css.link}>
                      Read guide{' '}
                      {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
              <Grid
                container
                flexDirection='column'
                sx={{
                  p: 6,
                  border: 'solid 1px',
                  borderColor: ({ palette }) => palette.border.light,
                  borderRadius: '8px'
                }}
              >
                <Typography className={css.heading2} mb={[20, 0]}>
                  Getting started with ERC-4337 and Safe
                </Typography>
                <Link
                  href={eventData.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Typography className={css.link}>
                    Read guide {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid container flexDirection='column' my={['150px', '300px']}>
            <Grid
              container
              alignItems='center'
              flexDirection='column'
              justifyContent='center'
            >
              <Typography variant='caption' className={css.caption}>
                Contact Us
              </Typography>
              <Typography
                variant='h2'
                sx={{ textAlign: 'center' }}
                className={css.heading}
              >
                Need some help with your submission?
              </Typography>
            </Grid>
            <Grid
              container
              justifyContent='space-between'
              mt='50px'
              flexDirection={['column', 'row']}
            >
              {contactChannels.map((contactChannel, index) => (
                <Bounty
                  width={[
                    '100%',
                    `calc(${(1 / eventData.bounties.length) * 100}% - 20px)`
                  ]}
                  icon={contactChannel.icon}
                  name={contactChannel.name}
                  description={contactChannel.description}
                  link={contactChannel.link}
                  linkLabel='Open Link'
                  key={index}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent='space-between'
          alignItems='center'
          position='relative'
        >
          <Ellipse3 style={{ position: 'absolute' }} />
          <Ellipse4 style={{ position: 'absolute', right: 0, top: 100 }} />
        </Grid>
        <Grid container sx={{ maxWidth: '1440px', px: '30px' }}>
          <Grid container justifyContent='space-between'>
            <Grid item width={['100%', '33.3%']}>
              <Typography variant='h2' className={css.heading}>
                FAQ
              </Typography>
            </Grid>
            <Grid item container flexDirection='column' width={['100%', '63%']}>
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  disableGutters
                  expanded={expanded === index}
                  onChange={handleChange(index)}
                  sx={{
                    background: 'transparent',
                    boxShadow: 'none',
                    borderBottom: 'solid 1px white',
                    ':last-of-type': {
                      borderBottomRightRadius: 0,
                      borderBottomLeftRadius: 0
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      expanded === index ? (
                        <Minimize style={{ marginTop: '-12px' }} />
                      ) : (
                        <Add style={{ width: '24px', height: '24px' }} />
                      )
                    }
                    sx={{ my: 4 }}
                  >
                    <Typography variant='h3' className={css.heading3}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      color='text.dark'
                      sx={{ mb: '40px' }}
                      className={css.body}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent='space-between'
            alignItems='center'
            mt='200px'
            mb='100px'
          >
            <Grid item width={1 / 2} display={['none', 'flex']}>
              <Img src={DevDiamond} width={600} alt='dev-diamond' />
            </Grid>
            <Grid item width={[1, 1 / 2]}>
              <Grid container flexDirection='column'>
                <Typography variant='h2' className={css.heading}>
                  Share your thoughts!
                </Typography>
                <Typography sx={{ my: '40px' }} className={css.body}>
                  Take a moment to fill out our survey and let us know about
                  your experience with Safe Documentation.
                </Typography>
                <Link
                  href={eventData.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Typography className={css.link}>
                    Take survey {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EventsPage

const icons = [<Gift key={0} />, <Layers key={1} />, <Building key={2} />]
const team = [
  {
    name: 'Germán Martinez',
    position: 'Developer Relations',
    image: German
  },
  {
    name: 'Louis Margot-Duclot',
    position: 'Support Engineer',
    image: Louis
  },
  {
    name: 'Valentin Seehausen',
    position: 'Developer Experience Engineer',
    image: Valle
  }
]

const contactChannels = [
  {
    name: 'Find our booth',
    description: eventData.venue.booth,
    icon: <Teach />
  },
  {
    name: 'Discord',
    description:
      'Join our Discord server by clicking the link below. The channel ' +
      eventData.discord +
      ' is dedicated to ' +
      eventData.name +
      '.',
    icon: <Discord />,
    link: '???'
  },
  {
    name: 'Stack Exchange',
    description:
      'Get support from our team by asking questions to Stack Exchange, with the tags "safe-core".',
    icon: <StackExchange />,
    link: 'https://ethereum.stackexchange.com/questions/tagged/safe-core'
  }
]

const faqs = [
  {
    question: 'What is a Safe Smart Account?',
    answer:
      'Compared to an externally owned account (EOA) which requires a seed phrase, a Safe Smart Account does not. It is a type of account that is programmable and much easier to manage. This allows you to customise your account with features such as multiple owners and transaction guards, to keep your crypto even more '
  },
  {
    question: 'Hey ABCD',
    answer: 'aze is blabla'
  },
  {
    question: 'aze is ABCD',
    answer: 'ABCD is blabla'
  },
  {
    question: 'dfdfg is ABCD',
    answer: 'ABCD is blabla'
  },
  {
    question: 'zrex is ABCD',
    answer: 'ABCD is blabla'
  }
]
