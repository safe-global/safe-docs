import { useMemo } from 'react'
import Fuse from 'fuse.js'
import { type Network } from './Networks'

export const useNetworksSearch = (
  resources: Network[],
  query: string
): Network[] => {
  const sortedByChainId = useMemo(
    () =>
      resources.sort((a, b) => {
        return a.chainId - b.chainId
      }),
    [resources]
  )
  const fuse = useMemo(
    () =>
      new Fuse(sortedByChainId, {
        keys: [
          {
            name: 'name',
            weight: 0.99
          },
          {
            name: 'chainId',
            weight: 0.5
          }
        ],
        distance: 500,
        threshold: 0.3,
        findAllMatches: true
      }),
    [sortedByChainId]
  )

  return useMemo(() => {
    if (query.length === 0) {
      return sortedByChainId
    }

    return fuse.search(query).map(result => result.item)
  }, [fuse, sortedByChainId, query])
}
