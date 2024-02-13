import NextLink from 'next/link'

import { Card, Typography, Grid } from '@mui/material'
import ArrowIcon from '../../assets/svg/arrow-outward.svg'

import css from './styles.module.css'

const CustomCard: React.FC<{
  title: string
  description: string
  url: string
  icon: JSX.Element
  newTab?: boolean
}> = ({ title, description, url, icon, newTab }) => (
  <Card
    sx={{
      transition: 'all 0.2s ease-in-out',
      border: '1px solid',
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      '&:hover': {
        borderColor: 'secondary.light'
      },
      width: '100%'
    }}
    className={css.card}
  >
    <NextLink
      href={url}
      target={newTab === null || newTab === undefined ? '_blank' : ''}
      rel='noreferrer'
      style={{ width: '100%' }}
    >
      <div style={{ width: '100%' }}>
        <Grid
          item
          container
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
        >
          {icon}
          <ArrowIcon className={css.icon} />
          <Typography fontWeight='500' variant='h4' mt={1} mb={1}>
            {title}
          </Typography>
        </Grid>
        <Typography
          variant='body2'
          color='text.secondary'
          className={css.description}
        >
          {description}
        </Typography>
      </div>
    </NextLink>
  </Card>
)

export default CustomCard
