import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { theme } from '../../styles/theme'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import { AccordionSummary } from '@mui/material'
import Link from '@mui/material/Link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Property: React.FC<{ property: any; required?: boolean }> = ({
  property,
  required
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const reference =
    property.value?.type === 'object'
      ? property.value?.properties
      : property.value?.type === 'array'
        ? property.value?.items?.properties
        : null
  const refName = property?.value?.refName ?? property.value?.items?.refName

  return (
    <Accordion
      expanded={isExpanded}
      disableGutters
      onChange={() => {
        if (
          property.value?.type === 'object' ||
          property.value?.type === 'array'
        ) {
          setIsExpanded(!isExpanded)
        }
      }}
      sx={{
        border: 'none',
        background: 'transparent',
        color: theme.palette.grey[400],
        boxShadow: 'none',
        '&.Mui-expanded': {
          border: 'none'
        },
        '&:before': {
          display: 'none'
        },
        '& .MuiAccordionSummary-content': {
          margin: 0
        }
      }}
    >
      <AccordionSummary sx={{ pl: 0 }}>
        <Grid
          container
          pl={2}
          my={1}
          sx={{ color: ({ palette }) => palette.grey[400] }}
        >
          <Grid
            container
            item
            xs={6}
            justifyContent='flex-start'
            alignItems='center'
            fontSize='12px'
          >
            <code style={{ fontSize: '14px', marginRight: '5px' }}>
              {property.name}
            </code>
            {required === true && (
              <>
                {' - '}
                <code
                  style={{
                    color: theme.palette.error.main,
                    fontSize: '10px',
                    display: 'inline-block',
                    marginLeft: '5px'
                  }}
                >
                  required
                </code>
              </>
            )}
          </Grid>
          <Grid item xs={6} flexDirection='column'>
            <code
              style={{
                fontSize: '14px'
              }}
            >
              <Link>{refName}</Link>
              {property.value?.type === 'array'
                ? '[]'
                : property.value?.type === 'object'
                  ? ''
                  : property.value?.type}
            </code>
            <Typography
              variant='body1'
              color='grey.300'
              sx={{
                '@media (min-width:600px)': {
                  fontSize: '14px'
                }
              }}
            >
              {property.value?.description}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      {reference != null && (
        <AccordionDetails>
          {Object.entries(reference as Record<string, string>).map(
            ([name, value]) => (
              <Property
                key={name}
                property={{ name, value }}
                required={
                  property.value.required?.includes(name) ??
                  property.value.items.required?.includes(name)
                }
              />
            )
          )}
        </AccordionDetails>
      )}
    </Accordion>
  )
}

export default Property
