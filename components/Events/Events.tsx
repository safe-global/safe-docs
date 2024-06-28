import Link from 'next/link'
import Img from 'next/image'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import Bounty from './Bounty'
import Workshop from './Workshop'
import TeamMember from './TeamMember'
import eventData from './event-data.json'
import Gift from '../../assets/svg/gift.svg'
import Building from '../../assets/svg/building.svg'
import Layers from '../../assets/svg/layers.svg'
import DevStar from '../../assets/diamond-bg.png'
import German from '../../assets/german.png'
import Louis from '../../assets/louis.jpeg'
import Valle from '../../assets/valle.jpg'
import type { TeamMemberType } from './types'

const EventsPage: React.FC = () => {
  return (
    <>
      <Grid
        container
        sx={{
          background: 'url(./event-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          mb: '200px'
        }}
      >
        <Grid
          container
          flexDirection='column'
          sx={{ maxWidth: '1440px', px: '30px' }}
        >
          <Typography
            variant='h1'
            sx={{
              mt: '100px',
              '@media (min-width: 600px)': {
                fontSize: '90px',
                fontWeight: 400,
                lineHeight: '100px'
              }
            }}
          >
            Safe at
          </Typography>
          <Typography
            variant='h1'
            sx={{
              '@media (min-width: 600px)': {
                fontSize: '90px',
                fontWeight: 400,
                lineHeight: '100px'
              }
            }}
          >
            {eventData.name}
          </Typography>
          <Typography
            sx={{
              mt: '50px',
              '@media (min-width: 600px)': {
                fontSize: '20px',
                fontWeight: 300
              }
            }}
          >
            We proudly support this event by sponsoring{' '}
            {eventData.bounties.length} submission tracks for a total of{' '}
            {eventData.bounties.reduce(
              (acc, curr) => acc + curr.prize.value,
              0
            )}
            {eventData.bounties[0].prize.currency}.
          </Typography>
          <Grid container>
            <Grid
              item
              height='220px'
              container
              flexDirection='column'
              justifyContent='space-between'
              sx={{ width: '35%' }}
            >
              <div>
                <Typography
                  color='text.dark'
                  sx={{
                    mt: '50px',
                    '@media (min-width: 600px)': {
                      fontSize: '20px',
                      fontWeight: 300
                    }
                  }}
                >
                  Date
                </Typography>
                <Typography
                  sx={{
                    mt: '10px',
                    '@media (min-width: 600px)': {
                      fontSize: '20px',
                      fontWeight: 300
                    }
                  }}
                >
                  {new Date(eventData.start).toDateString()} -{' '}
                  {new Date(eventData.end).toDateString()}
                </Typography>
              </div>
              <Link
                href={eventData.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Typography
                  sx={{
                    mt: '20px',
                    '@media (min-width: 600px)': {
                      fontSize: '18px',
                      fontWeight: 600
                    }
                  }}
                >
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
              sx={{ width: '35%' }}
            >
              <div>
                <Typography
                  color='text.dark'
                  sx={{
                    mt: '50px',
                    '@media (min-width: 600px)': {
                      fontSize: '20px',
                      fontWeight: 300
                    }
                  }}
                >
                  Venue
                </Typography>
                <Typography
                  sx={{
                    mt: '10px',
                    '@media (min-width: 600px)': {
                      fontSize: '20px',
                      fontWeight: 300
                    }
                  }}
                >
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
                <Typography
                  sx={{
                    mt: '20px',
                    '@media (min-width: 600px)': {
                      fontSize: '18px',
                      fontWeight: 600
                    }
                  }}
                >
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
          >
            <Link
              href={eventData.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Typography
                sx={{
                  mt: '200px',
                  '@media (min-width: 600px)': {
                    fontSize: '18px',
                    fontWeight: 600
                  }
                }}
              >
                Tracks and prizes
              </Typography>
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
          <Typography
            variant='h1'
            sx={{
              textAlign: 'center',
              maxWidth: '800px',
              '@media (min-width: 600px)': {
                fontSize: '60px',
                fontWeight: 400,
                lineHeight: '64px'
              }
            }}
          >
            Get rewarded by contributing to the ecosystem
          </Typography>
          <Typography
            sx={{
              mt: '20px',
              '@media (min-width: 600px)': {
                fontSize: '20px',
                fontWeight: 300
              }
            }}
          >
            Tracks you can work on at this event:
          </Typography>
        </Grid>
        <Grid container alignItems='center' flexDirection='column'>
          <Grid
            container
            sx={{ maxWidth: '1440px', px: '30px' }}
            justifyContent='space-between'
            mt='50px'
          >
            {eventData.bounties.map((bounty, index) => (
              <Bounty
                width={`calc(${(1 / eventData.bounties.length) * 100}% - 20px)`}
                icon={icons[index]}
                name={bounty.name}
                description={bounty.description}
                prize={bounty.prize.value + bounty.prize.currency}
                key={index}
              />
            ))}
          </Grid>
          <Link href={eventData.url} target='_blank' rel='noopener noreferrer'>
            <Typography
              sx={{
                mt: '80px',
                '@media (min-width: 600px)': {
                  fontSize: '18px',
                  fontWeight: 600
                }
              }}
            >
              Learn more at bounty&apos;s page{' '}
              {<ArrowForwardIosIcon sx={{ width: '16px' }} />}
            </Typography>
          </Link>
        </Grid>
      </Grid>
      <Grid container alignItems='center' flexDirection='column' mt='100px'>
        <Grid container sx={{ maxWidth: '1440px', px: '30px' }}>
          <Grid container>
            <Grid
              item
              container
              width='calc(100% - 450px)'
              flexDirection='column'
              justifyContent='center'
            >
              <Typography
                variant='caption'
                sx={{
                  mt: '100px',
                  '@media (min-width: 600px)': {
                    fontSize: '14px',
                    fontWeight: 600
                  }
                }}
              >
                Workshops
              </Typography>
              <Typography
                variant='h1'
                sx={{
                  maxWidth: '800px',
                  '@media (min-width: 600px)': {
                    fontSize: '60px',
                    fontWeight: 400,
                    lineHeight: '64px'
                  }
                }}
              >
                Hands-on insights directly from our engineers
              </Typography>
            </Grid>
            <Img src={DevStar} width={400} alt='dev-star' />
          </Grid>
          <Grid container alignContent='flex-end' flexDirection='column'>
            <Grid container width='70%'>
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
              <Typography
                sx={{
                  mt: '120px',
                  '@media (min-width: 600px)': {
                    fontSize: '32px',
                    fontWeight: 400
                  }
                }}
              >
                Meet the team at the event
              </Typography>
              <Grid container justifyContent='space-between' mt={4}>
                {eventData.team.map((member, index) => (
                  <TeamMember
                    key={index}
                    member={
                      team.find(
                        teamMember => teamMember.name === member
                      ) as TeamMemberType
                    }
                    width={`calc(${(1 / eventData.team.length) * 100}% - 20px)`}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            width='calc(100% - 450px)'
            flexDirection='column'
            justifyContent='center'
          >
            <Typography
              variant='caption'
              sx={{
                mt: '200px',
                '@media (min-width: 600px)': {
                  fontSize: '14px',
                  fontWeight: 600
                }
              }}
            >
              Safe Docs
            </Typography>
            <Typography
              variant='h1'
              sx={{
                maxWidth: '800px',
                '@media (min-width: 600px)': {
                  fontSize: '60px',
                  fontWeight: 400,
                  lineHeight: '64px'
                }
              }}
            >
              Ready to build with Safe?
            </Typography>
            <Typography
              sx={{
                mt: '20px',
                '@media (min-width: 600px)': {
                  fontSize: '20px',
                  fontWeight: 300
                }
              }}
            >
              Text details (???)
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
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
