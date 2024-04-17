import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import Property from './Property'
import Add from '@mui/icons-material/Add'
import Hr from '../Hr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Response: React.FC<{ response: any, index: number }> = ({
  response,
  index
}) => {
  const isSuccess = response.code.startsWith('2') === true
  const type = response.schema?.type
  const properties =
    type === undefined
      ? []
      : Object.entries(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        type === 'object'
          ? response.schema?.properties
          : response.schema?.items
      ).map(([key, value]) => ({ name: key, value }))

  return (
    <>
      <Accordion
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '5px',
          boxShadow: 'none',
          ':before': {
            backgroundColor: 'transparent'
          }
        }}
        defaultExpanded={index === 0}
        expanded={properties.length === 0 ? false : undefined}
      >
        <AccordionSummary
          sx={{
            color: 'text.primary',
            borderRadius: '5px',
            backgroundColor: 'transparent',
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(45deg)'
            },
            mt: 1,
            '& .Mui-expanded': {
              margin: 0
            }
          }}
          aria-controls={`panel${index}d-content`}
          id={`panel${index}d-header`}
          expandIcon={properties?.length > 0 ? <Add /> : null}
        >
          <Grid container justifyContent='space-between'>
            <Grid item width='calc(100% - 80px)'>
              <Grid item container justifyContent='space-between'>
                {response.code}{' '}
                {response.description?.length > 0
                  ? response?.description
                  : 'OK'}
                {type !== undefined && ' - ' + type}
                <Typography
                  variant='body1'
                  color='grey.500'
                  ml={1}
                  sx={{
                    '@media (min-width:600px)': {
                      fontSize: '14px'
                    }
                  }}
                >
                  application/json
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Chip
                label={isSuccess ? 'Success' : 'Error'}
                color={isSuccess ? 'success' : 'error'}
                variant='outlined'
                size='small'
                sx={{
                  borderRadius: 1,
                  mr: 1,
                  backgroundColor: isSuccess ? 'success.darker' : 'error.darker'
                }}
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
      <Hr />
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Responses: React.FC<{ responses: any[] }> = ({ responses }) => {
  return (
    <Grid sx={{ mt: 2 }}>
      <Typography variant='h4' gutterBottom>
        Responses
      </Typography>
      <Hr />
      {responses?.map?.((response, index) => (
        <Response key={index} index={index} response={response} />
      ))}
    </Grid>
  )
}

export default Responses
