// SYNTHETIC DATA — activity engine.
// Produces deterministic time-series, a recent-event timeline, and the
// templates used by the live simulation feed. Nothing observes the user.

import { makeRng, int, pick } from '../lib/rng.js';
import { pad2 } from '../lib/format.js';

export const TOTAL_EVENTS = 1284;

export const CATEGORIES = [
  { key: 'messages', label: 'MESSAGES', color: '#d8323f' },
  { key: 'calls', label: 'CALLS', color: '#e8843a' },
  { key: 'media', label: 'MEDIA', color: '#5b8def' },
  { key: 'apps', label: 'APPS', color: '#3fb27f' },
  { key: 'location', label: 'LOCATION', color: '#9b7de0' },
];

export const RANGES = [
  { key: '1H', buckets: 12, stepMin: 5, label: (i, n) => `${pad2(new Date(Date.now() - (n - 1 - i) * 5 * 60000).getMinutes())}` },
  { key: '6H', buckets: 12, stepMin: 30, label: (i, n) => hourLabel(n - 1 - i, 30) },
  { key: '12H', buckets: 12, stepMin: 60, label: (i, n) => hourLabel(n - 1 - i, 60) },
  { key: '24H', buckets: 12, stepMin: 120, label: (i, n) => hourLabel(n - 1 - i, 120) },
  { key: '7D', buckets: 7, stepMin: 1440, label: (i, n) => dayShort(n - 1 - i) },
];

function hourLabel(back, stepMin) {
  const d = new Date(Date.now() - back * stepMin * 60000);
  return `${pad2(d.getHours())}:00`;
}
function dayShort(back) {
  const d = new Date(Date.now() - back * 86400000);
  return d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
}

// Per-category weighting so the shape of the data feels plausible.
const WEIGHT = { messages: 1, calls: 0.35, media: 0.7, apps: 1.4, location: 0.6 };

export function seriesFor(rangeKey) {
  const range = RANGES.find((r) => r.key === rangeKey) || RANGES[3];
  const rngBase = { '1H': 11, '6H': 22, '12H': 33, '24H': 44, '7D': 55 }[range.key];
  const labels = Array.from({ length: range.buckets }, (_, i) => range.label(i, range.buckets));
  const series = CATEGORIES.map((c, ci) => {
    const rng = makeRng(rngBase * 100 + ci);
    const scale = range.stepMin / 5;
    const values = Array.from({ length: range.buckets }, (_, i) => {
      // Diurnal curve: quieter overnight, busier mid-day and evening.
      const hour = new Date(Date.now() - (range.buckets - 1 - i) * range.stepMin * 60000).getHours();
      const diurnal = 0.35 + 0.65 * Math.max(0, Math.sin(((hour - 5) / 24) * Math.PI * 2) * 0.5 + 0.6);
      const base = WEIGHT[c.key] * scale * diurnal;
      return Math.max(0, Math.round(base * (0.55 + rng() * 0.95)));
    });
    return { key: c.key, name: c.label, color: c.color, values };
  });
  return { labels, series, range };
}

const EVENT_TEMPLATES = [
  { cat: 'messages', text: 'Synthetic message generated' },
  { cat: 'messages', text: 'Simulated conversation updated' },
  { cat: 'location', text: 'Virtual location updated' },
  { cat: 'location', text: 'Synthetic movement event recorded' },
  { cat: 'apps', text: 'Simulated application opened' },
  { cat: 'apps', text: 'Mock background service refreshed' },
  { cat: 'calls', text: 'Synthetic call completed' },
  { cat: 'calls', text: 'Simulated voice session logged' },
  { cat: 'media', text: 'Synthetic media item indexed' },
  { cat: 'media', text: 'Mock thumbnail rendered' },
  { cat: 'apps', text: 'Fictional notification queued' },
  { cat: 'media', text: 'Simulated capture written to vault' },
];

export const feedTemplates = EVENT_TEMPLATES;

export function makeEvent(seedOffset = 0, ts = Date.now()) {
  const rng = makeRng(900 + seedOffset + Math.floor(ts / 1000));
  const tpl = pick(rng, EVENT_TEMPLATES);
  const cat = CATEGORIES.find((c) => c.key === tpl.cat);
  return {
    id: `ev${ts}-${int(rng, 100, 999)}`,
    ts,
    cat: tpl.cat,
    color: cat.color,
    text: tpl.text,
    ref: `NX-${int(rng, 10000, 99999)}`,
  };
}

// Deterministic seed events for first paint of the live feed.
export function seedEvents(n = 8) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const ts = Date.now() - (i * 76 + 9) * 1000;
    out.push(makeEvent(i * 17, ts));
  }
  return out;
}

// Longer-form timeline used by the Activity view.
export function timeline(n = 26) {
  const rng = makeRng(1200);
  const detail = {
    messages: ['SIM-CHAT thread synced', 'Delivery receipt simulated', 'Draft snapshot stored'],
    calls: ['Voice session closed', 'Missed call synthesised', 'Duration written to log'],
    media: ['Thumbnail generated', 'Vault index rebuilt', 'Synthetic capture stored'],
    apps: ['Foreground switch recorded', 'Background refresh simulated', 'Notification queued'],
    location: ['Trail point appended', 'Dwell window closed', 'Route recalculated'],
  };
  const out = [];
  let t = Date.now() - 4 * 60000;
  for (let i = 0; i < n; i++) {
    const c = CATEGORIES[int(rng, 0, CATEGORIES.length - 1)];
    out.push({
      id: `tl${i}`,
      ts: t,
      cat: c.key,
      label: c.label,
      color: c.color,
      text: pick(rng, detail[c.key]),
      ref: `NX-${int(rng, 10000, 99999)}`,
    });
    t -= int(rng, 3, 42) * 60000;
  }
  return out;
}

export const activityStats = {
  total: TOTAL_EVENTS,
  perHour: 53,
  peakHour: '19:00',
  quietHour: '04:00',
  byCategory: [
    { label: 'APPS', value: 462, color: '#3fb27f' },
    { label: 'MESSAGES', value: 318, color: '#d8323f' },
    { label: 'MEDIA', value: 241, color: '#5b8def' },
    { label: 'LOCATION', value: 187, color: '#9b7de0' },
    { label: 'CALLS', value: 76, color: '#e8843a' },
  ],
};
