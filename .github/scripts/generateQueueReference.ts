const fs: typeof import('fs') = require('fs')

const SCHEMA_FILE =
  'components/ApiReference/schemas/safe-queue-service-swagger.json'
const MDX_FILE =
  'components/ApiReference/generated/safe-queue-service-reference.mdx'
const EXAMPLES_DIR = 'components/ApiReference/examples/safe-queue-service'
const SPEC_URL = 'https://api.safe.global/queue/openapi.json'
const BASE_URL = 'https://api.safe.global/queue'
const PAGE = '/core-api/safe-queue-service-reference'
const METHODS = ['get', 'post', 'put', 'patch', 'delete']
const TAG_LABELS: Record<string, string> = {
  MultisigTransactions: 'Multisig transactions',
  SafeMessages: 'Messages',
  Delegates: 'Delegates',
  About: 'About'
}
// The page sections, in order. About is left out like in the other API references, and with no
// "## About" heading lib/mdx lists no TOC entry for it.
const SECTIONS = ['Multisig transactions', 'Messages', 'Delegates']
const HIDDEN_TAGS = ['About']
// Left out of the request body sample: proposing a nested transaction is an advanced case.
const BODY_SAMPLE_SKIPPED = new Set(['nestedTransaction'])
// Optional query parameters the samples set, so that list requests return data.
const QUERY_SAMPLED = new Set(['chainId', 'safe'])

// A Sepolia Safe with transactions, a message and a delegate in the service.
const SAMPLE_SAFE = '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
const SAMPLE_SAFE_2 = '0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75'
const SAMPLE_OWNER = '0xa6d3DEBAAB2B8093e69109f23A75501F864F74e2'
const SAMPLE_DELEGATE = '0xe8A11B18DA0C02ce6304347D8E0DA66C50dEf739'
const SAMPLE_SAFE_TX_HASHES = [
  '0x31d71577e5c75ba78e44426aa714bd7915a53ca5a4e6cc41ab5f300b747b420e',
  '0xfcbdc693bdf81f90c7aa39423380328e958f157748b10442aad4b013889e9ed6'
]
const SAMPLE_MESSAGE_HASH =
  '0x950cfe6090e742b709ab5f662c10c8b4e06d403a2f8c4654d86af45d93fa3777'
// A placeholder: write samples only show the request shape.
const SAMPLE_SIGNATURE =
  '0xae31da115daa589fa3cee016c756d191d4140fc0eb30c1565cdddcad35068300669abda9c56e1c5886d72c599e1af29fc70eedd16be72109aa593699661482121c'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const SAMPLE_DATE = '2025-01-01T00:00:00Z'

// Sample values by parameter or property name. The spec examples are placeholders that match
// no stored data, so these take precedence. Values are converted to the type of the schema.
const SAMPLE_VALUES: Record<string, unknown> = {
  chainId: '11155111',
  safe: SAMPLE_SAFE,
  safes: [`${SAMPLE_SAFE}:11155111`, `${SAMPLE_SAFE_2}:1`],
  safe_tx_hash: SAMPLE_SAFE_TX_HASHES[0],
  safeTxHash: SAMPLE_SAFE_TX_HASHES,
  message_hash: SAMPLE_MESSAGE_HASH,
  messageHash: SAMPLE_MESSAGE_HASH,
  delegator: SAMPLE_OWNER,
  delegate: SAMPLE_DELEGATE,
  label: 'Mobile',
  owner: SAMPLE_OWNER,
  proposer: SAMPLE_OWNER,
  proposedBy: null,
  proposedVia: 'OWNER',
  to: SAMPLE_OWNER,
  value: '0',
  data: '0x',
  operation: 0,
  nonce: '10',
  safeTxGas: '0',
  baseGas: '0',
  gasPrice: '0',
  gasToken: ZERO_ADDRESS,
  refundReceiver: ZERO_ADDRESS,
  signature: SAMPLE_SIGNATURE,
  signatures: [SAMPLE_SIGNATURE],
  signatureType: 'EOA',
  message: 'Hello Safe',
  preparedSignature: null,
  preparedSignatureEip1271: null,
  txHash: null,
  executor: null,
  failed: null,
  notes: null,
  originName: null,
  originUrl: null,
  count: 1,
  next: null,
  previous: null
}

interface Schema {
  $ref?: string
  refName?: string
  type?: string | string[]
  anyOf?: Schema[]
  items?: Schema
  properties?: Record<string, Schema>
  additionalProperties?: boolean | Schema
  required?: string[]
  enum?: unknown[]
  examples?: unknown[]
  format?: string
  description?: string
  [key: string]: unknown
}

interface Parameter {
  name: string
  in: string
  required?: boolean
  description?: string
  schema?: Schema
}

interface Content {
  'application/json'?: { schema?: Schema }
}

interface Operation {
  tags?: string[]
  summary?: string
  description?: string
  parameters?: Parameter[]
  requestBody?: { required?: boolean; content?: Content }
  responses: Record<string, { description?: string; content?: Content }>
  path?: string
  title?: string
  [key: string]: unknown
}

interface Spec {
  paths: Record<string, Record<string, Operation>>
  components?: { schemas?: Record<string, Schema> }
  [key: string]: unknown
}

interface Endpoint {
  path: string
  method: string
  operation: Operation
}

const slugify = (text: string): string =>
  text.replace(/ /g, '-').replace(/\//g, '-')

const typesOf = (schema: Schema): string[] =>
  schema.type === undefined ? [] : [schema.type].flat()

const endpoints = (spec: Spec): Endpoint[] =>
  Object.entries(spec.paths).flatMap(([path, methods]) =>
    Object.entries(methods)
      .filter(([method]) => METHODS.includes(method))
      .map(([method, operation]) => ({ path, method, operation }))
  )

function tagLabel(tag: string): string {
  if (Object.values(TAG_LABELS).includes(tag)) return tag
  const label = TAG_LABELS[tag]
  if (label === undefined)
    throw new Error(`Unknown tag "${tag}": add it to TAG_LABELS`)
  return label
}

// Adds what lib/mdx reads for the TOC: the path, the title and the readable tag of every
// operation. Running it on its own output changes nothing.
function annotate(spec: Spec): Spec {
  const titles = new Set<string>()
  const paths = Object.fromEntries(
    Object.entries(spec.paths).map(([path, methods]) => [
      path,
      Object.fromEntries(
        Object.entries(methods).map(([method, operation]) => {
          if (!METHODS.includes(method)) return [method, operation]
          const title = operation.summary
          if (!title) throw new Error(`${method} ${path} has no summary`)
          if (titles.has(title))
            throw new Error(`Two operations have the summary "${title}"`)
          titles.add(title)
          const tags = (operation.tags ?? []).map(tagLabel)
          const section = tags[0]
          if (!SECTIONS.includes(section) && !HIDDEN_TAGS.includes(section))
            throw new Error(`${method} ${path} has no known tag`)
          return [method, { ...operation, tags, path, title }]
        })
      )
    ])
  )
  return { ...spec, paths }
}

// `anyOf` of typed branches becomes one type list, because Property.tsx reads only `type`.
function flattenAnyOf(schema: Schema): Schema {
  const { anyOf, ...rest } = schema
  if (anyOf === undefined || anyOf.some(branch => branch.type === undefined))
    return schema
  const type = [...new Set(anyOf.flatMap(typesOf))]
  const typed = anyOf.filter(branch => branch.type !== 'null')
  return typed.length === 1 ? { ...typed[0], ...rest, type } : { ...rest, type }
}

function resolve(
  schema: Schema,
  schemas: Record<string, Schema>,
  seen: ReadonlySet<string> = new Set()
): Schema {
  const { $ref, ...rest } = schema
  if ($ref !== undefined) {
    const refName = $ref.split('/').pop() ?? $ref
    const target = schemas[refName]
    if (target === undefined) throw new Error(`Unknown $ref ${$ref}`)
    // An empty schema like JsonValue has nothing to show but its description.
    if (Object.keys(target).length === 0) return resolve(rest, schemas, seen)
    if (seen.has(refName)) return { refName, ...rest }
    return {
      refName,
      ...resolve({ ...target, ...rest }, schemas, new Set([...seen, refName]))
    }
  }
  const resolved: Schema = { ...rest }
  if (rest.properties !== undefined)
    resolved.properties = Object.fromEntries(
      Object.entries(rest.properties).map(([name, value]) => [
        name,
        resolve(value, schemas, seen)
      ])
    )
  if (rest.items !== undefined)
    resolved.items = resolve(rest.items, schemas, seen)
  if (rest.anyOf !== undefined)
    resolved.anyOf = rest.anyOf.map(branch => resolve(branch, schemas, seen))
  return flattenAnyOf(resolved)
}

function coerce(value: unknown, schema: Schema): unknown {
  const types = typesOf(schema)
  if (Array.isArray(value))
    return types.includes('array')
      ? value.map(item => coerce(item, schema.items ?? {}))
      : coerce(value[0], schema)
  if (types.includes('array')) return [coerce(value, schema.items ?? {})]
  if (typeof value === 'string' && /^\d+$/.test(value))
    return types.includes('integer') && !types.includes('string')
      ? Number(value)
      : value
  if (typeof value === 'number' && types.includes('string'))
    return String(value)
  return value
}

const hasSampleValue = (name: string): boolean =>
  name in SAMPLE_VALUES && SAMPLE_VALUES[name] !== null

function sample(schema: Schema, name?: string, isBody = false): unknown {
  if (name !== undefined && name in SAMPLE_VALUES)
    return coerce(SAMPLE_VALUES[name], schema)
  if (schema.examples !== undefined && schema.examples.length > 0)
    return schema.examples[0]
  if (schema.enum !== undefined && schema.enum.length > 0) return schema.enum[0]
  const types = typesOf(schema)
  if (types.includes('object') || schema.properties !== undefined)
    return Object.fromEntries(
      Object.entries(schema.properties ?? {})
        .filter(
          ([key, value]) =>
            !isBody ||
            (!BODY_SAMPLE_SKIPPED.has(key) &&
              (schema.required?.includes(key) === true ||
                value.examples !== undefined ||
                hasSampleValue(key)))
        )
        .map(([key, value]) => [key, sample(value, key)])
    )
  if (types.includes('array')) return [sample(schema.items ?? {})]
  if (types.includes('null')) return null
  if (types.includes('string'))
    return schema.format === 'date-time' ? SAMPLE_DATE : 'string'
  if (types.includes('integer') || types.includes('number')) return 0
  if (types.includes('boolean')) return false
  return null
}

function resolveParameter(
  parameter: Parameter,
  schemas: Record<string, Schema>
): Parameter {
  const schema = resolve(parameter.schema ?? {}, schemas)
  const description = parameter.description ?? schema.description
  return {
    ...parameter,
    ...(description !== undefined && { description }),
    schema
  }
}

const jsonSchema = (content?: Content): Schema | undefined =>
  content?.['application/json']?.schema

function queryString(parameters: Parameter[]): string {
  const pairs = parameters
    .filter(p => p.in === 'query')
    .filter(p => p.required === true || QUERY_SAMPLED.has(p.name))
    .flatMap(p =>
      [sample(p.schema ?? {}, p.name)].flat().map(value => `${p.name}=${value}`)
    )
  return pairs.length > 0 ? `?${pairs.join('&')}` : ''
}

const pathWithParams = (path: string, parameters: Parameter[]): string =>
  path.replace(/\{(\w+)\}/g, (_match, name: string) => {
    const parameter = parameters.find(p => p.in === 'path' && p.name === name)
    return String(sample(parameter?.schema ?? {}, name))
  })

function curl(method: string, url: string, body: unknown): string {
  const target = url.includes('?') ? `"${url}"` : url
  const lines = [
    `curl -X ${method.toUpperCase()} ${target}`,
    '    -H "Accept: application/json"',
    '    -H "content-type: application/json"',
    '    -H "Authorization: Bearer YOUR_API_KEY"'
  ]
  if (body !== undefined) {
    const json = JSON.stringify(body, null, 2)
    if (json.includes("'"))
      throw new Error(`The sample body of ${method} ${url} has a quote`)
    lines.push(`    -d '${json}'`)
  }
  return lines.join(' \\\n')
}

const INLINE_CODE = /(`+)[\s\S]*?\1/g
const FENCE = /^\s*(`{3,}|~{3,})/
const ATX_HEADING = /^#{1,6}\s+(.*?)\s*#*\s*$/

const escapeText = (text: string): string =>
  text.replace(/[{}<>]/g, char => `\\${char}`)

const escapeOutsideInlineCode = (line: string): string => {
  let result = ''
  let last = 0
  for (const match of line.matchAll(INLINE_CODE)) {
    result += escapeText(line.slice(last, match.index)) + match[0]
    last = match.index + match[0].length
  }
  return result + escapeText(line.slice(last))
}

// Escapes MDX syntax outside code. Headings become bold text, so that they do not show up in the
// TOC or between the operations.
function toMdx(description: string): string {
  let fence = ''
  return description
    .split('\n')
    .map(line => {
      const marker = line.match(FENCE)?.[1]
      if (fence !== '') {
        if (marker !== undefined && marker[0] === fence[0]) fence = ''
        return line
      }
      if (marker !== undefined) {
        fence = marker
        return line
      }
      const heading = line.match(ATX_HEADING)
      return escapeOutsideInlineCode(
        heading !== null ? `**${heading[1]}**` : line
      )
    })
    .join('\n')
}

// The components after the description start at column 0: indented, they would continue a list
// that ends the description.
function methodContent(spec: Spec, { path, method, operation }: Endpoint) {
  const schemas = spec.components?.schemas ?? {}
  const title = operation.title ?? ''
  const parameters = (operation.parameters ?? []).map(p =>
    resolveParameter(p, schemas)
  )
  const bodySchema = jsonSchema(operation.requestBody?.content)
  const body =
    bodySchema === undefined ? undefined : resolve(bodySchema, schemas)
  const allParameters: Parameter[] =
    body === undefined
      ? parameters
      : [
          ...parameters,
          {
            in: 'body',
            name: 'body',
            required: operation.requestBody?.required ?? false,
            schema: body
          }
        ]
  const responses = Object.entries(operation.responses).map(
    ([code, { content, ...response }]) => {
      const schema = jsonSchema(content)
      return {
        code,
        ...response,
        ...(schema !== undefined && {
          content: { 'application/json': { schema: resolve(schema, schemas) } }
        })
      }
    }
  )
  const success = responses.find(r => r.code.startsWith('2'))
  const successSchema = success?.content?.['application/json'].schema
  const sampleResponse =
    successSchema === undefined
      ? ''
      : `    #### Sample Response

\`\`\`json
${JSON.stringify(sample(successSchema), null, 2)}
\`\`\``
  const resolvedPath = pathWithParams(path, parameters)
  const url = BASE_URL + resolvedPath + queryString(parameters)
  const bodySample =
    body === undefined ? undefined : sample(body, undefined, true)
  const example = `${EXAMPLES_DIR}/${slugify(path).replace('-api', '')}-${method}.ts`
  const typeScriptTab = fs.existsSync(example)
    ? `\`\`\`js TypeScript
// from ${example.replace('components/ApiReference/', '../')}
\`\`\`

`
    : ''

  return `### ${title}

<Grid container justifyContent='space-between'>
  <Grid item xs={12} md={5.6}>

${toMdx(operation.description ?? '')}

<Parameters parameters={${JSON.stringify(allParameters)}} />
<Responses responses={${JSON.stringify(responses)}} />
<Feedback asPath={"${PAGE}#${slugify(title)}"} label='Did this API route run successfully?' small />
  </Grid>
  <Grid item xs={12} md={5.6}>
    <Path path="${path}" method="${method}" />

    <SampleRequestHeader method="${method}" pathWithParams="${resolvedPath}" disableSwagger="true" />

    <CH.Section>
      <CH.Code style={{boxShadow: 'none'}}>

${typeScriptTab}\`\`\`bash${typeScriptTab === '' ? '' : ' curl'}
${curl(method, url, bodySample)}
\`\`\`
      </CH.Code>
    </CH.Section>

${sampleResponse}
  </Grid>
</Grid>
<Hr style={{
  marginTop: '112px',
  marginBottom: '112px'
}} />
`
}

function generateMdx(spec: Spec): string {
  const all = endpoints(spec)
  const sections = SECTIONS.map(section => {
    const content = all
      .filter(endpoint => endpoint.operation.tags?.[0] === section)
      .map(endpoint => methodContent(spec, endpoint))
      .join('\n')
    return `<Grid my={8} />

## ${section}

<Grid my={6} />

${content}`
  })
  return `import Path from '../Path'
import Hr from '../../Hr'
import SampleRequestHeader from '../SampleRequestHeader'
import Parameters from '../Parameter'
import Responses from '../Response'
import Feedback from '../../Feedback'
import Grid from '@mui/material/Grid'

# Safe Queue Service API Reference

The Safe Queue Service API Reference is a collection of endpoints to propose, confirm and list Safe multisig transactions, messages and delegates on every supported chain.

${sections.join('\n')}`
}

async function fetchSpec(): Promise<Spec> {
  const response = await fetch(SPEC_URL, { redirect: 'error' })
  if (response.status !== 200)
    throw new Error(`GET ${SPEC_URL} answered ${response.status}`)
  return (await response.json()) as Spec
}

async function main(args: string[]): Promise<void> {
  const source = args.includes('--fetch')
    ? await fetchSpec()
    : (JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8')) as Spec)
  const spec = annotate(source)
  const outputs: Array<[string, string]> = [
    [SCHEMA_FILE, JSON.stringify(spec, null, 2) + '\n'],
    [MDX_FILE, generateMdx(spec)]
  ]
  if (args.includes('--check')) {
    const stale = outputs.filter(
      ([file, text]) =>
        !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text
    )
    for (const [file] of stale)
      console.error(`${file} is out of date: run pnpm generate-queue-reference`)
    if (stale.length > 0) process.exitCode = 1
    else console.info('The Safe Queue Service reference is up to date.')
    return
  }
  for (const [file, text] of outputs) fs.writeFileSync(file, text)
  console.info(`Wrote ${outputs.map(([file]) => file).join(' and ')}`)
}

main(process.argv.slice(2)).catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
