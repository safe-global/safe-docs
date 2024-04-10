import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import Property from './Property'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Response: React.FC<{ response: any, index: number }> = ({
  response,
  index
}) => {
  const isSuccess = response.code.startsWith('2') === true
  const type = response.schema?.type
  const properties =
    type === undefined
      ? null
      : Object.entries(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        type === 'object'
          ? response.schema?.properties
          : response.schema?.items
      ).map(([key, value]) => ({ name: key, value }))

  return (
    <div>
      <Accordion
        disableGutters
        sx={{
          '&.Mui-expanded': { margin: '0px' },
          backgroundColor: 'transparent',
          borderRadius: '5px',
          boxShadow: 'none',
          ':before': {
            backgroundColor: 'transparent'
          }
        }}
        defaultExpanded={index === 0}
        // disabled={accordion.disabled}
      >
        <AccordionSummary
          sx={{
            color: 'text.primary',
            borderRadius: '5px',
            my: -1,
            backgroundColor: 'transparent'
          }}
          aria-controls={`panel${index}d-content`}
          id={`panel${index}d-header`}
        >
          <Grid container justifyContent='space-between'>
            <Grid item width='calc(100% - 80px)'>
              {response.code}{' '}
              {response.description?.length > 0 ? response?.description : 'OK'}
              {type !== undefined && ' - ' + type}
            </Grid>
            <Grid item>
              <Chip
                label={isSuccess ? 'Success' : 'Error'}
                color={isSuccess ? 'primary' : 'error'}
                variant='outlined'
                size='small'
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            textAlign: 'justify',
            borderRadius: '5px'
          }}
        >
          {properties
            ?.filter(
              property =>
                !(
                  type === 'array' &&
                  (property.name === 'required' || property.name === 'type')
                )
            )
            ?.map?.((property, index) => {
              return type === 'object' ? (
                    <Property key={index} property={property} />
              ) : (
                Object.entries(property.value as Record<string, unknown>)
                  .map(([key, value]) => ({
                    name: key,
                    value
                  }))
                  .map((property, index) => (
                            <Property key={index} property={property} />
                  ))
              )
            })}{' '}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Responses: React.FC<{ responses: any[] }> = ({ responses }) => {
  return (
    <Grid sx={{ mt: 2 }}>
      <Typography variant='h4' gutterBottom>
        Responses
      </Typography>
      {responses?.map?.((response, index) => (
        <Response key={index} index={index} response={response} />
      ))}
    </Grid>
  )
}

export default Responses
