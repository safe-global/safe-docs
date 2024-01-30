import { useMemo } from 'react'
import Fuse from 'fuse.js'
import { type KnowledgeResource } from './Resources'

const useResourceSearch = (
  resources: KnowledgeResource[],
  query: string
): KnowledgeResource[] => {
  const fuse = useMemo(
    () =>
      new Fuse(resources, {
        keys: [
          {
            name: 'name',
            weight: 0.99
          },
          {
            name: 'abstract',
            weight: 0.5
          },
          {
            name: 'tags',
            weight: 0.5
          }
        ],
        threshold: 0.3,
        findAllMatches: true
      }),
    [resources]
  )

  return useMemo(() => {
    if (query.length === 0) {
      return resources
    }

    return fuse.search(query).map(result => result.item)
  }, [fuse, resources, query])
}

export { useResourceSearch }
