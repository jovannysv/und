import { reactive } from 'vue'
import type { Category } from './types'
import type { TrendingBusiness } from './data/mockBusinesses'

export const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'Food', value: 'food' },
  { label: 'Shops', value: 'shop' },
  { label: 'Historic Sites', value: 'historic-site' },
  { label: 'Parks', value: 'park' },
  { label: 'Venues', value: 'venue' },
  { label: 'Event Spaces', value: 'event-space' },
]

// Which screen is showing, plus the current search. Shared so the header
// (rendered inside every page) can search and navigate from anywhere.
export const nav = reactive({
  page: 'results' as 'results' | 'favorites',
  selected: null as TrendingBusiness | null,
  keyword: '',
  category: null as Category | null,
})

export function showResults() {
  nav.page = 'results'
  nav.selected = null
}

export function showFavorites() {
  nav.page = 'favorites'
  nav.selected = null
}

export function openListing(business: TrendingBusiness) {
  nav.selected = business
}

// Returns to whichever page the listing was opened from
export function closeListing() {
  nav.selected = null
}

// Clicking the active category again clears it
export function toggleCategory(category: Category) {
  nav.category = nav.category === category ? null : category
  showResults()
}

export function clearSearch() {
  nav.keyword = ''
  nav.category = null
}
