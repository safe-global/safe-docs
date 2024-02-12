import { Card, Typography } from '@mui/material'

import css from './styles.module.css'

const CustomCard: React.FC<{
  title: string
  description: string
  url: string
}> = ({ title, description, url }) => (
  <Card
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
    <a href={url} target='_blank' rel='noreferrer' style={{ width: '100%' }}>
      <div style={{ width: '100%' }}>
        <Typography fontWeight='500' mb={0.5}>
          {title}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          className={css.description}
        >
          {description}
        </Typography>
      </div>
    </a>
  </Card>
)

export default CustomCard
