import { panel, statTile, viewHead, avatar, simNote } from '../lib/ui.js';
import { icons } from '../lib/icons.js';
import { sparkline } from '../lib/charts.js';
import { ago, hhmm } from '../lib/format.js';
import { contacts, byId } from '../data/contacts.js';
import { device } from '../data/devices.js';
import { ownerAvatar } from '../data/avatar.js';
import { conversations } from '../data/messages.js';
import { calls } from '../data/calls.js';

export const meta = { title: 'CONTACTS' };

const W = 900, H = 520, CX = W / 2, CY = H / 2;
const RADIUS = { inner: 132, mid: 186, outer: 232 };

function pos(c) {
  const rad = (c.angle * Math.PI) / 180;
  return { x: CX + Math.cos(rad) * RADIUS[c.tier], y: CY + Math.sin(rad) * RADIUS[c.tier] };
}

function graph() {
  const pts = contacts.map((c) => ({ c, ...pos(c) }));
  const links = pts.map(({ c, x, y }, i) => `
    <line class="net-link ${c.tier === 'inner' ? 'pulse' : ''}" x1="${CX}" y1="${CY}" x2="${x}" y2="${y}"
      stroke-width="${c.tier === 'inner' ? 1.5 : 1}"/>
    <line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}" stroke="rgba(216,50,63,.5)" stroke-width="1"
      stroke-dasharray="3 17" class="net-flow" style="animation-delay:${i * 320}ms"/>`).join('');

  // A few peripheral links between contacts to imply a real network.
  const cross = [[0, 1], [1, 2], [2, 3], [4, 5]].map(([a, b]) => {
    const p = pts[a], q2 = pts[b];
    return `<line x1="${p.x}" y1="${p.y}" x2="${q2.x}" y2="${q2.y}" stroke="rgba(255,255,255,.06)" stroke-width="1"/>`;
  }).join('');

  const nodes = pts.map(({ c, x, y }) => `
    <g class="net-node" data-node="${c.id}" transform="translate(${x} ${y})">
      <circle class="nring" r="30" fill="#131315" stroke="rgba(255,255,255,.14)" stroke-width="1"/>
      <circle r="30" fill="hsl(${c.hue} 34% 18%)" opacity=".55"/>
      <text y="4.5" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="12.5" font-weight="600" fill="#ededee">${c.name}</text>
      <text y="48" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8.5" fill="#6e6e74" letter-spacing="1.4">${c.relation}</text>
      <text y="60" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8.5" fill="#4a4a50" letter-spacing="1.2">${c.interactions} EVENTS</text>
    </g>`).join('');

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Synthetic contact network">
    <defs>
      <radialGradient id="corec"><stop offset="0%" stop-color="#d8323f" stop-opacity=".35"/><stop offset="100%" stop-color="#d8323f" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="${CX}" cy="${CY}" r="${RADIUS.inner}" fill="none" stroke="rgba(255,255,255,.045)" stroke-dasharray="2 8"/>
    <circle cx="${CX}" cy="${CY}" r="${RADIUS.mid}" fill="none" stroke="rgba(255,255,255,.035)" stroke-dasharray="2 8"/>
    <circle cx="${CX}" cy="${CY}" r="${RADIUS.outer}" fill="none" stroke="rgba(255,255,255,.028)" stroke-dasharray="2 8"/>
    ${links}${cross}
    <circle cx="${CX}" cy="${CY}" r="90" fill="url(#corec)"/>
    <defs><clipPath id="coreClip"><circle cx="${CX}" cy="${CY}" r="40"/></clipPath></defs>
    <g>
      <image href="${ownerAvatar}" x="${CX - 40}" y="${CY - 40}" width="80" height="80" clip-path="url(#coreClip)" preserveAspectRatio="xMidYMid slice"/>
      <circle cx="${CX}" cy="${CY}" r="42" fill="none" stroke="rgba(216,50,63,.7)" stroke-width="1.6"/>
      <circle class="marker-pulse" cx="${CX}" cy="${CY}" r="42" fill="none" stroke="rgba(216,50,63,.45)" stroke-width="1"/>
      <text x="${CX}" y="${CY + 62}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="620" fill="#fff">${device.owner}</text>
      <text x="${CX}" y="${CY + 76}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8" fill="#a9a9ad" letter-spacing="1.6">VIRTUAL DEVICE</text>
    </g>
    ${nodes}
  </svg>`;
}

export function render() {
  const totalInteractions = contacts.reduce((n, c) => n + c.interactions, 0);
  return `
  ${viewHead('SYNTHETIC RELATIONSHIP GRAPH', 'Contact Network',
    'Fictional contacts mapped by simulated interaction strength.',
    `<span class="badge sim">FICTIONAL PEOPLE</span>`)}

  <div class="grid g-4">
    ${statTile('Contacts', contacts.length, { pad: 2 })}
    ${statTile('Inner circle', contacts.filter((c) => c.tier === 'inner').length, { pad: 2 })}
    ${statTile('Interactions', totalInteractions)}
    ${statTile('Strongest tie', contacts[0].strength, { delta: `${contacts[0].name} · strength index` })}
  </div>

  <div class="net-wrap" style="margin-top:14px">${graph()}</div>

  <div class="grid g-3" style="margin-top:14px" id="clist">
    ${contacts.map((c) => `
      <button class="app-card" data-contact="${c.id}">
        <div style="display:flex;gap:12px;align-items:center">
          ${avatar(c.name, { size: 'sm', hue: c.hue })}
          <div style="flex:1;min-width:0">
            <div style="font-size:13.5px;font-weight:540">${c.full}</div>
            <div class="label" style="margin-top:3px">${c.relation} · ${c.role}</div>
          </div>
          <span style="width:15px;color:var(--faint)">${icons.eye}</span>
        </div>
        <div class="app-bar"><i data-w="${c.strength}"></i></div>
        <div style="display:flex;justify-content:space-between;margin-top:9px">
          <span class="label">STRENGTH ${c.strength}</span>
          <span class="label">${c.interactions} EVENTS</span>
        </div>
      </button>`).join('')}
  </div>

  <div style="margin-top:14px">${simNote('These people do not exist. No address book, SIM, or account contact list is accessed at any point.')}</div>
  `;
}

function profile(c) {
  const conv = conversations.find((x) => x.contact === c.id);
  const cCalls = calls.filter((x) => x.contact === c.id);
  return `
    <div class="modal-head">
      <div style="display:flex;gap:12px;align-items:center">
        ${avatar(c.name, { size: 'sm', hue: c.hue })}
        <div><div class="eyebrow">SYNTHETIC PROFILE</div><div style="font-size:15px;margin-top:2px">${c.full}</div></div>
      </div>
      <button class="icon-btn" data-close>${icons.close}</button>
    </div>
    <div class="modal-body">
      <div class="modal-stage" style="min-height:auto;padding:24px">
        <div style="width:100%">
          <div class="label">INTERACTION TREND (SIMULATED)</div>
          <div style="margin-top:10px">${sparkline([4, 7, 5, 9, 6, 11, 8, 13, 10, 15], { w: 420, h: 90, color: `hsl(${c.hue} 60% 55%)` })}</div>
          <div class="kv" style="margin-top:16px"><span class="k">Last message</span><span class="v">${conv ? `${hhmm(conv.lastTs)} · ${ago(conv.lastTs)}` : '—'}</span></div>
          <div class="kv"><span class="k">Simulated calls</span><span class="v">${cCalls.length}</span></div>
          <div class="kv"><span class="k">Note</span><span class="v" style="font-size:11px">${c.note}</span></div>
        </div>
      </div>
      <div class="modal-side">
        <div class="kv"><span class="k">Alias</span><span class="v">${c.name}</span></div>
        <div class="kv"><span class="k">Relation</span><span class="v">${c.relation}</span></div>
        <div class="kv"><span class="k">Role</span><span class="v">${c.role}</span></div>
        <div class="kv"><span class="k">Number</span><span class="v">${c.number}</span></div>
        <div class="kv"><span class="k">Known since</span><span class="v">${c.since}</span></div>
        <div class="kv"><span class="k">Tier</span><span class="v">${c.tier.toUpperCase()}</span></div>
        <div class="kv"><span class="k">Strength</span><span class="v">${c.strength}/100</span></div>
        <div class="kv"><span class="k">Events</span><span class="v">${c.interactions}</span></div>
        <div style="margin-top:14px"><span class="badge sim">FICTIONAL PERSON</span></div>
      </div>
    </div>`;
}

export function mount(root, ctx) {
  requestAnimationFrame(() => {
    root.querySelectorAll('.app-bar i').forEach((b) => { b.style.width = `${b.dataset.w}%`; });
  });
  const open = (id) => ctx.openModal(profile(byId[id]));
  root.querySelectorAll('[data-contact]').forEach((b) => { b.onclick = () => open(b.dataset.contact); });
  root.querySelectorAll('[data-node]').forEach((g) => { g.addEventListener('click', () => open(g.dataset.node)); });
}
