const $ = id => document.getElementById(id);
let fromMile = true;
function convertPace(seconds, mileToKm) { return seconds * (mileToKm ? 1 / 1.609344 : 1.609344); }
function formatPace(seconds) { const rounded = Math.round(seconds); return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`; }
function update() {
  const minutes = Number($('minutes').value), seconds = Number($('seconds').value);
  const valid = $('minutes').value !== '' && $('seconds').value !== '' && Number.isInteger(minutes) && minutes >= 0 && minutes <= 999 && Number.isInteger(seconds) && seconds >= 0 && seconds < 60 && minutes * 60 + seconds > 0;
  $('result').textContent = valid ? formatPace(convertPace(minutes * 60 + seconds, fromMile)) : '—:—';
  $('error').textContent = valid ? '' : 'Enter minutes (0–999) and seconds (0–59), above zero.';
  $('minutes').setAttribute('aria-invalid', String(!valid));
  $('seconds').setAttribute('aria-invalid', String(!valid));
}
function setDirection(mileToKm, keepPace = false) {
  if (keepPace && $('result').textContent !== '—:—') {
    const [m,s] = $('result').textContent.split(':'); $('minutes').value = m; $('seconds').value = s;
  }
  fromMile = mileToKm;
  $('mile').classList.toggle('active', fromMile); $('km').classList.toggle('active', !fromMile);
  $('mile').setAttribute('aria-pressed', String(fromMile)); $('km').setAttribute('aria-pressed', String(!fromMile));
  $('input-label').textContent = fromMile ? 'YOUR MILE PACE' : 'YOUR KILOMETER PACE';
  $('output-label').textContent = fromMile ? 'YOUR KILOMETER PACE' : 'YOUR MILE PACE';
  $('input-unit').textContent = fromMile ? 'minutes per mile' : 'minutes per kilometer';
  $('result-unit').textContent = fromMile ? '/ km' : '/ mi';
  $('formula').textContent = fromMile ? 'Mile pace ÷ 1.609344 = kilometer pace' : 'Kilometer pace × 1.609344 = mile pace';
  update();
}
$('minutes').addEventListener('input', update); $('seconds').addEventListener('input', update);
$('mile').addEventListener('click', () => setDirection(true)); $('km').addEventListener('click', () => setDirection(false));
$('swap').addEventListener('click', () => setDirection(!fromMile, true));
document.querySelectorAll('.preset').forEach(button => button.addEventListener('click', () => { $('minutes').value = Number(button.dataset.seconds) / 60; $('seconds').value = '00'; update(); }));
update();
