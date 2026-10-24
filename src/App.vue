<script setup>
import { computed, ref, watch } from 'vue';
import { KM_PER_MILE, canUsePace, convertPace, formatPace, isValidPace } from './pace.js';
import { loadPreferences, savePreferences } from './preferences.js';
import RaceTimes from './components/RaceTimes.vue';
import GoalCalculator from './components/GoalCalculator.vue';
import TreadmillSpeed from './components/TreadmillSpeed.vue';
import PwaStatus from './components/PwaStatus.vue';

let storage;
try { storage = window.localStorage; } catch { /* The converter also works without storage. */ }
const preferences = loadPreferences(storage);
const minutes = ref(preferences.minutes);
const seconds = ref(preferences.seconds);
const fromMile = ref(preferences.fromMile);
const preferencesSaved = ref(false);
const appliedMessage = ref('');
const valid = computed(() => isValidPace(minutes.value, seconds.value));
const result = computed(() => valid.value ? formatPace(convertPace(Number(minutes.value) * 60 + Number(seconds.value), fromMile.value)) : '—:—');
const pacePerKm = computed(() => valid.value
  ? (Number(minutes.value) * 60 + Number(seconds.value)) / (fromMile.value ? KM_PER_MILE : 1)
  : null);
watch([minutes, seconds, fromMile], () => {
  appliedMessage.value = '';
  if (valid.value) preferencesSaved.value = savePreferences(storage, {
    minutes: Number(minutes.value), seconds: Number(seconds.value), fromMile: fromMile.value,
  });
}, { immediate: true, flush: 'sync' });

function usePace(pace) {
  if (!canUsePace(pace, fromMile.value)) return;
  const total = Math.round(pace * (fromMile.value ? KM_PER_MILE : 1));
  minutes.value = Math.floor(total / 60);
  seconds.value = total % 60;
  appliedMessage.value = `Pace updated to ${formatPace(total)} per ${fromMile.value ? 'mile' : 'kilometer'}. Race times and treadmill speeds updated above.`;
}
function setDirection(mileToKm, keepPace = false) {
  if (keepPace && valid.value) {
    const [m, s] = result.value.split(':').map(Number);
    minutes.value = m;
    seconds.value = s;
  }
  fromMile.value = mileToKm;
}
function setPreset(pace) {
  minutes.value = pace;
  seconds.value = 0;
}
</script>

<template>

<header><div class="brand"><span class="mark" aria-hidden="true">↗</span>stride<span style="color:#7a9254">.</span></div><div class="nav"><span class="dot"></span> A little clarity for your next run</div></header>
<main><div class="eyebrow">THE RUNNER’S EVERYDAY TOOL</div><h1>Your pace.<br>A different <em>perspective.</em></h1><p class="intro">Miles or kilometers, make every run make sense.<br>Convert your pace in a heartbeat.</p>
<PwaStatus />
<section class="converter" aria-label="Pace converter"><div class="toolbar"><div class="tabs" aria-label="Conversion direction"><button class="tab" :class="{ active: fromMile }" :aria-pressed="fromMile" @click="setDirection(true)">Mile → Kilometer</button><button class="tab" :class="{ active: !fromMile }" :aria-pressed="!fromMile" @click="setDirection(false)">Kilometer → Mile</button></div><div class="live"><span class="dot"></span>INSTANT CONVERSION</div></div>
<div class="panels"><div class="panel"><div class="label" id="input-label">{{ fromMile ? "YOUR MILE PACE" : "YOUR KILOMETER PACE" }}</div><div class="input-row"><label class="field"><input v-model="minutes" :aria-invalid="!valid" type="number" min="0" max="999" inputmode="numeric" aria-label="Minutes"><span>minutes</span></label><span class="colon">:</span><label class="field"><input v-model="seconds" :aria-invalid="!valid" type="number" min="0" max="59" inputmode="numeric" aria-label="Seconds"><span>seconds</span></label></div><div class="unit" id="input-unit">minutes per {{ fromMile ? "mile" : "kilometer" }}</div></div><button class="swap" @click="setDirection(!fromMile, true)" aria-label="Swap conversion direction" title="Swap direction">⇄</button><div class="result-panel"><div class="label" id="output-label">{{ fromMile ? "YOUR KILOMETER PACE" : "YOUR MILE PACE" }}</div><div class="result" aria-live="polite"><span id="result">{{ result }}</span><small id="result-unit">/ {{ fromMile ? "km" : "mi" }}</small></div><div class="unit" id="equivalence">Same effort. Different units.</div></div></div>
<div class="presets"><span>TRY A PACE</span><button v-for="pace in [6, 8, 10, 12]" :key="pace" class="preset" @click="setPreset(pace)">{{ pace }}:00</button><div class="error" id="error" role="status">{{ valid ? "" : "Enter minutes (0–999) and seconds (0–59), above zero." }}</div></div><div class="note"><span>ⓘ &nbsp;1 mile = 1.609344 kilometers</span><strong id="formula">{{ fromMile ? "Mile pace ÷ 1.609344 = kilometer pace" : "Kilometer pace × 1.609344 = mile pace" }}</strong></div></section>
<p class="saved-preferences"><span class="dot" aria-hidden="true"></span>{{ preferencesSaved ? 'Your last valid pace and unit are saved on this browser.' : 'Preferences are temporary because browser storage is unavailable.' }}</p>
<RaceTimes :pace-per-km="pacePerKm" />
<div class="tools-grid">
  <GoalCalculator :from-mile="fromMile" @use-pace="usePace" />
  <TreadmillSpeed :pace-per-km="pacePerKm" :from-mile="fromMile" @use-pace="usePace" />
</div>
<p class="apply-status" role="status">{{ appliedMessage }}</p>
<footer><span>A small tool for the long run.</span><span>Made for runners, at every pace. ↗</span></footer></main>

</template>
