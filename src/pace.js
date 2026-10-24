export function convertPace(seconds, mileToKm) {
  return seconds * (mileToKm ? 1 / 1.609344 : 1.609344);
}

export function formatPace(seconds) {
  const rounded = Math.round(seconds);
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`;
}

export function isValidPace(minutes, seconds) {
  if (minutes === '' || seconds === '') return false;
  const m = Number(minutes), s = Number(seconds);
  return Number.isInteger(m) && m >= 0 && m <= 999
    && Number.isInteger(s) && s >= 0 && s < 60 && m * 60 + s > 0;
}
