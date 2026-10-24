# Stride

A running pace converter built with Vue 3, the Composition API, and Vite.

- Convert pace between minutes per mile and minutes per kilometer.
- View constant-pace finish times for 5K, 10K, half-marathon, and marathon distances.
- Calculate a required pace from a target finish time, including custom distances in miles or kilometers.
- Convert pace to treadmill speed in km/h and mph, or apply a treadmill speed as your pace.
- Restore your last valid pace and direction using browser-local storage. Calculations still work when storage is blocked.
- Install Stride as a standalone PWA and use its calculators offline after the first successful online visit.

```sh
npm install
npm run dev
```

Edit `src/App.vue` for the main converter, `src/components/` for the race, goal, and treadmill tools, `src/style.css` for styles, and `src/pace.js` for calculation logic. Preferences are handled in `src/preferences.js`. `dist/` is generated; do not edit it directly.

Run `npm test` to check pace calculations and validation. Run `npm run build` to create the production site in `dist/`, or `npm run preview` to serve that build locally.

## PWA installation and offline use

Deploy `dist/` to an HTTPS origin. `vite-plugin-pwa` generates `manifest.webmanifest`, a revisioned precache, and `sw.js` at build time. Serve the manifest as `application/manifest+json` and the service worker as JavaScript; neither should be rewritten to the HTML fallback or cached forever by the host. The app uses the origin root as its start URL and service-worker scope.

Open the site online and wait for “Ready offline” before disconnecting. The app shell, scripts, styles, and icons are precached; all calculator features and browser-local preferences work offline. External Google Fonts are optional and use system font fallbacks offline. Private-host sign-in and first visits still require a connection. Installation from an embedded view may require opening the site in your device browser.

Use **Install Stride** when the browser offers it. On iPhone or iPad, open in Safari, then use **Share → Add to Home Screen** (enable **Open as Web App** if offered). On supported desktop and Android browsers, use the browser's install control or menu. Installation UI varies by browser.

New releases show an **Update now / Later** prompt rather than interrupting a calculation. Old precaches are cleaned up after the replacement worker activates. Browser storage eviction can remove offline access; reopen online to restore it.

To verify locally, run `npm run build` and `npm run check:pwa` to check the generated manifest, icon dimensions, and offline precache. Then run `npm run preview`, open the printed localhost URL, check **Application → Manifest / Service Workers** in browser devtools, wait for readiness, then switch the Network panel offline and reload. Test installation on a real device. The service worker is intentionally disabled during `npm run dev`.

Icons are tracked in `public/icons/`. Regenerate them with `node scripts/generate-icons.mjs`; the maskable mark stays inside the central safe zone.
