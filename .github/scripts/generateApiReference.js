const fs = require('fs')
const { capitalize } = require('lodash')

const jsonFile = require('../../components/ApiReference/mainnet-swagger.json')
const pathsMetadata = require('../../components/ApiReference/paths-metadata.json')

const curlify = req =>
  `curl -X ${req.method} ${req.url} \\
    -H "Accept: application/json" \\
    -H "content-type: application/json" \\
    ${!req.body ? '' : `-d '${req.body}'`}`

const sampleSafe = '0x5A93Fe8eBBf78738468c10894D7f36fA247b71C0'

const generateSampleApiResponse = async (path, method, query) => {
  const fetch = await import('node-fetch')

  let response
  const url = `https://safe-transaction-mainnet.safe.global/api${path}${
    query ?? ''
  }`
  if (method === 'get' && !url.includes('{')) {
    try {
      response = await fetch.default(url).then(async res => await res.json())
    } catch (error) {
      console.error(error)
    }
  }
  if (response != null) {
    if (Array.isArray(response)) response = response.slice(0, 2)
    if (response.results)
      response = { ...response, results: response.results.slice(0, 2) }
    fs.writeFileSync(
      `./components/ApiReference/examples/${slugify(path)}-${method}.json`,
      JSON.stringify(response, null, 2)
    )
  }
}

const slugify = text => text?.replace?.(/ /g, '_').replace(/\//g, '_')
const resolveRef = ref => jsonFile.definitions[ref.split('/').pop()]
const resolveRefs = obj => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (key === '$ref') {
        obj = resolveRef(obj[key])
      } else {
        obj[key] = resolveRefs(obj[key])
      }
    }
  }
  return obj
}

const mainnetApiJson = resolveRefs(jsonFile)

const addMethodContext = json => ({
  ...json,
  paths: Object.entries(json.paths).reduce((acc, [path, methods]) => {
    const newMethods = Object.entries(methods).reduce(
      (acc, [method, data]) => ({
        ...acc,
        [method]: {
          ...data,
          path,
          title: pathsMetadata[path]?.[method]?.title ?? '',
          additionalInfo: pathsMetadata[path]?.[method]?.additionalInfo ?? ''
        }
      }),
      {}
    )

    return {
      ...acc,
      [path]: newMethods
    }
  }, {})
})

const getApiJson = async url => {
  const response = await fetch(url + '/?format=openapi')
  const json = await response.json()
  const withContext = addMethodContext(json)
  fs.writeFileSync(
    './components/ApiReference/mainnet-swagger.json',
    JSON.stringify(withContext, null, 2)
  )
  return withContext
}

const generateMethodContent = (path, method) => {
  const _method = mainnetApiJson.paths[path][method]
  const responses = Object.entries(_method.responses).map(
    ([code, { schema, ...data }]) => ({
      code,
      schema:
        schema?.['$ref'] !== undefined
          ? resolveRef(schema['$ref'])
          : {
              ...schema,
              items:
                schema?.items?.['$ref'] !== undefined
                  ? resolveRef(schema.items['$ref'])
                  : schema?.items
            },
      ...data
    })
  )
  const title =
    pathsMetadata[path]?.[method]?.title ??
    path.replace(/{/g, '\\{').replace(/}/g, '\\}') +
      ' - ' +
      method.toUpperCase()

  const hasExample = fs.existsSync(
    `./components/ApiReference/examples/${slugify(path)}-${method}.ts`
  )

  const hasResponse = fs.existsSync(
    `./components/ApiReference/examples/${slugify(path)}-${method}.json`
  )

  generateSampleApiResponse(
    path,
    method,
    '?limit=2' +
      (_method.parameters.map(p => p.name).includes('safe')
        ? `&safe=${sampleSafe}`
        : '')
  )

  return `### ${title}

<Grid container justifyContent='space-between' mb={8}>
  <Grid item xs={5.6}>

${_method.summary ?? ''}

${_method.description.replace(/{/g, '\\{').replace(/}/g, '\\}') ?? ''}

${_method.additionalInfo ?? ''}

  <Parameters parameters={${JSON.stringify(_method.parameters ?? [])}} />
  <Responses responses={${JSON.stringify(responses)}} />
  <Feedback asPath={"/api-reference#${slugify(
    title
  )}"} label='Did this API route run successfully?' small />
</Grid>
  <Grid item xs={5.6}>
   <Path path="${path}" method="${method}" />
   #### Sample Request
   <CH.Section>
    <CH.Code>
    ${
      hasExample
        ? `
      \`\`\`js query.js
        // from ./examples/${slugify(path)}-${method}.ts
      \`\`\`
    `
        : ''
    }

\`\`\`bash ${hasExample ? 'curl.sh' : ''}
${curlify({ url: path, method: method.toUpperCase(), body: '' })}
\`\`\`
      </CH.Code>
    </CH.Section>
    ${
      hasResponse
        ? `#### Sample Response
    \`\`\`json
    ${fs.readFileSync(
      `./components/ApiReference/examples/${slugify(path)}-${method}.json`,
      'utf-8'
    )}
    \`\`\``
        : ''
    }
   </Grid>
</Grid>
`
}

const generatePathContent = path =>
  `${Object.keys(mainnetApiJson.paths[path])
    .filter(method => method !== 'parameters')
    .map(method => generateMethodContent(path, method))
    .join('\n')}`

const generateCategoryContent = category => {
  return `## ${capitalize(category.title)}

  ${category.paths.map(path => generatePathContent(path)).join('\n')}`
}

const getCategories = version =>
  Object.keys(mainnetApiJson.paths)
    .filter(path => path.includes(version))
    .map(path => {
      const pathname = path.replace('/' + version + '/', '').slice(0, -1)
      return {
        title: pathname.split('/')[0],
        paths: Object.entries(mainnetApiJson.paths)
          .filter(([key]) => key.includes(path))
          .flat()
          .filter((value, index) => index % 2 === 0)
      }
    })
    .filter(
      (category, index, self) =>
        index === self.findIndex(t => t.title === category.title) &&
        category.title !== ''
    )

const generateMainContent = () => {
  const categories = [...getCategories('v1')]

  return `
import Path from './Path'
import Parameters from './Parameter'
import NetworkSwitcher from './Network'
import Responses from './Response'
import Feedback from '../Feedback'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import '@code-hike/mdx/dist/index.css'

# Safe Transaction Service API Reference

This is the Safe Transaction Service API Reference. It is a
collection of endpoints that allow you to keep track of
transactions sent via Safe smart contracts.

The Transaction Service is available on [multiple networks](../../advanced/api-supported-networks), at
different endpoints.

<NetworkSwitcher />

  ${categories.map(path => generateCategoryContent(path)).join('\n')}
`
}

const main = async () => {
  await getApiJson('https://safe-transaction-mainnet.safe.global')
  const mdxContent = generateMainContent()
  fs.writeFileSync(
    `./components/ApiReference/generated-reference.mdx`,
    mdxContent
  )
}

main()
