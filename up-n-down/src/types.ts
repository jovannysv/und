import type { Timestamp } from 'firebase/firestore'

// The fixed tag vocabulary. Keep this list closed - the recommendation engine
// matches user preferences against these exact strings, so free-text tags
// in Firestore will silently fail to match anything. If a business needs a
// tag that isn't here, add it here first, then use it in Firestore.
export type Tag =
  | 'gullah-geechee'
  | 'seafood'
  | 'soul-food'
  | 'coffee'
  | 'bar'
  | 'bakery'
  | 'vegetarian-friendly'
  | 'historic'
  | 'museum'
  | 'art'
  | 'music'
  | 'outdoor'
  | 'park'
  | 'walking-tour'
  | 'shopping'
  | 'family-owned'
  | 'family-friendly'
  | 'late-night'
  | 'free-entry'

export type Category = 'food' | 'shop' | 'historic-site' | 'park' | 'venue' | 'event-space'

export interface Business {
  id: string // Firestore document ID, not stored as a field
  name: string
  description: string
  category: Category
  tags: Tag[]
  address: string
  lat: number
  lng: number
  hours: Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', string>
  priceLevel: 1 | 2 | 3 | 4 // $ to $$$$
  imageUrl: string
  isVerified: boolean // gate for public reads - see firestore.rules
  isLocallyOwned: boolean
  createdAt: Timestamp
}

export interface UserPreferences {
  interests: Tag[]
  indoorOutdoor: 'indoor' | 'outdoor' | 'either'
}

export interface UserProfile {
  displayName: string
  preferences: UserPreferences
}

export interface FavoriteEntry {
  savedAt: Timestamp
}

export interface EventListing {
  id: string
  title: string
  businessId: string
  startsAt: Timestamp
  endsAt: Timestamp
  description: string
}
