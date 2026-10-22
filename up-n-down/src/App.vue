<script setup lang="ts">
import { ref } from 'vue'
import SplashPage from './components/SplashPage.vue'
import TrendingResults from './components/TrendingResults.vue'
import ListingDetail from './components/ListingDetail.vue'
import FavoritesPage from './components/FavoritesPage.vue'
import { closeListing, nav } from './navigation'

const entered = ref(false)
</script>

<template>
  <SplashPage v-if="!entered" @enter="entered = true" />
  <ListingDetail v-else-if="nav.selected" :key="nav.selected.id" :business="nav.selected" @back="closeListing" />
  <FavoritesPage v-else-if="nav.page === 'favorites'" />
  <TrendingResults v-else />
</template>


<style>
/* Global styles (omit 'scoped' so it applies to the whole page) */
html, body, #app {
  margin: 0;
  padding: 0;
  background-color: #F2F0EF; /* main website color */
  color: #000000;             /* my primary text color */
}
</style>
