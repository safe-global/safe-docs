import { Chip, type SxProps } from '@mui/material'

const MethodChip: React.FC<{ method?: string, sx?: SxProps }> = ({
  method,
  sx,
  ...props
}) => (
  <Chip
    sx={{ borderRadius: 1, ...sx }}
    label={method?.toUpperCase()}
    color={chipColor(method) as 'primary'}
    variant='outlined'
    size='small'
    {...props}
  />
)

export default MethodChip

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
