<script setup lang="ts">
import type { TrendingBusiness } from '../data/mockBusinesses'

defineProps<{ business: TrendingBusiness }>()
</script>

<template>
  <article class="listing">
    <div class="listing-image">
      <svg width="40" height="40" viewBox="0 0 61 61" fill="none" stroke="currentColor" stroke-width="4.36" aria-hidden="true">
        <path d="M30.38 51.26c11.53 0 20.88-9.35 20.88-20.88S41.91 9.5 30.38 9.5 9.5 18.85 9.5 30.38s9.35 20.88 20.88 20.88Z" />
        <path d="M30.38 43.67c7.34 0 13.29-5.95 13.29-13.29s-5.95-13.29-13.29-13.29-13.29 5.95-13.29 13.29 5.95 13.29 13.29 13.29Z" />
        <path d="M5.7 11.39v15.19c0 .76.3 1.48.83 2.02.54.53 1.26.83 2.02.83v19.94M11.39 11.39v15.19M55.06 11.39c-3.8 2.85-5.7 8.55-5.7 15.19h5.7v22.78" />
      </svg>
      <button type="button" class="next-photo" aria-label="Next photo">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5.25 2.63 9.63 7l-4.38 4.38" />
        </svg>
      </button>
    </div>

    <div class="listing-body">
      <div class="listing-title-row">
        <h3 class="listing-title">{{ business.name }}</h3>
        <span v-if="business.isAd" class="ad-badge">Ad</span>
      </div>

      <div class="listing-meta">
        <span class="meta-item">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.44" aria-hidden="true">
            <path d="M9 16.2s5.4-4.68 5.4-8.55a5.4 5.4 0 0 0-10.8 0C3.6 11.52 9 16.2 9 16.2Z" />
            <path d="M9 9.45a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z" />
          </svg>
          {{ business.location }}
        </span>
        <span class="open-status"><span class="open">Open</span> until {{ business.openUntil }}</span>
      </div>

      <p class="listing-description">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.44" stroke-linejoin="round" aria-hidden="true">
          <path d="M2.7 3.6h12.6v8.1H8.1l-3.6 3.15V11.7H2.7V3.6Z" />
        </svg>
        <span>{{ business.description }}</span>
      </p>

      <ul class="tags">
        <li v-for="(tag, i) in business.tags" :key="i" class="tag">{{ tag }}</li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.listing {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
}

.listing-image {
  position: relative;
  flex-shrink: 0;
  width: 98px;
  height: 98px;
  border-radius: 6px;
  background: linear-gradient(140deg, #f1d9b5 0%, #d9a56b 100%);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
}

.listing-image > svg {
  opacity: 0.85;
}

.next-photo {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  cursor: pointer;
}

.listing-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.listing-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.listing-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.65px;
  line-height: 1.2;
  color: var(--ink);
}

.ad-badge {
  padding: 1px 6px;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.listing-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 16px;
  font-size: 14px;
  color: var(--ink);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.open {
  color: var(--green);
  font-weight: 600;
}

.listing-description {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

.listing-description svg {
  flex-shrink: 0;
  color: var(--ink);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.tag {
  padding: 4px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
}
</style>
