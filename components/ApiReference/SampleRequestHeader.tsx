import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useContext } from 'react'
import { NetworkContext } from './Network'
import { MdxHeading } from '../Mdx'

const SampleRequestHeader: React.FC<{
  method: string
  pathWithParams: string
}> = ({ method, pathWithParams }) => {
  const [network] = useContext(NetworkContext)

  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <MdxHeading headingLevel={4}>Sample Request</MdxHeading>
      <Button
        variant='text'
        size='small'
        href={network}
        target='_blank'
        rel='noopener noreferrer'
        sx={{
          mt: 1,
          height: '36px',
          color: 'rgba(249,250,251,.7)',
          backgroundColor: ({ palette }) => palette.grey[900]
        }}
      >
        Try it on Swagger
      </Button>
    </Grid>
  )
}

export default SampleRequestHeader
