import Typography from '@mui/material/Typography'
import Property from './Property'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Parameters: React.FC<{ parameters: any[] }> = ({ parameters }) => {
  const body = parameters.filter(p => p.in === 'body')
  const query = parameters.filter(p => p.in === 'query')

  return (
    <>
      {query.length > 0 && (
        <Typography variant='h4' sx={{ mt: 2 }}>
          Query Parameters
        </Typography>
      )}
      {query.map(parameter => (
        <Property
          key={parameter.name}
          property={{
            name: parameter.name,
            value: parameter
          }}
          required={parameter.required}
        />
      ))}
      {body.length > 0 && (
        <Typography variant='h4' sx={{ mt: 2 }}>
          Request Body
        </Typography>
      )}
      {body.map(parameter =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.entries(parameter.schema.properties ?? {})
          ?.map(([key, value]) => ({ name: key, value }))
          ?.map?.(_p => (
            <Property
              key={_p.name}
              property={_p}
              required={parameter.required}
            />
          ))
      )}
    </>
  )
}

export default Parameters
