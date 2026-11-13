/* eslint-disable security/detect-non-literal-fs-filename -- reads files of the repo only */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.join(import.meta.dirname, '..')
const API_REFERENCE = path.join(root, 'components/ApiReference')

interface Network {
  networkName: string
}

interface RemovedOperation {
  path: string
  methods: string[]
}

const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(path.join(API_REFERENCE, file), 'utf8')) as T

const networks = readJson<Network[]>('tx-service-networks.json')
const removedOperations = readJson<RemovedOperation[]>(
  'tx-service-removed-operations.json'
)
const removed = removedOperations.flatMap(({ path: route, methods }) =>
  methods.map(method => ({ route, method }))
)
const readMdx = (networkName: string) =>
  readFileSync(
    path.join(API_REFERENCE, `generated/${networkName}-reference.mdx`),
    'utf8'
  )
const exampleFiles = (networkName: string) =>
  readdirSync(path.join(API_REFERENCE, 'examples', networkName))
    .filter(file => file.endsWith('.ts'))
    .sort()

test('the denylist is not empty', () => {
  assert.ok(removed.length > 0)
})

test('no schema contains a removed operation', () => {
  for (const { networkName } of networks) {
    const { paths } = readJson<{
      paths: Record<string, Record<string, object>>
    }>(`schemas/${networkName}-swagger.json`)
    for (const [route, methods] of Object.entries(paths)) {
      const cleanRoute = route.replace(/^\/tx-service\/[^/]+/, '')
      for (const method of Object.keys(methods))
        assert.ok(
          !removed.some(o => o.route === cleanRoute && o.method === method),
          `${networkName}: ${method.toUpperCase()} ${cleanRoute}`
        )
    }
  }
})

test('no generated reference documents a removed operation', () => {
  for (const { networkName } of networks) {
    const mdx = readMdx(networkName)
    for (const { route, method } of removed)
      assert.ok(
        !mdx.includes(`<Path path="${route}" method="${method}" />`),
        `${networkName}: ${method.toUpperCase()} ${route}`
      )
  }
})

test('every example referenced by a generated reference exists', () => {
  for (const { networkName } of networks) {
    const references = [
      ...readMdx(networkName).matchAll(/^\/\/ from \.\.\/(examples\/\S+)$/gm)
    ].map(([, file]) => file)
    for (const file of references)
      assert.ok(
        existsSync(path.join(API_REFERENCE, file)),
        `${networkName}: ${file}`
      )
  }
})

test('every chain has the same example files as sepolia', () => {
  const expected = exampleFiles('sepolia')
  for (const { networkName } of networks)
    assert.deepEqual(exampleFiles(networkName), expected, networkName)
})

test('paths-metadata.json has no removed operation', () => {
  const documented = Object.entries(
    readJson<Record<string, Record<string, object>>>('paths-metadata.json')
  ).flatMap(([route, methods]) =>
    Object.keys(methods).map(method => `${method.toUpperCase()} ${route}`)
  )
  for (const { route, method } of removed) {
    const operation = `${method.toUpperCase()} ${route}`
    assert.ok(!documented.includes(operation), operation)
  }
})
