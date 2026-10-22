<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { TrendingBusiness } from '../data/mockBusinesses'
import { addFavorite, isFavorite, removeFavorite } from '../favorites'
import { nav } from '../navigation'
import { openAuth, session } from '../session'
import SiteHeader from './SiteHeader.vue'
import BusinessMap from './BusinessMap.vue'

const props = defineProps<{ business: TrendingBusiness }>()
defineEmits<{ back: [] }>()

const saved = computed(() => isFavorite(props.business.id))

// Guests are asked to log in first; they click Save again afterwards (UC-02 A3)
async function toggleSaved() {
  if (!session.user) {
    openAuth('login')
    return
  }
  try {
    if (!saved.value) {
      await addFavorite(props.business.id)
    } else if (window.confirm(`Remove ${props.business.name} from your favorites?`)) {
      await removeFavorite(props.business.id)
    }
  } catch (err) {
    console.error('Failed to update favorites:', err)
    window.alert('Could not update your favorites. Please try again.')
  }
}

type Day = keyof NonNullable<TrendingBusiness['hours']>

// Listed Monday-first, unlike the Sunday-first DAYS lookup in TrendingResults
const DAY_LABELS: Record<Day, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

const locallyOwned = computed(() => {
  if (props.business.isLocallyOwned === undefined) return 'Unknown'
  return props.business.isLocallyOwned ? 'Yes' : 'No'
})

// The results page may be scrolled down when a listing is opened
onMounted(() => window.scrollTo(0, 0))
</script>

<template>
  <div class="page">
    <SiteHeader />

    <div class="detail">
      <section class="info">
        <button type="button" class="back" @click="$emit('back')">
          &larr; Back to {{ nav.page === 'favorites' ? 'favorites' : 'results' }}
        </button>
        <div class="name-row">
          <h1 class="name">{{ business.name }}</h1>
          <button
            type="button"
            class="save"
            :class="{ saved }"
            :aria-pressed="saved"
            @click="toggleSaved"
          >
            <i :class="saved ? 'pi pi-heart-fill' : 'pi pi-heart'" aria-hidden="true"></i>
            {{ saved ? 'Saved' : 'Save' }}
          </button>
        </div>

        <p class="block">{{ business.description }}</p>

        <div class="block">
          <p class="label">Hours of operation</p>
          <dl v-if="business.hours" class="hours">
            <template v-for="(label, day) in DAY_LABELS" :key="day">
              <dt>{{ label }}</dt>
              <dd>{{ business.hours[day] }}</dd>
            </template>
          </dl>
          <p v-else class="muted">Hours not available.</p>
        </div>

        <div class="block">
          <p class="label">Tags:</p>
          <ul class="tags">
            <li v-for="(tag, i) in business.tags" :key="i" class="tag">{{ tag }}</li>
          </ul>
        </div>

        <p class="block">
          <span class="label">Locally owned:</span>
          {{ locallyOwned }}
        </p>
      </section>

      <aside class="map" aria-label="Map">
        <BusinessMap :businesses="[business]" :active-id="business.id" />
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

.detail {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  padding: 24px 40px 48px;
}

.info {
  flex: 1;
  min-width: 0;
  max-width: 698px;
}

.back {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 14px;
  color: var(--muted);
  cursor: pointer;
}

.name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 12px 0 32px;
}

.save {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
  cursor: pointer;
}

.save.saved {
  border-color: #e4572e;
  color: #e4572e;
}

.name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 34px;
}

.block {
  margin: 0 0 32px;
  font-family: var(--font-display);
  font-size: 20px;
  line-height: 34px;
  letter-spacing: -0.5px;
}

.label {
  margin: 0;
  font-weight: 500;
}

.muted {
  margin: 0;
  color: var(--muted);
}

.hours {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0 24px;
  margin: 0;
  font-size: 18px;
  line-height: 30px;
}

.hours dt {
  color: var(--muted);
}

.hours dd {
  margin: 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.tag {
  padding: 4px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
}

.map {
  flex-shrink: 0;
  width: 570px;
  height: 520px;
  margin-top: 36px;
  border-left: 1px solid var(--line);
  background: #eef0f3;
  isolation: isolate;
}

@media (max-width: 960px) {
  .detail {
    flex-direction: column;
    gap: 24px;
    padding: 16px 24px 48px;
  }

  .info {
    max-width: none;
    width: 100%;
  }

  .map {
    width: 100%;
    height: 320px;
    margin-top: 0;
    border-left: none;
  }
}
</style>
