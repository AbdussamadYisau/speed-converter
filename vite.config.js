import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.png', 'favicon.svg'],
      manifest: {
        id: '/',
        name: 'Stride — Pace Converter',
        short_name: 'Stride',
        description: 'Running pace, race finish times, and treadmill speeds. Ready for your next run, even offline.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f6f5f0',
        theme_color: '#2d533b',
        lang: 'en',
        categories: ['sports', 'utilities'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallback: 'index.html',
        // Keep authentication callbacks and hosting endpoints out of the app shell.
        navigateFallbackDenylist: [/^\/api\//, /^\/auth\//, /^\/\.well-known\//, /^\/_/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
    }),
  ],
});
