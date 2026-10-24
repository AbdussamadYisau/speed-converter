<script setup>
import { computed, ref } from 'vue';
import { KM_PER_MILE, canUsePace, formatPace, paceToSpeed, speedToPace } from '../pace.js';

const props = defineProps({ pacePerKm: { type: Number, default: null }, fromMile: Boolean });
const emit = defineEmits(['use-pace']);
const speed = ref(10);
const unit = ref('km');
const treadmillPace = computed(() => speedToPace(speed.value, unit.value));
const usable = computed(() => canUsePace(treadmillPace.value, props.fromMile));
function changeUnit(event) {
  const next = event.target.value;
  if (treadmillPace.value !== null) speed.value = Number(paceToSpeed(treadmillPace.value, next).toFixed(3));
  unit.value = next;
}
</script>

<template>
  <section class="tool-card" aria-labelledby="treadmill-heading">
    <div class="tool-icon" aria-hidden="true">⇄</div>
    <h2 id="treadmill-heading">Take it to the treadmill.</h2>
    <p class="tool-description">Your current pace, as a speed setting.</p>
    <div class="dual-result speed-result">
      <div><strong>{{ pacePerKm === null ? '—' : paceToSpeed(pacePerKm, 'km').toFixed(2) }}</strong><span>km/h</span></div>
      <div><strong>{{ pacePerKm === null ? '—' : paceToSpeed(pacePerKm, 'mi').toFixed(2) }}</strong><span>mph</span></div>
    </div>
    <div class="speed-entry">
      <label><span class="control-label">Or enter a speed</span><input v-model="speed" type="number" min="0.1" max="100" step="any" inputmode="decimal" :aria-invalid="treadmillPace === null" aria-describedby="speed-error"></label>
      <label><span class="control-label">Unit</span><select :value="unit" @change="changeUnit"><option value="km">km/h</option><option value="mi">mph</option></select></label>
    </div>
    <div class="dual-result" aria-live="polite" aria-atomic="true">
      <div><strong>{{ treadmillPace === null ? '—:—' : formatPace(treadmillPace) }}</strong><span>/ km</span></div>
      <div><strong>{{ treadmillPace === null ? '—:—' : formatPace(treadmillPace * KM_PER_MILE) }}</strong><span>/ mi</span></div>
    </div>
    <p id="speed-error" class="helper validation" role="status">{{ treadmillPace === null ? 'Enter a speed from 0.1 to 100 in the selected unit.' : 'Equivalent pace for the speed entered above.' }}</p>
    <button class="action-button" :disabled="!usable" @click="emit('use-pace', treadmillPace)">Use this pace <span aria-hidden="true">↗</span></button>
  </section>
</template>
