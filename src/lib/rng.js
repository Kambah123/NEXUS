// Deterministic pseudo-random generator.
// The prank must read identically on every run, so all synthetic data
// is derived from a fixed seed rather than Math.random().

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const NEXUS_SEED = 0x4e455855; // "NEXU"

export function makeRng(offset = 0) {
  return mulberry32(NEXUS_SEED + offset);
}

export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

export function int(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function float(rng, min, max, dp = 2) {
  return +(rng() * (max - min) + min).toFixed(dp);
}

export function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
