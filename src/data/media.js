// SYNTHETIC DATA — fictional media vault (49 items).
// Thumbnails are procedurally drawn SVG. No camera, no gallery,
// no filesystem, no image requests of any kind.

import { makeRng, int, pick, float } from '../lib/rng.js';

const rng = makeRng(77);

const NAMES = {
  photo: 'IMG', video: 'VID', screenshot: 'SCR',
};

const SUBJECTS = [
  'harbour dusk', 'street grid', 'window light', 'coastal fog', 'metro platform',
  'desk study', 'city ridge', 'rain glass', 'north shore', 'quiet courtyard',
  'signal tower', 'late commute', 'paper stack', 'terrace view', 'salt flats',
];

const PALETTES = [
  ['#1d2430', '#3a4a63', '#8fa6c6'],
  ['#2b1d1f', '#5c2e35', '#c76a72'],
  ['#1f2620', '#37503f', '#7fae90'],
  ['#2a2318', '#59452a', '#c39a63'],
  ['#1c1c22', '#3a3a48', '#8f8fa6'],
  ['#241a2b', '#452f52', '#a084bd'],
];

function thumb(seedIdx, kind) {
  const r = makeRng(400 + seedIdx);
  const pal = PALETTES[Math.floor(r() * PALETTES.length)];
  const g = `g${seedIdx}`;
  const horizon = 40 + r() * 40;
  let shapes = '';

  if (kind === 'screenshot') {
    // Abstract UI-looking composition.
    shapes += `<rect x="0" y="0" width="200" height="26" fill="rgba(255,255,255,.06)"/>`;
    for (let i = 0; i < 5; i++) {
      const y = 38 + i * 26;
      const w = 60 + r() * 110;
      shapes += `<rect x="14" y="${y}" width="${w}" height="9" rx="4.5" fill="rgba(255,255,255,${0.05 + r() * 0.1})"/>`;
      shapes += `<rect x="14" y="${y + 13}" width="${w * 0.6}" height="6" rx="3" fill="rgba(255,255,255,.05)"/>`;
    }
    shapes += `<rect x="0" y="174" width="200" height="26" fill="rgba(255,255,255,.05)"/>`;
  } else {
    // Landscape-ish abstraction: horizon, sun disc, layered ridges.
    shapes += `<circle cx="${40 + r() * 120}" cy="${horizon - 22}" r="${10 + r() * 14}" fill="${pal[2]}" opacity=".55"/>`;
    for (let i = 0; i < 3; i++) {
      const y = horizon + i * (16 + r() * 22);
      const amp = 10 + r() * 18;
      shapes += `<path d="M0 ${y} Q 50 ${y - amp} 100 ${y} T 200 ${y} L200 200 L0 200 Z" fill="${pal[1]}" opacity="${0.5 - i * 0.11}"/>`;
    }
    for (let i = 0; i < 14; i++) {
      shapes += `<circle cx="${r() * 200}" cy="${r() * horizon}" r="${r() * 1.1}" fill="#fff" opacity="${r() * 0.4}"/>`;
    }
  }

  return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="${g}" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${pal[0]}"/><stop offset="100%" stop-color="${pal[1]}"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#${g})"/>
    ${shapes}
    <rect width="200" height="200" fill="none" stroke="rgba(255,255,255,.05)"/>
  </svg>`;
}

function build() {
  const items = [];
  const plan = [
    ...Array(28).fill('photo'),
    ...Array(9).fill('video'),
    ...Array(12).fill('screenshot'),
  ];
  plan.forEach((kind, i) => {
    const minsAgo = int(rng, 4, 60 * 34);
    const seq = 2000 + i * 7 + int(rng, 1, 6);
    items.push({
      id: `md${i}`,
      kind,
      name: `${NAMES[kind]}_${seq}-DEMO`,
      ext: kind === 'video' ? 'mp4' : 'png',
      ts: Date.now() - minsAgo * 60000,
      sizeMb: kind === 'video' ? float(rng, 24, 180, 1) : float(rng, 0.9, 7.4, 1),
      dims: kind === 'video' ? '1920 × 1080' : pick(rng, ['3024 × 4032', '4032 × 3024', '1080 × 2400']),
      seconds: kind === 'video' ? int(rng, 6, 184) : null,
      subject: pick(rng, SUBJECTS),
      album: pick(rng, ['CAMERA (SIM)', 'DOWNLOADS (SIM)', 'SCREENSHOTS (SIM)', 'SIM-CHAT MEDIA']),
      thumb: thumb(i, kind),
      hash: `sha-demo:${(i * 918273 + 40311).toString(16).padStart(8, '0')}`,
    });
  });
  return items.sort((a, b) => b.ts - a.ts);
}

export const media = build();

export const mediaStats = {
  total: media.length,
  photos: media.filter((m) => m.kind === 'photo').length,
  videos: media.filter((m) => m.kind === 'video').length,
  screenshots: media.filter((m) => m.kind === 'screenshot').length,
  sizeMb: media.reduce((n, m) => n + m.sizeMb, 0),
};
