// Original inline SVG icon set. Stroke-based, 24x24 viewBox, currentColor.
// No icon fonts, no external requests.

const s = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}${extra}</svg>`;

export const icons = {
  overview: s('<path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z"/>'),
  messages: s('<path d="M20 12a7 7 0 0 1-7 7H8l-4 3V12a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7Z"/><path d="M9 11h6M9 14h4"/>'),
  calls: s('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4Z"/>'),
  media: s('<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m3.5 17 4.8-4.4a2 2 0 0 1 2.7 0L20.5 21"/>'),
  location: s('<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>'),
  apps: s('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
  contacts: s('<circle cx="12" cy="12" r="2.6"/><circle cx="12" cy="4.4" r="1.9"/><circle cx="19" cy="16" r="1.9"/><circle cx="5" cy="16" r="1.9"/><path d="M12 6.3v3.1M13.9 13.6l3.4 1.6M10.1 13.6l-3.4 1.6"/>'),
  activity: s('<path d="M3 17.5 8 9l3.5 5L15 5.5 18 12l3-3.5"/>'),
  device: s('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.6h3"/><path d="M10 5.4h4"/>'),
  system: s('<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8"/>'),
  search: s('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>'),
  menu: s('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close: s('<path d="m6 6 12 12M18 6 6 18"/>'),
  arrowIn: s('<path d="M19 5 9 15"/><path d="M15 15H9V9"/>'),
  arrowOut: s('<path d="M5 19 15 9"/><path d="M9 9h6v6"/>'),
  missed: s('<path d="M19 5 9 15"/><path d="M15 15H9V9"/><circle cx="18" cy="18" r="3"/>'),
  play: s('<path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none"/>'),
  shield: s('<path d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'),
  battery: s('<rect x="2.5" y="7.5" width="16" height="9" rx="2.5"/><path d="M21 11v2"/>'),
  wifi: s('<path d="M2.5 9a14 14 0 0 1 19 0M6 12.5a9 9 0 0 1 12 0M9.5 16a4 4 0 0 1 5 0"/><circle cx="12" cy="19" r=".9" fill="currentColor"/>'),
  cpu: s('<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3.5v3M14 3.5v3M10 17.5v3M14 17.5v3M3.5 10h3M3.5 14h3M17.5 10h3M17.5 14h3"/>'),
  clock: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  eye: s('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>'),
  file: s('<path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3Z"/><path d="M13.5 3v5.5H19"/>'),
  globe: s('<circle cx="12" cy="12" r="8.5"/><path d="M3.6 9.5h16.8M3.6 14.5h16.8"/><path d="M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.3-3.6-8.5S9.6 5.8 12 3.5Z"/>'),
  home: s('<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z"/>'),
  more: s('<circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/>'),
  check: s('<path d="m5 12.5 4.5 4.5L19 7"/>'),
  bolt: s('<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z"/>'),
  layers: s('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3.5 12.5 8.5 4.7 8.5-4.7"/>'),
  logger: s('<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h1M10 10h1M13.5 10h1M17 10h1M8 13.8h8"/>'),
};

// The NEXUS mark: an original geometric N built from an intersecting
// network path — two vertical rails linked by a diagonal data bridge,
// with node points at the connection vertices.
let logoSeq = 0;

export function logoMark(size = 26) {
  // Unique gradient id per instance — duplicate ids across inlined SVGs
  // make the paint resolve against the wrong node.
  const gid = `nxg${logoSeq++}`;
  return `
<svg class="logo-mark" viewBox="0 0 32 32" width="${size}" height="${size}" fill="none" aria-hidden="true">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0545f"/>
      <stop offset="100%" stop-color="#e8843a"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="30" height="30" rx="9" stroke="rgba(255,255,255,.13)"/>
  <path d="M10 23V9l12 14V9" stroke="url(#${gid})" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="10" cy="9" r="1.9" fill="#f0545f"/>
  <circle cx="22" cy="23" r="1.9" fill="#e8843a"/>
</svg>`;
}

export function logo(sub = 'DEVICE INTELLIGENCE', size = 26) {
  return `<div class="logo">${logoMark(size)}<div class="logo-text"><div class="n">NEXUS</div><div class="s">${sub}</div></div></div>`;
}
