<script setup>
import { RACES, formatDuration } from '../pace.js';
defineProps({ pacePerKm: { type: Number, default: null } });
</script>

<template>
  <section class="race-section" aria-labelledby="race-heading">
    <div class="section-heading">
      <div><div class="eyebrow">GO THE DISTANCE</div><h2 id="race-heading">Your pace, on race day.</h2></div>
      <p>Finish times at a constant pace.</p>
    </div>
    <div class="race-grid">
      <div v-for="race in RACES" :key="race.name" class="race-card">
        <span class="race-name">{{ race.name }}</span>
        <strong>{{ pacePerKm === null ? '—:—:—' : formatDuration(pacePerKm * race.km) }}</strong>
        <span class="race-distance">{{ race.km }} km</span>
      </div>
    </div>
    <p class="helper">Hours : minutes : seconds · Assumes you hold this pace for the full distance.</p>
  </section>
</template>
