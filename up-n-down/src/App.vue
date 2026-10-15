<script setup lang="ts">
import { ref } from 'vue'
import SplashPage from './components/SplashPage.vue'
import TrendingResults from './components/TrendingResults.vue'
import ListingDetail from './components/ListingDetail.vue'
import type { TrendingBusiness } from './data/mockBusinesses'

const entered = ref(false)
const selected = ref<TrendingBusiness | null>(null)
</script>

<template>
  <SplashPage v-if="!entered" @enter="entered = true" />
  <ListingDetail v-else-if="selected" :business="selected" @back="selected = null" />
  <TrendingResults v-else @select="selected = $event" />
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
