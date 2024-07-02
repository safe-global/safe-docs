import type { StaticImageData } from 'next/image'

export interface TeamMemberType {
  name: string
  position: string
  image: StaticImageData
}
export interface WorkshopType {
  title: string
  location: string
  start: string
  end: string
  speaker: string
}
