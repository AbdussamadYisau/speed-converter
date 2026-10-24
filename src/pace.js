export function convertPace(seconds, mileToKm) {
  return seconds * (mileToKm ? 1 / 1.609344 : 1.609344);
}

export function formatPace(seconds) {
  const rounded = Math.round(seconds);
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`;
}

export function isValidPace(minutes, seconds) {
  if (![minutes, seconds].every(isNumericValue)) return false;
  const m = Number(minutes), s = Number(seconds);
  return Number.isInteger(m) && m >= 0 && m <= 999
    && Number.isInteger(s) && s >= 0 && s < 60 && m * 60 + s > 0;
}

function isNumericValue(value) {
  return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== ''))
    && Number.isFinite(Number(value));
}

export const KM_PER_MILE = 1.609344;
export const RACES = [
  { name: '5K', km: 5 },
  { name: '10K', km: 10 },
  { name: 'Half marathon', km: 21.0975 },
  { name: 'Marathon', km: 42.195 },
];

export function formatDuration(seconds) {
  const rounded = Math.round(seconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(rounded % 60).padStart(2, '0')}`;
}

export function goalPace(distance, unit, hours, minutes, seconds) {
  const values = [distance, hours, minutes, seconds];
  if (!values.every(isNumericValue)) return null;
  const [d, h, m, s] = values.map(Number);
  if (!['km', 'mi'].includes(unit) || d < 0.1 || d > 1000
    || !Number.isInteger(h) || h < 0 || h > 99
    || !Number.isInteger(m) || m < 0 || m > 59
    || !Number.isInteger(s) || s < 0 || s > 59) return null;
  const total = h * 3600 + m * 60 + s;
  return total > 0 ? total / (d * (unit === 'mi' ? KM_PER_MILE : 1)) : null;
}

export function speedToPace(speed, unit) {
  if (!isNumericValue(speed) || !['km', 'mi'].includes(unit)) return null;
  const value = Number(speed);
  if (!Number.isFinite(value) || value < 0.1 || value > 100) return null;
  return 3600 / (value * (unit === 'mi' ? KM_PER_MILE : 1));
}

export function paceToSpeed(pacePerKm, unit) {
  return 3600 / pacePerKm / (unit === 'mi' ? KM_PER_MILE : 1);
}

export function canUsePace(pacePerKm, fromMile) {
  const seconds = Math.round(pacePerKm * (fromMile ? KM_PER_MILE : 1));
  return pacePerKm !== null && Number.isFinite(seconds) && seconds > 0 && seconds <= 59999;
}
