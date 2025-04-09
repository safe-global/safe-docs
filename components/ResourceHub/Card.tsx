import { Box, Chip, Typography } from '@mui/material'
import { sendGAEvent } from '@next/third-parties/google'

import YouTubeEmbed from '../YouTube'
import { type KnowledgeResource } from './Resources'
import css from './styles.module.css'

import Blog from '../../assets/svg/blog-post.svg'
import Podcast from '../../assets/svg/podcast.svg'

export const ProjectCard = (resource: KnowledgeResource): JSX.Element => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  return (
    <Box
      sx={{
        transition: 'all 0.2s ease-in-out',
        border: '1px solid',
        borderColor: 'transparent',
        '&:hover': {
          borderColor: 'secondary.light'
        },
        width: '100%',
        height: '100%'
      }}
      className={css.card}
      onClick={() => {
        sendGAEvent('event', 'resource_hub_link', {
          resource_url: resource.url,
          resource_type: resource.type,
          resource_name: resource.name
        })
      }}
    >
      <a
        href={resource.url}
        target='_blank'
        rel='noreferrer'
        style={{ width: '100%' }}
      >
        <div style={{ width: '100%' }}>
          {resource.type === 'Video' ? (
            <YouTubeEmbed embedId={resource.url.slice(-11)} />
          ) : resource?.image == null ? (
            resource.type === 'Blog Post' ? (
              <Blog />
            ) : (
              <Podcast />
            )
          ) : (
            <Box minHeight='100px'>
              <img alt='resource-img' src={resource.image} />
            </Box>
          )}

          <Typography mt={2} fontWeight='500' mb={0.5}>
            {resource.name}
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            className={css.description}
            mb={0.5}
          >
            {months[new Date(resource.date).getMonth()] +
              ', ' +
              new Date(resource.date).getFullYear()}
          </Typography>

          {resource.description && (
            <>
              <Typography
                variant='body2'
                color='text.secondary'
                className={css.description}
              >
                {resource.description}
              </Typography>
            </>
          )}

          <div className={css.categories}>
            <Chip
              sx={{
                borderRadius: '4px',
                height: '23px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              className={css.chip}
              label={resource.type}
            />
            {resource.tags.map(tag => (
              <Chip
                key={tag}
                sx={{
                  borderRadius: '4px',
                  height: '23px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
                className={css.chip}
                label={tag}
              />
            ))}
          </div>
        </div>{' '}
      </a>
    </Box>
  )
}
