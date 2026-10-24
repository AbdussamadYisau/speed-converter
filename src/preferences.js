import { isValidPace } from './pace.js';

const KEY = 'stride:preferences:v1';
export const DEFAULT_PREFERENCES = { minutes: 8, seconds: 30, fromMile: true };

export function loadPreferences(storage) {
  try {
    const saved = JSON.parse(storage.getItem(KEY));
    if (saved && isValidPace(saved.minutes, saved.seconds) && typeof saved.fromMile === 'boolean') {
      return { minutes: Number(saved.minutes), seconds: Number(saved.seconds), fromMile: saved.fromMile };
    }
  } catch { /* Storage can be unavailable or contain an older value. */ }
  return { ...DEFAULT_PREFERENCES };
}

export function savePreferences(storage, preferences) {
  try {
    storage.setItem(KEY, JSON.stringify(preferences));
    return true;
  } catch { return false; }
}
