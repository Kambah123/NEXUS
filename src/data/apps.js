// SYNTHETIC DATA — fictional application inventory (46 entries).
// The real device's installed apps are never inspected.

import { makeRng, int, pick } from '../lib/rng.js';

const rng = makeRng(31);

const FEATURED = [
  ['Messages', 'messages', '#d8323f', 'Communication'],
  ['Maps', 'location', '#3fb27f', 'Navigation'],
  ['Camera', 'media', '#e8843a', 'Media'],
  ['Music', 'bolt', '#9b7de0', 'Entertainment'],
  ['Browser', 'globe', '#5b8def', 'Internet'],
  ['Notes', 'file', '#c9a227', 'Productivity'],
  ['Mail', 'messages', '#d85f9b', 'Communication'],
  ['Calendar', 'clock', '#4fb6c4', 'Productivity'],
  ['Files', 'layers', '#8a8f98', 'System'],
  ['Weather', 'wifi', '#67a3e0', 'Utilities'],
];

const OTHERS = [
  'Vault', 'Ledger', 'Transit', 'Podcasts', 'Fitness', 'Wallet', 'Scanner', 'Translate',
  'Recorder', 'Reader', 'Focus', 'Sketch', 'Cloud Sync', 'Player', 'Health', 'Calculator',
  'Contacts', 'Clock', 'Settings', 'Store', 'Radio', 'Journal', 'Tasks', 'Compass',
  'Gallery', 'Voice Memo', 'Split Bill', 'Metro Pass', 'Lightbox', 'Habit', 'Recipe',
  'Chess', 'Night Sky', 'Parking', 'Lumen', 'Archive',
];

const CATS = ['Utilities', 'Productivity', 'Media', 'Social', 'System', 'Finance', 'Health'];
const HUES = ['#d8323f', '#e8843a', '#3fb27f', '#5b8def', '#9b7de0', '#4fb6c4', '#c9a227', '#d85f9b', '#8a8f98'];

function version(r) {
  return `${int(r, 1, 14)}.${int(r, 0, 9)}.${int(r, 0, 9)}`;
}

function build() {
  const list = [];
  FEATURED.forEach(([name, icon, color, category], i) => {
    const usage = int(rng, 22, 214);
    list.push({
      id: `a${i}`, name, icon, color, category, featured: true,
      version: version(rng),
      lastActiveMin: int(rng, 1, 240),
      usageMin: usage,
      usagePct: Math.min(100, Math.round((usage / 214) * 100)),
      events: int(rng, 40, 480),
      sizeMb: int(rng, 40, 620),
      permissions: pick(rng, ['3 SIMULATED', '5 SIMULATED', '2 SIMULATED', '7 SIMULATED']),
      state: pick(rng, ['FOREGROUND', 'BACKGROUND', 'IDLE']),
    });
  });
  OTHERS.forEach((name, i) => {
    const usage = int(rng, 0, 74);
    list.push({
      id: `a${i + 10}`, name,
      icon: null,
      color: HUES[(i * 3) % HUES.length],
      category: CATS[i % CATS.length],
      featured: false,
      version: version(rng),
      lastActiveMin: int(rng, 5, 60 * 72),
      usageMin: usage,
      usagePct: Math.min(100, Math.round((usage / 74) * 100)),
      events: int(rng, 0, 120),
      sizeMb: int(rng, 8, 340),
      permissions: pick(rng, ['1 SIMULATED', '2 SIMULATED', '0 SIMULATED', '4 SIMULATED']),
      state: pick(rng, ['IDLE', 'BACKGROUND', 'STOPPED']),
    });
  });
  return list;
}

export const apps = build();
export const appStats = {
  total: apps.length,
  active: apps.filter((a) => a.state !== 'STOPPED').length,
  foreground: apps.filter((a) => a.state === 'FOREGROUND').length,
  storageMb: apps.reduce((n, a) => n + a.sizeMb, 0),
};
