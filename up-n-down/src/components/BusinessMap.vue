<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { TrendingBusiness } from '../data/mockBusinesses'

const props = defineProps<{
  businesses: TrendingBusiness[]
  activeId: string | null
}>()

const CHARLESTON: L.LatLngTuple = [32.7765, -79.9311]

// Circle markers are drawn as SVG, so they sidestep Leaflet's default PNG
// marker icons (which Vite doesn't resolve) and can be restyled on hover.
const baseStyle: L.CircleMarkerOptions = { radius: 7, color: '#fff', weight: 2, fillColor: '#2f9e91' /* --teal */, fillOpacity: 1 }
const activeStyle: L.CircleMarkerOptions = { radius: 11, color: '#fff', weight: 3, fillColor: '#e4572e', fillOpacity: 1 }

const container = ref<HTMLDivElement>()
let map: L.Map | undefined
const markers = new Map<string, L.CircleMarker>()

function hasCoords(b: TrendingBusiness): b is TrendingBusiness & { lat: number; lng: number } {
  return typeof b.lat === 'number' && typeof b.lng === 'number'
}

function renderMarkers() {
  if (!map) return
  markers.forEach((marker) => marker.remove())
  markers.clear()

  for (const business of props.businesses.filter(hasCoords)) {
    const marker = L.circleMarker([business.lat, business.lng], baseStyle)
      .bindTooltip(business.name, { direction: 'top', offset: [0, -8] })
      .addTo(map)
    markers.set(business.id, marker)
  }

  if (markers.size > 0) {
    map.fitBounds(L.featureGroup([...markers.values()]).getBounds(), { padding: [40, 40], maxZoom: 15 })
  }
}

function highlight(id: string | null, previousId: string | null) {
  if (previousId) {
    markers.get(previousId)?.setStyle(baseStyle).closeTooltip()
  }
  const marker = id ? markers.get(id) : undefined
  if (!map || !marker) return
  marker.setStyle(activeStyle).bringToFront().openTooltip()
  map.panTo(marker.getLatLng(), { animate: true })
}

onMounted(() => {
  map = L.map(container.value!, { scrollWheelZoom: false }).setView(CHARLESTON, 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)
  renderMarkers()
})

watch(() => props.businesses, renderMarkers)
watch(() => props.activeId, highlight)

onBeforeUnmount(() => {
  map?.remove()
  map = undefined
})
</script>

<template>
  <div ref="container" class="business-map" role="region" aria-label="Map of listed businesses"></div>
</template>

<style scoped>
.business-map {
  width: 100%;
  height: 100%;
}
</style>
