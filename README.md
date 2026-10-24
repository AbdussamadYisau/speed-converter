# Stride

A running pace converter built with Vue 3, the Composition API, and Vite.

- Convert pace between minutes per mile and minutes per kilometer.
- View constant-pace finish times for 5K, 10K, half-marathon, and marathon distances.
- Calculate a required pace from a target finish time, including custom distances in miles or kilometers.
- Convert pace to treadmill speed in km/h and mph, or apply a treadmill speed as your pace.
- Restore your last valid pace and direction using browser-local storage. Calculations still work when storage is blocked.

```sh
npm install
npm run dev
```

Edit `src/App.vue` for the main converter, `src/components/` for the race, goal, and treadmill tools, `src/style.css` for styles, and `src/pace.js` for calculation logic. Preferences are handled in `src/preferences.js`. `dist/` is generated; do not edit it directly.

Run `npm test` to check pace calculations and validation. Run `npm run build` to create the production site in `dist/`, or `npm run preview` to serve that build locally.
