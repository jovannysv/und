<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import type { Business } from '../types'
import { boostOfTheDay, type TrendingBusiness } from '../data/mockBusinesses'
import logo from '../assets/logo.png'
import ListingCard from './ListingCard.vue'

const categories = ['Food', 'Shops', 'Historic Sites', 'Parks', 'Venues', 'More']
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
    <header class="header">
      <div class="header-top">
        <a href="/" class="logo">
          <img :src="logo" alt="Up'n Down Chucktown" />
        </a>

        <form class="search" role="search" @submit.prevent>
          <input class="search-input" type="search" placeholder="Search" aria-label="Search" />
          <button type="submit" class="search-button" aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.17" stroke-linecap="round" aria-hidden="true">
              <path d="M11.92 19.5a7.58 7.58 0 1 0 0-15.17 7.58 7.58 0 0 0 0 15.17ZM21.67 21.67l-3.8-3.8" />
            </svg>
          </button>
        </form>

        <div class="auth-actions">
          <button type="button" class="btn btn-login">Login</button>
          <button type="button" class="btn btn-register">Register</button>
        </div>
      </div>

      <nav class="nav-categories" aria-label="Categories">
        <button v-for="category in categories" :key="category" type="button" class="nav-item">
          {{ category }}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path d="m2.63 5.25 4.37 4.38 4.38-4.38" />
          </svg>
        </button>
      </nav>
    </header>

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
        <ListingCard :business="boostOfTheDay" />

        <h2 class="section-heading">People in Charleston have been loving these!</h2>
        <p class="section-subtitle">Based on recent visits and reviews</p>
        <p v-if="loading" class="section-subtitle">Loading businesses…</p>
        <p v-else-if="loadError" class="section-subtitle">{{ loadError }}</p>
        <p v-else-if="trendingBusinesses.length === 0" class="section-subtitle">No businesses listed yet.</p>
        <ListingCard v-for="business in trendingBusinesses" :key="business.id" :business="business" />
      </main>

      <aside class="map" aria-label="Map">
        <iframe
          class="map-frame"
          title="Map of Charleston, SC"
          src="https://www.google.com/maps?q=Charleston,+SC&z=13&output=embed"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
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

/* ---------- Header ---------- */
.header {
  border-bottom: 1px solid var(--line);
  background: var(--surface);
}

.header-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
  padding: 12px 24px 4px;
}

/* logo.png has a lot of empty margin, so crop it to the lettering */
.logo {
  display: block;
  width: 108px;
  height: 56px;
  overflow: hidden;
}

.logo img {
  display: block;
  width: 190px;
  max-width: none;
  margin: -17px 0 0 -41px;
}

.search {
  display: flex;
  flex: 0 1 320px;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
}

.search-input {
  flex: 1;
  min-width: 0;
  padding: 14px 20px;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 18px;
  color: var(--ink);
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  border: none;
  background: var(--teal);
  color: #fff;
  cursor: pointer;
}

.auth-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.btn {
  padding: 9px 18px;
  border-radius: 999px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.btn-login {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
}

.btn-register {
  border: 1px solid var(--teal);
  background: var(--teal);
  color: #fff;
}

.nav-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 24px;
  padding: 4px 24px 12px;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 16px;
  font-weight: 500;
  color: var(--ink);
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
}

.map-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
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

  .search {
    order: 3;
    flex-basis: 100%;
  }
}
</style>
