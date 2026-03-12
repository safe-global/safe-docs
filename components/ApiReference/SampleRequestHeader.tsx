import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useContext } from 'react'
import { NetworkContext } from './Network'
import { MdxHeading } from '../../lib/mdx'

const SampleRequestHeader: React.FC<{
  method: string
  pathWithParams: string
  disableSwagger: boolean
}> = ({ method, pathWithParams, disableSwagger }) => {
  const [network] = useContext(NetworkContext)

  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <MdxHeading headingLevel={4}>Sample Request</MdxHeading>
      {!disableSwagger && (
        <Button
          variant='text'
          size='small'
          href={network}
          target='_blank'
          rel='noopener noreferrer'
          sx={{
            mt: 1,
            height: '36px',
            color: 'text.primary',
            backgroundColor: 'background.paper'
          }}
        >
          Try it on Swagger
        </Button>
      )}
    </Grid>
  )
}

export default SampleRequestHeader
