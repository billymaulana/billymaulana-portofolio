import assert from 'node:assert/strict';
import test from 'node:test';
import { thermalViolations, zoneShares } from './thermal-zones.mjs';

const C0 = [0x05, 0x05, 0x07];
const C1 = [0x0F, 0x0A, 0x72];
const C4 = [0xA3, 0x2B, 0xA8];
const C6 = [0xEE, 0x8A, 0x2A];
const C9 = [0xFF, 0xF5, 0xB3];
const WHITE = [0xFF, 0xFF, 0xFF];

function frame(parts) {
  const total = parts.reduce((n, [, count]) => n + count, 0);
  const rgb = new Uint8Array(total * 3);
  let i = 0;
  for (const [color, count] of parts) {
    for (let k = 0; k < count; k++) rgb.set(color, (i++) * 3);
  }
  return rgb;
}

test('classifies pure C1 as cold', () => {
  const s = zoneShares(frame([[C1, 10]]));
  assert.equal(s.cold, 1);
  assert.equal(s.ground + s.mid + s.hot + s.peak, 0);
});

test('ignores neutral white text pixels', () => {
  const s = zoneShares(frame([[WHITE, 30], [C1, 70]]));
  assert.equal(s.cold, 0.7);
  assert.equal(s.peak, 0);
  assert.equal(s.ground, 0);
});

test('passes a 55/20/15/10 cold/mid/hot/peak frame with ground', () => {
  const s = zoneShares(frame([[C0, 100], [C1, 55], [C4, 20], [C6, 15], [C9, 10]]));
  assert.deepEqual(thermalViolations(s), []);
});

test('flags hot-dominant frame', () => {
  const s = zoneShares(frame([[C0, 50], [C1, 50], [C6, 40], [C9, 10]]));
  const v = thermalViolations(s);
  assert.equal(v.length, 1);
  assert.match(v[0], /hot/);
});

test('flags missing ground', () => {
  const s = zoneShares(frame([[C1, 55], [C4, 20], [C6, 15], [C9, 10]]));
  const v = thermalViolations(s);
  assert.equal(v.length, 1);
  assert.match(v[0], /ground/);
});
