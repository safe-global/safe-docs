import type { StaticImageData } from 'next/image'

export interface TeamMemberType {
  name: string
  position: string
  image: StaticImageData
}
export interface WorkshopType {
  title: string
  location: string | null
  start: string
  end: string
  speaker: string
}
