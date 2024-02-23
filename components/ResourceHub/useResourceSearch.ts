import { useMemo } from 'react'
import Fuse from 'fuse.js'
import { type KnowledgeResource } from './Resources'

const useResourceSearch = (
  resources: KnowledgeResource[],
  query: string
): KnowledgeResource[] => {
  const sortedByDate = useMemo(
    () =>
      resources.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }),
    [resources]
  )
  const fuse = useMemo(
    () =>
      new Fuse(sortedByDate, {
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
        distance: 500,
        threshold: 0.3,
        findAllMatches: true
      }),
    [sortedByDate]
  )

  return useMemo(() => {
    if (query.length === 0) {
      return sortedByDate
    }

    return fuse.search(query).map(result => result.item)
  }, [fuse, sortedByDate, query])
}

export { useResourceSearch }
