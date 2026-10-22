<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listings, loadBusinesses } from '../businesses'
import { favoriteIds } from '../favorites'
import { openListing, showResults } from '../navigation'
import { openAuth, session } from '../session'
import type { TrendingBusiness } from '../data/mockBusinesses'
import ListingCard from './ListingCard.vue'
import BusinessMap from './BusinessMap.vue'
import SiteHeader from './SiteHeader.vue'

// Newest first, matching the order they were saved in
const favorites = computed(() =>
  favoriteIds()
    .map((id) => listings.items.find((b) => b.id === id))
    .filter((b): b is TrendingBusiness => b !== undefined),
)

const activeBusinessId = ref<string | null>(null)

onMounted(() => {
  window.scrollTo(0, 0)
  loadBusinesses()
})
</script>

<template>
  <div class="page">
    <SiteHeader />

    <div class="layout">
      <main class="main">
        <h1 class="page-title">My Favorites</h1>

        <template v-if="!session.user">
          <p class="empty">Log in to see the places you've saved.</p>
          <button type="button" class="action" @click="openAuth('login')">Log in</button>
        </template>
        <p v-else-if="listings.loading" class="empty">Loading…</p>
        <p v-else-if="listings.error" class="empty">{{ listings.error }}</p>
        <template v-else-if="favorites.length === 0">
          <p class="empty">You haven't saved anything yet. Open a listing and click Save to add it here.</p>
          <button type="button" class="action" @click="showResults">Browse listings</button>
        </template>
        <template v-else>
          <p class="count">{{ favorites.length }} saved {{ favorites.length === 1 ? 'place' : 'places' }}</p>
          <ListingCard
            v-for="business in favorites"
            :key="business.id"
            :business="business"
            class="clickable"
            @click="openListing(business)"
            @mouseenter="activeBusinessId = business.id"
            @focusin="activeBusinessId = business.id"
          />
        </template>
      </main>

      <aside class="map" aria-label="Map">
        <BusinessMap :businesses="favorites" :active-id="activeBusinessId" />
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

.page-title {
  margin: 4px 0 0;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -1px;
}

.count {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.empty {
  margin: 24px 0 16px;
  font-size: 16px;
  color: var(--muted);
}

.action {
  padding: 9px 18px;
  border: 1px solid var(--teal);
  border-radius: 999px;
  background: var(--teal);
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
}

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
