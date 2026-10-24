import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertPace, formatPace, isValidPace } from './pace.js';

test('converts pace in both directions using the exact mile ratio', () => {
  assert.equal(formatPace(convertPace(510, true)), '5:17');
  assert.equal(formatPace(convertPace(300, false)), '8:03');
  assert.ok(Math.abs(convertPace(convertPace(510, true), false) - 510) < 1e-10);
});

test('rounds with a carry to the next minute', () => {
  assert.equal(formatPace(359.6), '6:00');
});

test('rejects blank, fractional, out-of-range and zero pace', () => {
  for (const [m, s] of [['', 30], [8, ''], [8, 60], [-1, 30], [0, 0], [8.5, 0], [1000, 0]]) {
    assert.equal(isValidPace(m, s), false);
  }
  assert.equal(isValidPace(0, 30), true);
  assert.equal(isValidPace('8', '30'), true);
});
