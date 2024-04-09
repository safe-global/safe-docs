import { Chip } from '@mui/material'

const Method: React.FC<{ method?: string }> = ({ method }) => (
  <Chip
    sx={{ borderRadius: 1 }}
    label={method}
    color={chipColor(method) as 'primary'}
    variant='outlined'
    size='small'
  />
)

export default Method

const chipColor = (method?: string): string => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'primary'
    case 'POST':
      return 'info'
    case 'PUT':
      return 'info'
    case 'DELETE':
      return 'error'
    default:
      return 'secondary'
  }
}
