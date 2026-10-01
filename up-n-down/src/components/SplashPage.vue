<script setup lang="ts">
defineEmits<{ enter: [] }>()
</script>

<template>
  <div class="splash">
    <div class="splash-content">
      <h1 class="splash-title">Up&rsquo;n Down Chucktown</h1>
      <p class="splash-subtitle">Find the best of what Chucktown has to offer.</p>
      <Button label="Enter" class="splash-enter" @click="$emit('enter')" />
    </div>
  </div>
</template>

<style scoped>
.splash {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-image: url('../assets/splash-bg.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
}

.splash-content {
  max-width: 640px;
  padding: 0 48px;
}

.splash-title {
  margin: 0 0 16px;
  font-family: 'Odor Mean Chey', 'Inter', -apple-system, Roboto, Helvetica, sans-serif;
  font-weight: 400;
  font-size: 80px;
  line-height: 1;
  color: #fff;
}

.splash-subtitle {
  margin: 0 0 24px;
  font-family: 'Inter', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.87);
}

.splash-enter {
  background: #f4b400;
  border: none;
  color: #1a1a1a;
  font-weight: 600;
  padding: 12px 32px;
}

.splash-enter:hover {
  background: #e0a600;
}

@media (max-width: 768px) {
  .splash-title {
    font-size: 48px;
  }

  .splash-content {
    padding: 0 24px;
  }
}
</style>
