<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import logo from './assets/logo.png'
</script>

<template>
  <header class="site-header">
    <img :src="logo" alt="Up'n'Down Chucktown" class="site-logo" />
  </header>
  <HelloWorld />
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
}

.site-logo {
  height: 40px;
  width: auto;
}
</style>
