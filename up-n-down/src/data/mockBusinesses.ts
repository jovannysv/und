import type { Category } from '../types'

export interface TrendingBusiness {
  id: string
  name: string
  description: string
  category?: Category
  location: string
  openUntil: string
  tags: string[]
  imageUrl?: string
  lat?: number
  lng?: number
  hours?: Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', string>
  isLocallyOwned?: boolean
  isAd?: boolean
}

const placeholder = (id: string): TrendingBusiness => ({
  id,
  name: 'Placeholder',
  description: 'Placeholder description of the place',
  location: 'Placeholder',
  openUntil: '10:00 PM',
  tags: ['Tag placeholder', 'Tag placeholder'],
})

export const boostOfTheDay: TrendingBusiness = { ...placeholder('boost-of-the-day'), isAd: true }

export const trendingBusinesses: TrendingBusiness[] = Array.from({ length: 8 }, (_, i) =>
  placeholder(`placeholder-${i + 1}`),
)
