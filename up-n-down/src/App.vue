<script setup lang="ts">
import { ref } from 'vue'
import SplashPage from './components/SplashPage.vue'
import TrendingResults from './components/TrendingResults.vue'

const entered = ref(false)
</script>

<template>
  <SplashPage v-if="!entered" @enter="entered = true" />
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
