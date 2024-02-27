import { Typography, Chip, Box } from '@mui/material'

import css from './styles.module.css'
import { type KnowledgeResource } from './Resources'
import YouTubeEmbed from '../YouTube'

import Podcast from '../../assets/svg/podcast.svg'
import Blog from '../../assets/svg/blog-post.svg'

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

  const CardContent = (
    <div style={{ width: '100%' }}>
      {resource.type === 'Video' && (
        <YouTubeEmbed embedId={resource.url.slice(-11)} />
      )}

      <Typography
        fontWeight='500'
        mt={resource.type === 'Video' ? 2 : 0}
        mb={0.5}
      >
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

      {resource.type === 'Blog Post' && (
        <>
          <Typography
            variant='body2'
            color='text.secondary'
            className={css.description}
          >
            {resource.abstract}
          </Typography>
          <Blog />
        </>
      )}

      {resource.type === 'Podcast' && <Podcast />}

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
    </div>
  )

  return (
    <Box
      sx={{
        transition: 'all 0.2s ease-in-out',
        border: '1px solid',
        borderColor: 'transparent',
        '&:hover': {
          borderColor: 'secondary.light'
        },
        width: '100%'
      }}
      className={css.card}
    >
      <a
        href={resource.url}
        target='_blank'
        rel='noreferrer'
        style={{ width: '100%' }}
      >
        {CardContent}
      </a>
    </Box>
  )
}
