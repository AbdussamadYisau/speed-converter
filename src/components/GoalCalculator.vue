<script setup>
import { computed, ref } from 'vue';
import { RACES, KM_PER_MILE, canUsePace, formatPace, goalPace } from '../pace.js';

const props = defineProps({ fromMile: Boolean });
const emit = defineEmits(['use-pace']);
const race = ref('10K');
const distance = ref(10);
const distanceUnit = ref('km');
const hours = ref(0);
const minutes = ref(50);
const seconds = ref(0);
const selectedRace = computed(() => RACES.find(item => item.name === race.value));
const pace = computed(() => goalPace(
  selectedRace.value?.km ?? distance.value,
  selectedRace.value ? 'km' : distanceUnit.value,
  hours.value, minutes.value, seconds.value,
));
const usable = computed(() => canUsePace(pace.value, props.fromMile));
</script>

<template>
  <section class="tool-card" aria-labelledby="goal-heading">
    <div class="tool-icon" aria-hidden="true">↗</div>
    <h2 id="goal-heading">Start with a finish time.</h2>
    <p class="tool-description">Set your goal. Find the pace to get there.</p>
    <label class="control-label" for="goal-race">Distance</label>
    <select id="goal-race" v-model="race">
      <option v-for="item in RACES" :key="item.name" :value="item.name">{{ item.name }}</option>
      <option value="custom">Custom distance</option>
    </select>
    <div v-if="race === 'custom'" class="custom-distance">
      <label><span class="control-label">Custom distance</span><input v-model="distance" type="number" min="0.1" max="1000" step="any" inputmode="decimal" :aria-invalid="pace === null" aria-describedby="goal-error"></label>
      <label><span class="control-label">Unit</span><select v-model="distanceUnit"><option value="km">Kilometers</option><option value="mi">Miles</option></select></label>
    </div>
    <fieldset class="time-fields">
      <legend class="control-label">Goal finish time</legend>
      <label><input v-model="hours" type="number" min="0" max="99" inputmode="numeric" :aria-invalid="pace === null" aria-describedby="goal-error"><span>hours</span></label>
      <span class="time-colon" aria-hidden="true">:</span>
      <label><input v-model="minutes" type="number" min="0" max="59" inputmode="numeric" :aria-invalid="pace === null" aria-describedby="goal-error"><span>minutes</span></label>
      <span class="time-colon" aria-hidden="true">:</span>
      <label><input v-model="seconds" type="number" min="0" max="59" inputmode="numeric" :aria-invalid="pace === null" aria-describedby="goal-error"><span>seconds</span></label>
    </fieldset>
    <div class="dual-result" aria-live="polite" aria-atomic="true">
      <div><strong>{{ pace === null ? '—:—' : formatPace(pace) }}</strong><span>/ km</span></div>
      <div><strong>{{ pace === null ? '—:—' : formatPace(pace * KM_PER_MILE) }}</strong><span>/ mi</span></div>
    </div>
    <p id="goal-error" class="helper validation" role="status">{{ pace === null ? 'Use a distance from 0.1–1,000 and a positive time. Hours: 0–99; minutes and seconds: 0–59.' : !usable ? 'This pace is outside the converter’s range. Adjust your distance or time.' : 'Your required average pace, rounded to the nearest second.' }}</p>
    <button class="action-button" :disabled="!usable" @click="emit('use-pace', pace)">Use this pace <span aria-hidden="true">↗</span></button>
  </section>
</template>
