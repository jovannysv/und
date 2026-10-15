<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import type { Business } from '../types'
import type { TrendingBusiness } from '../data/mockBusinesses'
import ListingCard from './ListingCard.vue'
import BusinessMap from './BusinessMap.vue'
import SiteHeader from './SiteHeader.vue'

defineEmits<{ select: [business: TrendingBusiness] }>()

const filters = ['Price', 'Cuisine', 'Distance', 'Rating', 'Open now', 'Outdoor seating']

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

// Hours are stored as "11am-9pm"; the card only shows the closing time.
function closingTime(hours: string | undefined): string {
  if (!hours || hours.toLowerCase() === 'closed') return 'closed today'
  return hours.split('-')[1]?.trim() ?? hours
}

const trendingBusinesses = ref<TrendingBusiness[]>([])
const loading = ref(true)
const loadError = ref('')

// Seeded by today's date rather than Math.random(), so every visitor sees the
// same pick all day and it doesn't change on reload. Rolls over at midnight.
function dailyIndex(length: number): number {
  const dateKey = new Date().toDateString()
  let hash = 0
  for (const char of dateKey) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash % length
}

const boostOfTheDay = computed<TrendingBusiness | null>(() => {
  const pool = trendingBusinesses.value
  if (pool.length === 0) return null
  return { ...pool[dailyIndex(pool.length)], isAd: true }
})

// The map highlights the last hovered listing and stays there on mouse-out.
const activeBusinessId = ref<string | null>(null)

onMounted(async () => {
  try {
    // Only verified businesses - matches the public read rule in firestore.rules
    const snap = await getDocs(query(collection(db, 'businesses'), where('isVerified', '==', true)))
    const today = DAYS[new Date().getDay()]

    trendingBusinesses.value = snap.docs.map((doc) => {
      const data = doc.data() as Omit<Business, 'id'>
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
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
    loadError.value = 'Could not load businesses right now.'
    console.error('Failed to load businesses:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <SiteHeader />

    <div class="layout">
      <main class="main">
        <p class="recommending-label">Currently Recommending:</p>
        <div class="title-row">
          <h1 class="page-title">Trending in Charleston</h1>
          <div class="sort">
            <span class="sort-label">Sort:</span>
            <strong>Recommended</strong>
          </div>
        </div>

        <div class="filters">
          <button type="button" class="filter-pill">All</button>
          <button v-for="filter in filters" :key="filter" type="button" class="filter-pill">
            {{ filter }}
          </button>
        </div>

        <h2 class="section-heading">
          Boost of the Day!
          <span class="info-badge" title="Sponsored placement">i</span>
        </h2>
        <p v-if="!boostOfTheDay" class="section-subtitle">{{ loading ? 'Loading…' : 'No boost today.' }}</p>
        <ListingCard
          v-else
          :business="boostOfTheDay"
          class="clickable"
          @click="$emit('select', boostOfTheDay)"
          @mouseenter="activeBusinessId = boostOfTheDay.id"
          @focusin="activeBusinessId = boostOfTheDay.id"
        />

        <h2 class="section-heading">People in Charleston have been loving these!</h2>
        <p class="section-subtitle">Based on recent visits and reviews</p>
        <p v-if="loading" class="section-subtitle">Loading businesses…</p>
        <p v-else-if="loadError" class="section-subtitle">{{ loadError }}</p>
        <p v-else-if="trendingBusinesses.length === 0" class="section-subtitle">No businesses listed yet.</p>
        <ListingCard
          v-for="business in trendingBusinesses"
          :key="business.id"
          :business="business"
          class="clickable"
          @click="$emit('select', business)"
          @mouseenter="activeBusinessId = business.id"
          @focusin="activeBusinessId = business.id"
        />
      </main>

      <aside class="map" aria-label="Map">
        <BusinessMap :businesses="trendingBusinesses" :active-id="activeBusinessId" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--surface);
  font-family: var(--font-body);
  color: var(--ink);
}

.clickable {
  cursor: pointer;
}

/* ---------- Layout ---------- */
.layout {
  display: flex;
  align-items: flex-start;
}

.main {
  flex: 1;
  min-width: 0;
  max-width: 1150px;
  padding: 16px 24px 48px;
}

.map {
  position: sticky;
  top: 0;
  align-self: flex-start;
  flex-shrink: 0;
  width: 440px;
  height: 100vh;
  border-left: 1px solid var(--line);
  background: #eef0f3;
  /* Leaflet panes use z-indexes up to 1000; keep them inside the map */
  isolation: isolate;
}

/* ---------- Page heading + filters ---------- */
.recommending-label {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

.title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
}

.page-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -1px;
  color: var(--ink);
}

.sort {
  display: flex;
  gap: 6px;
  font-size: 15px;
}

.sort-label {
  color: var(--muted);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.filter-pill {
  padding: 9px 18px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
  cursor: pointer;
}

/* ---------- Sections ---------- */
.section-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 28px 0 0;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: var(--ink);
}

.section-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.info-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--muted);
  border-radius: 50%;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
}

/* ---------- Responsive ---------- */
@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .main {
    width: 100%;
    box-sizing: border-box;
  }

  .map {
    position: relative;
    width: 100%;
    height: 320px;
    border-top: 1px solid var(--line);
    border-left: none;
  }
}
</style>
