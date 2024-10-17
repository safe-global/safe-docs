import useSWR from 'swr'
import type { BareFetcher, SWRConfiguration, SWRResponse } from 'swr'

const ASHBY_API_URL =
  'https://api.ashbyhq.com/posting-api/job-board/safe.global/'

interface SecondaryLocation {
  location: string
  address: {
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
}

export type OpenPositionsResponse = SWRResponse<
  Position[],
  unknown,
  SWRConfiguration<Position[], unknown, BareFetcher<Position[]>> | undefined
>

const enum EmploymentType {
  FULL_TIME = 'FullTime',
  PART_TIME = 'PartTime',
  CONTRACTOR = 'Contractor',
  INTERN = 'Intern',
  TEMPORARY = 'Temporary'
}

export interface Position {
  title: string
  location: string
  secondaryLocations: SecondaryLocation[]
  department: string
  team: string
  isRemote: boolean
  descriptionHtml: string
  descriptionPlain: string
  publishedAt: string
  employmentType: EmploymentType
  address: {
    postalAddress: {
      addressLocality: string
      addressRegion: string
      addressCountry: string
    }
  }
  jobUrl: string
  applyUrl: string
  isListed: boolean
}

interface OpenPositions {
  apiVersion: string
  jobs: Position[]
}

const fetchOpenPositions = async (): Promise<OpenPositions['jobs']> => {
  return await fetch(ASHBY_API_URL)
    .then(async res => await res.json())
    .then(data => data.jobs)
}

export const useOpenPositions = (): OpenPositionsResponse => {
  const SWR_KEY = 'open-positions'

  const openPositions = useSWR<OpenPositions['jobs']>(
    SWR_KEY,
    fetchOpenPositions,
    {
      fallbackData: []
    }
  )

  return openPositions
}
