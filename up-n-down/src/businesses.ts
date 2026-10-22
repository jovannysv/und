import { reactive } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'
import type { Business } from './types'
import type { TrendingBusiness } from './data/mockBusinesses'

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

// Hours are stored as "11am-9pm"; the card only shows the closing time.
function closingTime(hours: string | undefined): string {
  if (!hours || hours.toLowerCase() === 'closed') return 'closed today'
  return hours.split('-')[1]?.trim() ?? hours
}

export const listings = reactive({
  items: [] as TrendingBusiness[],
  loading: true,
  error: '',
})

let request: Promise<void> | undefined

// Loaded once and shared by the results and favorites pages
export function loadBusinesses(): Promise<void> {
  request ??= fetchBusinesses()
  return request
}

async function fetchBusinesses() {
  listings.loading = true
  listings.error = ''
  try {
    // Only verified businesses - matches the public read rule in firestore.rules
    const snap = await getDocs(query(collection(db, 'businesses'), where('isVerified', '==', true)))
    const today = DAYS[new Date().getDay()]
    listings.items = snap.docs.map((doc) => {
      const data = doc.data() as Omit<Business, 'id'>
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        category: data.category,
        location: data.address,
        openUntil: closingTime(data.hours?.[today]),
        tags: data.tags,
        imageUrl: data.imageUrl,
        lat: data.lat,
        lng: data.lng,
        hours: data.hours,
        isLocallyOwned: data.isLocallyOwned,
      }
    })
  } catch (err) {
    listings.error = 'Could not load businesses right now.'
    console.error('Failed to load businesses:', err)
    request = undefined // let the next page visit retry
  } finally {
    listings.loading = false
  }
}
