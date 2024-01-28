import { Typography, Chip, Box } from '@mui/material'

import css from './styles.module.css'
// import { ECOSYSTEM_DATA_URL } from '@/config/constants'
import { type KnowledgeResource } from './Resources'
import YouTubeEmbed from '../YouTube'
// import clsx from 'clsx'

export const ProjectCard = (resource: KnowledgeResource): JSX.Element => {
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

      {resource.type === 'Blog post' && (
        <Typography
          variant='body2'
          color='text.secondary'
          className={css.description}
        >
          {resource.abstract}
        </Typography>
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
    </div>
  )

  return (
    <Box
      sx={{
        transition: 'all 0.2s ease-in-out',
        border: '1px solid',
        borderColor: 'transparent',
        '&:hover':
          resource.type === 'Video'
            ? undefined
            : {
                borderColor: 'secondary.light'
              }
      }}
      className={css.card}
    >
      {resource.type === 'Video' ? (
        CardContent
      ) : (
        <a href={resource.url} target='_blank' rel='noreferrer'>
          {CardContent}
        </a>
      )}
    </Box>
  )
}
