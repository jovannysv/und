import { computed } from 'vue'
import { listings } from './businesses'
import { favoriteIds } from './favorites'
import type { TrendingBusiness } from './data/mockBusinesses'

const MAX_RECOMMENDATIONS = 5

// How often each tag appears across the user's favorited listings, most-liked
// first. Five saved bakeries and one bar gives [['bakery', 5], ['bar', 1]].
export const tagRanking = computed<[string, number][]>(() => {
  const counts = new Map<string, number>()
  for (const id of favoriteIds()) {
    const business = listings.items.find((b) => b.id === id)
    for (const tag of business?.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts].sort((a, b) => b[1] - a[1])
})

// Listings the user hasn't saved yet, scored by summing the weight of each
// of their tags in the ranking above. Listings sharing no tags are left out.
export const recommendations = computed<TrendingBusiness[]>(() => {
  const weights = new Map(tagRanking.value)
  if (weights.size === 0) return []

  const saved = new Set(favoriteIds())
  return listings.items
    .filter((b) => !saved.has(b.id))
    .map((business) => ({
      business,
      score: business.tags.reduce((sum, tag) => sum + (weights.get(tag) ?? 0), 0),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.business.name.localeCompare(b.business.name))
    .slice(0, MAX_RECOMMENDATIONS)
    .map((r) => r.business)
})

// "bakery, coffee and soul food" - the top few tags, for the section subtitle
export const topTagsLabel = computed(() => {
  const names = tagRanking.value.slice(0, 3).map(([tag]) => tag.replace(/-/g, ' '))
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
})
