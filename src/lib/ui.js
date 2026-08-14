// Shared presentational fragments used across views.

import { icons } from './icons.js';
import { sparkline } from './charts.js';
import { initials } from './format.js';
import { device } from '../data/devices.js';
import { ownerAvatar } from '../data/avatar.js';

export function panel(title, body, { right = '', pad = false, cls = '' } = {}) {
  return `<section class="panel ${cls}">
    ${title ? `<div class="panel-head"><h3>${title}</h3><div>${right}</div></div>` : ''}
    <div class="${pad ? 'panel-pad' : ''}">${body}</div>
  </section>`;
}

export function statTile(label, value, { spark = null, delta = '', pad = 0, id = '', decimals = 0 } = {}) {
  return `<div class="stat">
    <div class="label">${label}</div>
    <div class="n" data-count="${value}" ${pad ? `data-pad="${pad}"` : ''} ${decimals ? `data-dec="${decimals}"` : ''} ${id ? `id="${id}"` : ''}>0</div>
    ${delta ? `<div class="delta">${delta}</div>` : ''}
    ${spark ? sparkline(spark) : ''}
  </div>`;
}

export function avatar(name, { size = '', hue = null } = {}) {
  const style = hue != null
    ? `background:linear-gradient(145deg, hsl(${hue} 34% 22%), hsl(${hue} 30% 12%));`
    : '';
  return `<div class="avatar ${size}" style="${style}">${initials(name)}</div>`;
}

export function identityCard() {
  return `<div class="identity">
    <div class="avatar photo"><img src="${ownerAvatar}" alt="${device.owner} — synthetic target avatar" loading="lazy"><div class="ring"></div></div>
    <div class="identity-main">
      <div class="label">${device.kind} // ${device.platform}</div>
      <h2>${device.owner}</h2>
      <div class="identity-meta">
        <span class="badge ok"><i class="dot live"></i> ${device.status}</span>
        <span class="badge">LAST SYNC — ${device.lastSync}</span>
        <span class="badge sim">SIMULATION</span>
      </div>
    </div>
    <div class="identity-side">
      <div class="cell"><span class="label">Device ID</span><div class="val">${device.deviceId}</div></div>
      <div class="cell"><span class="label">OS</span><div class="val">${device.os}</div></div>
      <div class="cell"><span class="label">Model</span><div class="val">${device.model}</div></div>
      <div class="cell"><span class="label">Battery</span><div class="val">${device.battery}%</div></div>
      <div class="cell"><span class="label">Network</span><div class="val">${device.network}</div></div>
      <div class="cell"><span class="label">Encryption</span><div class="val" style="color:#7fd6ae">${device.encryption}</div></div>
    </div>
  </div>`;
}

export function viewHead(eyebrow, title, sub, right = '') {
  return `<header class="view-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap">
    <div>
      <div class="eyebrow">${eyebrow}</div>
      <h1>${title}</h1>
      ${sub ? `<p class="sub">${sub}</p>` : ''}
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${right}</div>
  </header>`;
}

export function empty(text, glyph = '∅') {
  return `<div class="empty"><div class="glyph">${glyph}</div><div class="mono" style="font-size:11px;letter-spacing:.14em">${text}</div></div>`;
}

export function simNote(text) {
  return `<div style="display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border:1px solid var(--line);border-radius:var(--r);background:rgba(255,255,255,.015)">
    <span style="color:var(--faint);width:14px;flex:none;margin-top:1px">${icons.shield}</span>
    <p style="font-size:11.5px;color:var(--muted);line-height:1.6">${text}</p>
  </div>`;
}

export function iconWrap(key, color, size = 15) {
  return `<span style="display:inline-flex;width:${size}px;height:${size}px;color:${color}">${icons[key] || icons.file}</span>`;
}
