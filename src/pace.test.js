import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KM_PER_MILE, RACES, canUsePace, convertPace, formatDuration, formatPace, goalPace, isValidPace, paceToSpeed, speedToPace } from './pace.js';

test('converts pace in both directions using the exact mile ratio', () => {
  assert.equal(formatPace(convertPace(510, true)), '5:17');
  assert.equal(formatPace(convertPace(300, false)), '8:03');
  assert.ok(Math.abs(convertPace(convertPace(510, true), false) - 510) < 1e-10);
});

test('rounds with a carry to the next minute', () => {
  assert.equal(formatPace(359.6), '6:00');
});

test('rejects blank, fractional, out-of-range and zero pace', () => {
  for (const [m, s] of [['', 30], [8, ''], [8, 60], [-1, 30], [0, 0], [8.5, 0], [1000, 0], [null, 30], [false, 30], [' ', 30]]) {
    assert.equal(isValidPace(m, s), false);
  }
  assert.equal(isValidPace(0, 30), true);
  assert.equal(isValidPace('8', '30'), true);
});

test('race times use full precision and format hour boundaries correctly', () => {
  assert.deepEqual(RACES.map(race => formatDuration(300 * race.km)), ['0:25:00', '0:50:00', '1:45:29', '3:30:59']);
  assert.equal(formatDuration(3599.6), '1:00:00');
  assert.equal(formatDuration(360000), '100:00:00');
});

test('goal calculator supports standard and custom distances in either unit', () => {
  assert.equal(goalPace(10, 'km', 0, 50, 0), 300);
  assert.equal(goalPace(26.2, 'mi', 4, 0, 0), 14400 / (26.2 * KM_PER_MILE));
  assert.equal(goalPace(42.195, 'km', 3, 30, 0), 12600 / 42.195);
  for (const args of [[0, 'km', 0, 50, 0], ['', 'km', 0, 50, 0], [5, 'km', 0, 0, 0], [5, 'km', 0, 60, 0], [5, 'km', 0, 50, 60], [5, 'km', -1, 50, 0], [5, 'km', 100, 0, 0], [1001, 'km', 1, 0, 0], [5, 'other', 1, 0, 0]]) {
    assert.equal(goalPace(...args), null);
  }
});

test('treadmill conversion works both ways without premature rounding', () => {
  assert.equal(speedToPace(12, 'km'), 300);
  assert.equal(paceToSpeed(300, 'km'), 12);
  assert.equal(speedToPace(6, 'mi'), 3600 / (6 * KM_PER_MILE));
  assert.ok(Math.abs(paceToSpeed(speedToPace(6, 'mi'), 'mi') - 6) < 1e-10);
  for (const value of ['', null, false, 0, -1, 101, Infinity]) assert.equal(speedToPace(value, 'km'), null);
});

test('applying a pace respects input bounds and rounding', () => {
  assert.equal(canUsePace(300, true), true);
  assert.equal(canUsePace(null, true), false);
  assert.equal(canUsePace(0.001, false), false);
  assert.equal(canUsePace(59999, false), true);
  assert.equal(canUsePace(59999, true), false);
});
