import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useContext } from 'react'
import { NetworkContext } from './Network'
import { MdxHeading } from '../../lib/mdx'

const SampleRequestHeader: React.FC<{
  method: string
  pathWithParams: string
}> = ({ method, pathWithParams }) => {
  const [network] = useContext(NetworkContext)

  return (
    <Grid container justifyContent='space-between'>
      <MdxHeading headingLevel={4}>Sample Request</MdxHeading>
      <Button
        variant='outlined'
        size='small'
        href={method === 'get' ? `${network}/api${pathWithParams}` : network}
        target='_blank'
        rel='noopener noreferrer'
      >
        Try it on Swagger
      </Button>
    </Grid>
  )
}

export default SampleRequestHeader
