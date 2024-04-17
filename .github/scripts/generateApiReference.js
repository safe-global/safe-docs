const fs = require('fs')
const { capitalize } = require('lodash')

const jsonFile = require('../../components/ApiReference/mainnet-swagger.json')
const pathsMetadata = require('../../components/ApiReference/paths-metadata.json')

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
    path.replace(/{/g, '\\{').replace(/}/g, '\\}') + ' - ' + method.toUpperCase()

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
    )}"} label='Was this section helpful?' small />
</Grid>
  <Grid item xs={5.6}>
   <Path path="${path}" method="${method}" />
   ${
     pathsMetadata[path]?.[method]?.example === true
       ? `
    \`\`\`js query.js
      // from ./examples/${slugify(path)}.ts
    \`\`\`
  `
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
