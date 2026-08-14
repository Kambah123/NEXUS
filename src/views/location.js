import { panel, statTile, viewHead, simNote } from '../lib/ui.js';
import { icons } from '../lib/icons.js';
import { ago, hhmm } from '../lib/format.js';
import { locations, currentPosition, movementEvents, locationStats } from '../data/locations.js';
import { makeRng } from '../lib/rng.js';

export const meta = { title: 'LOCATION' };

let selected = currentPosition.id;

// ---- Procedural dark basemap (entirely fictional geography) ----
function basemap() {
  const r = makeRng(64);
  let blocks = '';
  for (let i = 0; i < 92; i++) {
    const x = Math.round(r() * 980);
    const y = Math.round(r() * 540);
    const w = 22 + Math.round(r() * 96);
    const h = 16 + Math.round(r() * 70);
    blocks += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="rgba(255,255,255,${(0.03 + r() * 0.05).toFixed(3)})" stroke="rgba(255,255,255,.07)"/>`;
  }
  let roads = '';
  for (let i = 1; i < 9; i++) {
    roads += `<line x1="0" y1="${i * 62}" x2="1000" y2="${i * 62}" stroke="rgba(255,255,255,.075)" stroke-width="1"/>`;
  }
  for (let i = 1; i < 14; i++) {
    roads += `<line x1="${i * 74}" y1="0" x2="${i * 74}" y2="560" stroke="rgba(255,255,255,.06)" stroke-width="1"/>`;
  }
  const parks = `<path d="M96 96 h150 v104 h-150 Z" fill="rgba(63,178,127,.09)" stroke="rgba(63,178,127,.18)"/>
    <text x="112" y="126" font-family="ui-monospace,monospace" font-size="9" fill="rgba(127,214,174,.5)">LINDEN PARK</text>
    <circle cx="742" cy="120" r="54" fill="rgba(63,178,127,.07)" stroke="rgba(63,178,127,.15)"/>`;
  const water = `<path d="M0 470 Q 160 430 300 466 T 620 452 T 1000 486 L1000 560 L0 560 Z"
      fill="rgba(60,110,150,.16)" stroke="rgba(120,180,230,.24)"/>
    <text x="40" y="524" font-family="ui-monospace,monospace" font-size="9" fill="rgba(120,180,230,.45)" letter-spacing="1.5">SOUTH CHANNEL (SIM)</text>`;
  const arterial = `<path d="M0 372 Q 240 330 470 356 T 1000 300" fill="none" stroke="rgba(232,132,58,.26)" stroke-width="3"/>
    <path d="M188 0 Q 240 220 300 560" fill="none" stroke="rgba(232,132,58,.18)" stroke-width="2.2"/>
    <path d="M0 196 Q 380 168 1000 214" fill="none" stroke="rgba(232,132,58,.14)" stroke-width="2"/>`;
  return `<g>${roads}${blocks}${parks}${water}${arterial}</g>`;
}

function mapSvg() {
  const chrono = [...locations].reverse();
  const trail = chrono.map((l) => `${l.x} ${l.y}`).join(' L ');
  const cur = currentPosition;

  const pins = chrono.map((l, i) => {
    const isCur = l.id === cur.id;
    const c = isCur ? '#d8323f' : l.kind === 'dwell' ? '#e8843a' : 'rgba(255,255,255,.55)';
    const rad = isCur ? 5.5 : l.kind === 'dwell' ? 4 : 2.8;
    return `<g class="loc-pin" data-pin="${l.id}" style="cursor:pointer">
      ${isCur ? `<circle cx="${l.x}" cy="${l.y}" r="4" fill="none" stroke="${c}" stroke-width="1.4" class="marker-pulse"/>` : ''}
      <circle cx="${l.x}" cy="${l.y}" r="${rad}" fill="${c}" opacity="${isCur ? 1 : 0.85}"/>
      <circle cx="${l.x}" cy="${l.y}" r="${rad + 7}" fill="transparent"/>
      ${l.kind === 'dwell' ? `<text x="${l.x + 10}" y="${l.y + 3.5}" font-family="ui-monospace,monospace" font-size="9" fill="rgba(255,255,255,.42)">${l.id}</text>` : ''}
    </g>`;
  }).join('');

  return `<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Simulated movement map">
    <rect width="1000" height="560" fill="#080a0c"/>
    ${basemap()}
    <path class="trail-draw" d="M ${trail}" fill="none" stroke="rgba(216,50,63,.55)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M ${trail}" fill="none" stroke="rgba(216,50,63,.9)" stroke-width="1" stroke-dasharray="5 9" class="net-flow"/>
    ${pins}
    <g opacity=".5">
      <line x1="30" y1="530" x2="120" y2="530" stroke="rgba(255,255,255,.4)" stroke-width="1.2"/>
      <text x="126" y="533" font-family="ui-monospace,monospace" font-size="9" fill="rgba(255,255,255,.4)">1 KM (SIM)</text>
    </g>
  </svg>`;
}

export function render() {
  return `
  ${viewHead('SIMULATED POSITIONING', 'Location Intelligence',
    'Fictional coordinates and an invented movement trail. Browser geolocation is never requested.',
    `<span class="badge warm">FICTIONAL COORDINATES</span>`)}

  <div class="grid g-4">
    ${statTile('Locations today', locationStats.points)}
    ${statTile('Movement events', locationStats.movements, { pad: 2 })}
    ${statTile('Dwell sites', locationStats.dwellSites, { pad: 2 })}
    ${statTile('Trail distance', locationStats.distanceKm, { decimals: 1, delta: 'kilometres (simulated)' })}
  </div>

  <div style="margin-top:14px" class="map-shell">
    ${mapSvg()}
    <div class="map-hud">
      <div class="card">
        <div class="label">LOCATION SIMULATION</div>
        <div class="mono" style="font-size:17px;margin-top:6px" id="lat">${currentPosition.lat.toFixed(4)}°</div>
        <div class="mono" style="font-size:17px" id="lon">${currentPosition.lon.toFixed(4)}°</div>
        <div class="label" style="margin-top:8px">ACCURACY — SIMULATED</div>
        <div class="label" style="margin-top:3px" id="lupd">UPDATED ${ago(currentPosition.ts).toUpperCase()}</div>
      </div>
      <div class="card" style="display:flex;gap:8px;align-items:center">
        <i class="dot red live"></i>
        <span class="mono" style="font-size:10.5px" id="lname">${currentPosition.label}</span>
      </div>
    </div>
    <div class="map-legend">
      <span class="label" style="display:flex;gap:6px;align-items:center"><i class="dot red"></i>CURRENT</span>
      <span class="label" style="display:flex;gap:6px;align-items:center"><i class="dot warm"></i>DWELL</span>
      <span class="label" style="display:flex;gap:6px;align-items:center"><i class="dot" style="background:rgba(255,255,255,.5)"></i>TRANSIT</span>
      <span class="label" style="color:#f0a0a6">SIMULATED ROUTE ${locationStats.routeState}</span>
    </div>
  </div>

  <div class="grid" style="grid-template-columns:1.35fr 1fr;margin-top:14px">
    ${panel('POSITION HISTORY', `<div class="scroll" style="max-height:420px;overflow-y:auto" id="lochist">${rows()}</div>`,
      { right: `<span class="label">${locations.length} POINTS</span>` })}

    ${panel('MOVEMENT EVENTS', movementEvents.slice().reverse().map((m) => `
      <div class="loc-row">
        <span style="width:16px;color:var(--warm)">${icons.bolt}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:12.5px">${m.label}</div>
          <div class="label" style="margin-top:3px">${m.mode} · ${ago(m.ts).toUpperCase()}</div>
        </div>
        <span class="mono" style="font-size:10.5px;color:var(--faint)">${hhmm(m.ts)}</span>
      </div>`).join(''))}
  </div>

  <div style="margin-top:14px">${simNote('No GPS, no network positioning, no geolocation permission, no IP lookup. The map above is a procedurally drawn fictional city.')}</div>
  `;
}

function rows() {
  return locations.map((l) => `
    <button class="loc-row" style="width:100%;text-align:left" data-loc="${l.id}">
      <span class="idx mono">${l.id}</span>
      <span style="width:15px;color:${l.id === currentPosition.id ? '#d8323f' : l.kind === 'dwell' ? '#e8843a' : 'var(--faint)'}">${icons.location}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12.5px">${l.label}</div>
        <div class="label" style="margin-top:3px">${l.lat.toFixed(4)}° · ${l.lon.toFixed(4)}° · ${l.kind.toUpperCase()}${l.dwellMin ? ` · ${l.dwellMin} MIN` : ''}</div>
      </div>
      <span class="mono" style="font-size:10.5px;color:var(--faint)">${hhmm(l.ts)}</span>
    </button>`).join('');
}

export function mount(root, ctx) {
  const focus = (id) => {
    const l = locations.find((x) => x.id === id);
    if (!l) return;
    selected = id;
    root.querySelector('#lat').textContent = `${l.lat.toFixed(4)}°`;
    root.querySelector('#lon').textContent = `${l.lon.toFixed(4)}°`;
    root.querySelector('#lname').textContent = l.label;
    root.querySelector('#lupd').textContent = `UPDATED ${ago(l.ts).toUpperCase()}`;
    ctx.toast(`Synthetic waypoint ${l.id} selected`);
  };

  root.querySelectorAll('[data-loc]').forEach((b) => { b.onclick = () => focus(b.dataset.loc); });
  root.querySelectorAll('[data-pin]').forEach((g) => { g.addEventListener('click', () => focus(g.dataset.pin)); });
}
