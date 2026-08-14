import { panel, statTile, viewHead, simNote } from '../lib/ui.js';
import { icons } from '../lib/icons.js';
import { ago, bytes } from '../lib/format.js';
import { apps, appStats } from '../data/apps.js';

export const meta = { title: 'APPS' };

let mode = 'featured';
let q = '';

export function render() {
  return `
  ${viewHead('SIMULATED APPLICATION INVENTORY', 'Application Intelligence',
    `${appStats.total} fictional applications · ${bytes(appStats.storageMb)} simulated footprint`,
    `<span class="badge sim">SYNTHETIC</span>`)}

  <div class="grid g-4">
    ${statTile('Installed', appStats.total, { pad: 2 })}
    ${statTile('Active', appStats.active, { pad: 2 })}
    ${statTile('Foreground', appStats.foreground, { pad: 2 })}
    ${statTile('Storage (MB)', appStats.storageMb)}
  </div>

  <div style="margin-top:14px">
    ${panel('INVENTORY', `
      <div class="panel-pad">
        <input class="input" id="appq" placeholder="Filter synthetic applications…" style="margin-bottom:14px" autocomplete="off">
        <div class="grid g-4" id="appgrid">${cards()}</div>
      </div>`, {
      right: [['featured', 'CORE'], ['all', 'ALL'], ['active', 'ACTIVE']]
        .map(([k, l]) => `<button class="chip ${mode === k ? 'on' : ''}" data-amode="${k}">${l}</button>`).join(' '),
    })}
  </div>

  <div style="margin-top:14px">${simNote('NEXUS does not query package managers, launchers, or usage-stats APIs. This inventory is invented.')}</div>
  `;
}

function list() {
  return apps.filter((a) => {
    if (mode === 'featured' && !a.featured) return false;
    if (mode === 'active' && a.state === 'STOPPED') return false;
    if (q && !a.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
}

function cards() {
  const l = list();
  if (!l.length) return `<div class="empty" style="grid-column:1/-1"><div class="glyph">⌀</div><div class="mono" style="font-size:11px;letter-spacing:.14em">NO MATCHING APPLICATIONS</div></div>`;
  return l.map((a, i) => `
    <button class="app-card" data-app="${a.id}" style="animation:viewIn .4s cubic-bezier(.16,1,.3,1) ${Math.min(i * 14, 340)}ms backwards">
      <div class="app-icon" style="background:${a.color}1f;border:1px solid ${a.color}3d;color:${a.color}">
        ${a.icon ? `<span style="width:19px;height:19px;display:block">${icons[a.icon]}</span>`
          : `<span class="mono" style="font-size:14px;font-weight:600">${a.name[0]}</span>`}
      </div>
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline">
        <div style="font-size:13px;font-weight:530">${a.name}</div>
        <span class="mono" style="font-size:9.5px;color:var(--faint)">v${a.version}</span>
      </div>
      <div class="label" style="margin-top:5px">${a.category} · ${a.state}</div>
      <div class="app-bar"><i data-w="${a.usagePct}"></i></div>
      <div style="display:flex;justify-content:space-between;margin-top:9px">
        <span class="label">${a.usageMin} MIN TODAY</span>
        <span class="label">${ago(Date.now() - a.lastActiveMin * 60000).toUpperCase()}</span>
      </div>
    </button>`).join('');
}

function detail(a) {
  return `
    <div class="modal-head">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="app-icon" style="margin:0;width:34px;height:34px;border-radius:9px;background:${a.color}1f;border:1px solid ${a.color}3d;color:${a.color}">
          ${a.icon ? `<span style="width:17px;height:17px;display:block">${icons[a.icon]}</span>` : `<span class="mono" style="font-size:12px">${a.name[0]}</span>`}
        </div>
        <div><div class="eyebrow">APPLICATION SIMULATION</div><div style="font-size:15px;margin-top:2px">${a.name}</div></div>
      </div>
      <button class="icon-btn" data-close>${icons.close}</button>
    </div>
    <div class="modal-body" style="grid-template-columns:1fr">
      <div class="modal-side" style="border-left:none">
        <div class="kv"><span class="k">Version</span><span class="v">${a.version}</span></div>
        <div class="kv"><span class="k">Category</span><span class="v">${a.category}</span></div>
        <div class="kv"><span class="k">State</span><span class="v">${a.state}</span></div>
        <div class="kv"><span class="k">Usage today</span><span class="v">${a.usageMin} min</span></div>
        <div class="kv"><span class="k">Simulated events</span><span class="v">${a.events}</span></div>
        <div class="kv"><span class="k">Footprint</span><span class="v">${a.sizeMb} MB</span></div>
        <div class="kv"><span class="k">Permissions</span><span class="v">${a.permissions}</span></div>
        <div class="kv"><span class="k">Last active</span><span class="v">${ago(Date.now() - a.lastActiveMin * 60000)}</span></div>
        <div style="margin-top:14px"><span class="badge sim">FICTIONAL RECORD</span></div>
      </div>
    </div>`;
}

export function mount(root, ctx) {
  const grid = root.querySelector('#appgrid');
  const input = root.querySelector('#appq');

  function animate() {
    requestAnimationFrame(() => {
      grid.querySelectorAll('.app-bar i').forEach((b) => { b.style.width = `${b.dataset.w}%`; });
    });
  }
  function wire() {
    grid.querySelectorAll('[data-app]').forEach((b) => {
      b.onclick = () => ctx.openModal(detail(apps.find((a) => a.id === b.dataset.app)));
    });
    animate();
  }
  wire();

  input.addEventListener('input', () => { q = input.value; grid.innerHTML = cards(); wire(); });
  root.querySelectorAll('[data-amode]').forEach((b) => {
    b.onclick = () => {
      mode = b.dataset.amode;
      root.querySelectorAll('[data-amode]').forEach((x) => x.classList.toggle('on', x === b));
      grid.innerHTML = cards(); wire();
    };
  });
}
