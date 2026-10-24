<script setup>
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';

const installPrompt = shallowRef(null);
const installed = ref(false);
const online = ref(true);
const cachedReady = ref(false);
const busy = ref(false);
const error = ref('');
let displayMode;
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisterError() { error.value = 'Offline setup could not finish. Reconnect and reopen Stride to try again.'; },
});
const availableOffline = computed(() => offlineReady.value || cachedReady.value);
const status = computed(() => {
  if (error.value) return error.value;
  if (!online.value) return availableOffline.value ? 'You’re offline. Your running tools are ready to use.' : 'You’re offline. Connect once to set up offline access.';
  return availableOffline.value ? 'Ready offline. Your next calculation can happen anywhere.' : 'Open once online to prepare your running tools for offline use.';
});
function captureInstall(event) {
  event.preventDefault();
  installPrompt.value = event;
}
function markInstalled() {
  installed.value = true;
  installPrompt.value = null;
}
function syncDisplayMode() { installed.value = displayMode.matches || window.navigator.standalone === true; }
function syncConnection() { online.value = window.navigator.onLine; }
async function install() {
  const prompt = installPrompt.value;
  if (!prompt || busy.value) return;
  busy.value = true;
  try {
    await prompt.prompt();
    await prompt.userChoice;
  } catch { error.value = 'Use your browser’s menu to install Stride instead.'; }
  finally { installPrompt.value = null; busy.value = false; }
}
async function update() {
  busy.value = true;
  try { await updateServiceWorker(true); }
  catch { error.value = 'The update could not finish. Reconnect and try again.'; }
  finally { busy.value = false; }
}
onMounted(() => {
  displayMode = window.matchMedia('(display-mode: standalone)');
  syncDisplayMode();
  syncConnection();
  window.addEventListener('beforeinstallprompt', captureInstall);
  window.addEventListener('appinstalled', markInstalled);
  window.addEventListener('online', syncConnection);
  window.addEventListener('offline', syncConnection);
  displayMode.addEventListener('change', syncDisplayMode);
  if ('serviceWorker' in window.navigator) {
    window.navigator.serviceWorker.ready.then(() => { cachedReady.value = true; }).catch(() => {});
  }
});
onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', captureInstall);
  window.removeEventListener('appinstalled', markInstalled);
  window.removeEventListener('online', syncConnection);
  window.removeEventListener('offline', syncConnection);
  displayMode?.removeEventListener('change', syncDisplayMode);
});
</script>

<template>
  <aside class="pwa-panel" aria-label="Install and offline access">
    <div class="pwa-copy">
      <strong>{{ installed ? 'Stride, ready to run.' : 'Keep Stride a tap away.' }}</strong>
      <p role="status">{{ status }}</p>
    </div>
    <button v-if="installPrompt && !installed" class="pwa-button" :disabled="busy" @click="install">{{ busy ? 'Opening…' : 'Install Stride' }}</button>
    <details v-else-if="!installed" class="install-help">
      <summary>How to install</summary>
      <div>
        <p><strong>iPhone or iPad:</strong> Open this site in Safari, tap Share, then Add to Home Screen. Enable Open as Web App if shown.</p>
        <p><strong>Android or desktop:</strong> Open the browser menu and choose Install app or Add to Home screen when available.</p>
      </div>
    </details>
    <div v-if="needRefresh" class="pwa-update" role="status">
      <span>A new version of Stride is ready.</span>
      <button class="pwa-button" :disabled="busy" @click="update">Update now</button>
      <button class="pwa-later" :disabled="busy" @click="needRefresh = false">Later</button>
    </div>
  </aside>
</template>
