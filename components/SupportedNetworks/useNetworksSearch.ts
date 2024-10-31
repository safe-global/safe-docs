import { useMemo } from 'react'
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

  return useMemo(() => {
    if (query.length === 0) return sortedByChainId

    const lowercaseQuery = query.toLowerCase()
    return sortedByChainId.filter(
      network =>
        network.name.toLowerCase().includes(lowercaseQuery) ||
        network.chainId.toString().includes(lowercaseQuery) ||
        network.smartAccounts?.some(account =>
          account.address?.toLowerCase().includes(lowercaseQuery)
        )
    )
  }, [sortedByChainId, query])
}
