import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PREFERENCES, loadPreferences, savePreferences } from './preferences.js';

test('restores saved pace and direction after a reload', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const preferences = { minutes: 5, seconds: 17, fromMile: false };
  assert.equal(savePreferences(storage, preferences), true);
  assert.deepEqual(loadPreferences(storage), preferences);
});

test('corrupt, invalid, and unavailable storage safely fall back', () => {
  for (const value of ['{bad', 'null', '{"minutes":5,"seconds":60,"fromMile":true}', '{"minutes":5,"seconds":0,"fromMile":"false"}', '{"minutes":null,"seconds":30,"fromMile":true}']) {
    assert.deepEqual(loadPreferences({ getItem: () => value }), DEFAULT_PREFERENCES);
  }
  assert.deepEqual(loadPreferences(undefined), DEFAULT_PREFERENCES);
  assert.equal(savePreferences(undefined, DEFAULT_PREFERENCES), false);
  const blockedStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } };
  assert.deepEqual(loadPreferences(blockedStorage), DEFAULT_PREFERENCES);
  assert.equal(savePreferences(blockedStorage, DEFAULT_PREFERENCES), false);
});
