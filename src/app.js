/* ============================================================
   NEXUS — application shell, router, and simulation controls.

   RESPONSIBLE SIMULATION NOTICE
   This file contains no surveillance capability. It never calls
   navigator.geolocation, getUserMedia, clipboard APIs, storage APIs,
   or fetch/XHR. It registers no global input listeners other than the
   declared navigation shortcuts, and it captures nothing.
   ============================================================ */

import { $, $$, countUp, sleep } from './lib/dom.js';
import { icons, logo } from './lib/icons.js';
import { clock } from './lib/format.js';
import { makeEvent } from './data/activity.js';
import { device } from './data/devices.js';
import { totalUnread } from './data/messages.js';
import { callStats } from './data/calls.js';
import { mediaStats } from './data/media.js';
import { appStats } from './data/apps.js';
import { locationStats } from './data/locations.js';
import { contacts } from './data/contacts.js';

/* ---------------------------- routes ---------------------------- */

const ROUTES = [
  { key: 'overview', label: 'OVERVIEW', icon: 'overview', group: 'INTELLIGENCE', count: '' },
  { key: 'messages', label: 'MESSAGES', icon: 'messages', group: 'INTELLIGENCE', count: totalUnread ? `${totalUnread}` : '' },
  { key: 'calls', label: 'CALLS', icon: 'calls', group: 'INTELLIGENCE', count: `${callStats.total}` },
  { key: 'media', label: 'MEDIA', icon: 'media', group: 'INTELLIGENCE', count: `${mediaStats.total}` },
  { key: 'location', label: 'LOCATION', icon: 'location', group: 'INTELLIGENCE', count: `${locationStats.points}` },
  { key: 'apps', label: 'APPS', icon: 'apps', group: 'SURFACE', count: `${appStats.total}` },
  { key: 'contacts', label: 'CONTACTS', icon: 'contacts', group: 'SURFACE', count: `${contacts.length}` },
  { key: 'activity', label: 'ACTIVITY', icon: 'activity', group: 'SURFACE', count: '' },
  { key: 'device', label: 'DEVICE', icon: 'device', group: 'SURFACE', count: '' },
  { key: 'system', label: 'SYSTEM', icon: 'system', group: 'CONTROL', count: '' },
];

const loaders = {
  overview: () => import('./views/overview.js'),
  messages: () => import('./views/messages.js'),
  calls: () => import('./views/calls.js'),
  media: () => import('./views/media.js'),
  location: () => import('./views/location.js'),
  apps: () => import('./views/apps.js'),
  contacts: () => import('./views/contacts.js'),
  activity: () => import('./views/activity.js'),
  device: () => import('./views/device.js'),
  system: () => import('./views/system.js'),
};

const moduleCache = new Map();
let currentModule = null;
let eventSeq = 0;

const ctx = {
  sessionStart: Date.now(),
  nextEvent: () => makeEvent(eventSeq++),
  toast,
  openModal,
  closeModal,
  reveal,
  restart,
  goHome,
  navigate,
};

/* ------------------------------ login ----------------------------
   A local access gate. The credentials are compared in-browser against
   fixed values; nothing the visitor types is stored or transmitted.
   Because this is a static page, the values are visible in source — it
   gates casual entry, it is not real authentication.
   ------------------------------------------------------------------ */

const AUTH = { email: 'wolny746@gmail.com', pass: 'Nexus@123' };
let authed = false;
let pendingDeepLink = false;

$('#login-logo').innerHTML = logo('DEVICE INTELLIGENCE', 30);

function grantAccess() {
  authed = true;
  const login = $('#login');
  login.style.transition = 'opacity .4s ease';
  login.style.opacity = '0';
  setTimeout(() => {
    login.style.display = 'none';
    if (pendingDeepLink) {
      enterApp();
    } else {
      $('#landing').removeAttribute('data-gate');
    }
  }, 380);
}

$('#login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  // Normalise both fields: mobile keyboards can inject leading/trailing spaces
  // or smart-quotes, which would otherwise fail an exact match.
  const email = $('#login-email').value.trim().toLowerCase();
  const pass = $('#login-pass').value.trim();
  const err = $('#login-error');
  if (email === AUTH.email.toLowerCase() && pass === AUTH.pass) {
    err.classList.remove('show');
    grantAccess();
  } else {
    err.classList.add('show');
    const box = $('#login');
    box.classList.remove('shake');
    void box.offsetWidth;
    box.classList.add('shake');
  }
});

/* ---------------------------- landing --------------------------- */

$('#land-logo').innerHTML = logo('DEVICE INTELLIGENCE', 28);

$$('[data-scroll]').forEach((b) => {
  b.onclick = () => $(`#${b.dataset.scroll}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
});

$('#btn-init').onclick = () => runInit();
$('#btn-init-2').onclick = () => runInit();
$('#btn-demo').onclick = () => runInit(true);
$('#land-demo-link').onclick = () => runInit(true);

/* ------------------------ initialization ------------------------ */

const INIT_STEPS = [
  'Establishing virtual environment...',
  'Generating synthetic device profile...',
  'Preparing intelligence modules...',
  'Generating activity dataset...',
  'Loading visual telemetry...',
  'Synchronizing simulation...',
];

let initRunning = false;

async function runInit(fast = false) {
  if (initRunning) return;
  initRunning = true;

  const box = $('#init');
  const lines = $('#init-lines');
  const fill = $('#init-fill');
  const pct = $('#init-pct');
  $('#init-running').style.display = '';
  $('#init-done').style.display = 'none';
  lines.innerHTML = '';
  fill.style.width = '0%';
  pct.textContent = '0%';
  box.removeAttribute('data-gate');
  box.classList.add('on');
  box.setAttribute('aria-hidden', 'false');

  const nodes = INIT_STEPS.map((text) => {
    const d = document.createElement('div');
    d.className = 'init-line';
    d.innerHTML = `<span class="spin"></span><span>${text}</span>`;
    lines.append(d);
    return d;
  });

  const speed = fast ? 0.45 : 1;
  let progress = 0;

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].classList.add('show');
    await sleep(120 * speed);

    // Realistic non-linear progress within this step's band.
    const target = Math.round(((i + 1) / nodes.length) * 100);
    while (progress < target) {
      progress = Math.min(target, progress + (Math.random() < 0.22 ? 1 : Math.ceil(Math.random() * 4)));
      fill.style.width = `${progress}%`;
      pct.textContent = `${progress}%`;
      await sleep((Math.random() < 0.15 ? 90 : 26) * speed);
    }
    nodes[i].classList.add('done');
    nodes[i].querySelector('.spin').outerHTML = `<span class="tick">✓</span>`;
    await sleep(90 * speed);
  }

  fill.style.width = '100%';
  pct.textContent = '100%';
  $('#init-hint').textContent = 'VIRTUAL DEVICE READY';
  await sleep(560 * speed);

  $('#init-running').style.display = 'none';
  $('#init-done').style.display = '';
  initRunning = false;
}

$('#btn-enter').onclick = async () => {
  const box = $('#init');
  box.classList.remove('on');
  box.setAttribute('aria-hidden', 'true');
  $('#landing').style.display = 'none';
  enterApp();
};

/* ---------------------------- app shell -------------------------- */

let shellBuilt = false;

function buildShell() {
  const app = $('#app');
  const groups = [...new Set(ROUTES.map((r) => r.group))];

  app.innerHTML = `
  <header class="topbar">
    <div style="display:flex;align-items:center;gap:14px">
      <button class="icon-btn" id="btn-menu" style="display:none">${icons.menu}</button>
      <div id="app-logo"></div>
    </div>
    <div class="topbar-right">
      <span class="badge sim" id="sim-badge"><i class="dot red live"></i> SIMULATION ACTIVE</span>
      <span class="clock" id="clock">--:--:--</span>
      <button class="icon-btn tooltip" data-tip="Command palette — Ctrl K" id="btn-cmd">${icons.search}</button>
    </div>
  </header>

  <div class="shell">
    <aside class="sidebar scroll" id="sidebar">
      ${groups.map((g) => `
        <div class="side-group"><span class="label">${g}</span></div>
        ${ROUTES.filter((r) => r.group === g).map((r) => `
          <button class="nav-item" data-route="${r.key}">
            ${icons[r.icon]}<span>${r.label}</span>
            ${r.count ? `<span class="count mono">${r.count}</span>` : ''}
          </button>`).join('')}
      `).join('')}
      <div class="side-foot">
        <div class="kv" style="border:none;padding:4px 0"><span class="k">TARGET</span><span class="v" style="font-size:10.5px">${device.owner}</span></div>
        <div class="kv" style="border:none;padding:4px 0"><span class="k">DEVICE</span><span class="v" style="font-size:10.5px">${device.deviceId}</span></div>
        <div style="margin-top:10px"><span class="badge sim" style="width:100%;justify-content:center">SYNTHETIC DATA</span></div>
      </div>
    </aside>

    <main class="main" id="main"></main>
  </div>

  <nav class="mobnav" id="mobnav">
    ${[['overview', 'HOME', 'home'], ['messages', 'MESSAGES', 'messages'], ['media', 'MEDIA', 'media'],
       ['location', 'LOCATION', 'location'], ['__more', 'MORE', 'more']]
      .map(([k, l, ic]) => `<button data-mob="${k}">${icons[ic]}<span>${l}</span></button>`).join('')}
  </nav>`;

  $('#app-logo').innerHTML = logo('DEVICE INTELLIGENCE', 26);

  $$('[data-route]').forEach((b) => { b.onclick = () => navigate(b.dataset.route); });

  const sidebar = $('#sidebar');
  const menuBtn = $('#btn-menu');
  const syncMenu = () => {
    const mobile = window.matchMedia('(max-width: 960px)').matches;
    menuBtn.style.display = mobile ? 'inline-flex' : 'none';
    if (!mobile) sidebar.classList.remove('open');
  };
  menuBtn.onclick = () => sidebar.classList.toggle('open');
  window.addEventListener('resize', syncMenu);
  syncMenu();

  $$('[data-mob]').forEach((b) => {
    b.onclick = () => {
      if (b.dataset.mob === '__more') { sidebar.classList.add('open'); return; }
      navigate(b.dataset.mob);
    };
  });

  $('#btn-cmd').onclick = () => openPalette();

  setInterval(() => { const c = $('#clock'); if (c) c.textContent = clock(); }, 1000);
  $('#clock').textContent = clock();

  shellBuilt = true;
}

function enterApp() {
  if (!shellBuilt) buildShell();
  $('#app').removeAttribute('data-gate');
  $('#app').classList.add('on');
  $('#app').setAttribute('aria-hidden', 'false');
  const start = (location.hash || '#/overview').replace('#/', '') || 'overview';
  navigate(loaders[start] ? start : 'overview', true);
  toast('Virtual device connected — all data synthetic');
}

/* ------------------------------ router --------------------------- */

async function navigate(key, silent = false) {
  if (!loaders[key]) key = 'overview';
  const main = $('#main');
  if (!main) return;

  if (currentModule && typeof currentModule.unmount === 'function') {
    try { currentModule.unmount(); } catch { /* no-op */ }
  }

  location.hash = `#/${key}`;
  $$('[data-route]').forEach((b) => b.classList.toggle('active', b.dataset.route === key));
  $$('[data-mob]').forEach((b) => b.classList.toggle('active', b.dataset.mob === key));
  $('#sidebar')?.classList.remove('open');

  // Skeleton while the view module loads.
  main.innerHTML = skeleton();
  sweep();

  let mod = moduleCache.get(key);
  if (!mod) {
    mod = await loaders[key]();
    moduleCache.set(key, mod);
  }
  currentModule = mod;

  main.innerHTML = `<div class="view-enter">${mod.render(ctx)}</div>`;
  main.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  // Animated counters.
  main.querySelectorAll('[data-count]').forEach((n) => {
    countUp(n, Number(n.dataset.count), {
      pad: Number(n.dataset.pad || 0),
      decimals: Number(n.dataset.dec || 0),
      suffix: n.dataset.suffix || '',
    });
  });

  // Cross-view shortcuts embedded in cards.
  main.querySelectorAll('[data-goto]').forEach((b) => { b.onclick = () => navigate(b.dataset.goto); });

  if (typeof mod.mount === 'function') mod.mount(main, ctx);
}

function skeleton() {
  return `<div>
    <div class="skel" style="height:12px;width:180px"></div>
    <div class="skel" style="height:26px;width:280px;margin-top:12px"></div>
    <div class="skel" style="height:96px;margin-top:22px;border-radius:16px"></div>
    <div class="grid g-4" style="margin-top:14px">
      ${Array(4).fill('<div class="skel" style="height:96px;border-radius:10px"></div>').join('')}
    </div>
    <div class="grid g-2" style="margin-top:14px">
      ${Array(2).fill('<div class="skel" style="height:260px;border-radius:16px"></div>').join('')}
    </div>
  </div>`;
}

function sweep() {
  const s = document.createElement('div');
  s.className = 'scanline';
  document.body.append(s);
  setTimeout(() => s.remove(), 700);
}

window.addEventListener('hashchange', () => {
  if (!$('#app').classList.contains('on')) return;
  const key = location.hash.replace('#/', '');
  const activeBtn = $(`[data-route="${key}"]`);
  if (activeBtn && !activeBtn.classList.contains('active')) navigate(key);
});

/* ------------------------------ modal ---------------------------- */

function openModal(html) {
  const back = $('#modal-back');
  $('#modal').innerHTML = html;
  back.classList.add('on');
  $('#modal').querySelectorAll('[data-close]').forEach((b) => { b.onclick = closeModal; });
}

function closeModal() {
  $('#modal-back').classList.remove('on');
  setTimeout(() => { if (!$('#modal-back').classList.contains('on')) $('#modal').innerHTML = ''; }, 260);
}

$('#modal-back').addEventListener('click', (e) => { if (e.target.id === 'modal-back') closeModal(); });

/* ------------------------------ toasts --------------------------- */

function toast(text, kind = 'sim') {
  const wrap = $('#toasts');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i class="dot ${kind === 'sim' ? 'red' : ''} live"></i><span>${text}</span>`;
  wrap.append(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 320);
  }, 3400);
  while (wrap.children.length > 3) wrap.firstChild.remove();
}

/* -------------------------- command palette ---------------------- */

const COMMANDS = [
  ...ROUTES.map((r) => ({
    label: r.key === 'overview' ? 'Go to Overview' : `Open ${r.label.charAt(0) + r.label.slice(1).toLowerCase()}`,
    hint: r.group, icon: r.icon, run: () => navigate(r.key),
  })),
  { label: 'Reveal Simulation', hint: 'END PRANK', icon: 'eye', run: () => reveal() },
  { label: 'Regenerate Session', hint: 'CONTROL', icon: 'bolt', run: () => restart() },
  { label: 'Return to Landing', hint: 'CONTROL', icon: 'home', run: () => goHome() },
];

let cmdIndex = 0;
let cmdFiltered = COMMANDS;

function openPalette() {
  const back = $('#cmd-back');
  back.classList.add('on');
  const input = $('#cmd-input');
  input.value = '';
  cmdIndex = 0;
  renderCmd();
  setTimeout(() => input.focus(), 40);
}

function closePalette() {
  $('#cmd-back').classList.remove('on');
}

function renderCmd() {
  const q = $('#cmd-input').value.trim().toLowerCase();
  cmdFiltered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
  if (cmdIndex >= cmdFiltered.length) cmdIndex = 0;
  const list = $('#cmd-list');
  if (!cmdFiltered.length) {
    list.innerHTML = `<div class="empty" style="padding:26px"><div class="mono" style="font-size:11px;letter-spacing:.14em">NO COMMANDS</div></div>`;
    return;
  }
  list.innerHTML = cmdFiltered.map((c, i) => `
    <button class="cmd-item ${i === cmdIndex ? 'on' : ''}" data-cmd="${i}">
      <span style="width:15px;height:15px;color:var(--muted);display:block">${icons[c.icon] || icons.bolt}</span>
      <span style="font-size:13px">${c.label}</span>
      <span class="ck">${c.hint}</span>
    </button>`).join('');
  list.querySelectorAll('[data-cmd]').forEach((b) => {
    b.onclick = () => { closePalette(); cmdFiltered[Number(b.dataset.cmd)].run(); };
  });
}

$('#cmd-input').addEventListener('input', () => { cmdIndex = 0; renderCmd(); });
$('#cmd-back').addEventListener('click', (e) => { if (e.target.id === 'cmd-back') closePalette(); });

/* --------------------------- shortcuts ---------------------------
   Navigation only. NEXUS never records or transmits key input.
   ------------------------------------------------------------------ */

document.addEventListener('keydown', (e) => {
  const paletteOpen = $('#cmd-back').classList.contains('on');

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    paletteOpen ? closePalette() : openPalette();
    return;
  }

  if (e.key === 'Escape') {
    if (paletteOpen) return closePalette();
    if ($('#modal-back').classList.contains('on')) return closeModal();
    return;
  }

  if (paletteOpen) {
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdIndex = Math.min(cmdFiltered.length - 1, cmdIndex + 1); renderCmd(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); cmdIndex = Math.max(0, cmdIndex - 1); renderCmd(); }
    if (e.key === 'Enter') { e.preventDefault(); const c = cmdFiltered[cmdIndex]; closePalette(); if (c) c.run(); }
    return;
  }

  // Number shortcuts jump between modules — only while the app is open
  // and only when the user is not typing in a field.
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
  if (typing || !$('#app').classList.contains('on')) return;
  const n = Number(e.key);
  if (n >= 1 && n <= ROUTES.length) navigate(ROUTES[n - 1].key);
});

/* --------------------------- reveal / reset ----------------------- */

let revealed = false;

async function reveal() {
  if (revealed) return;
  revealed = true;
  closeModal();
  closePalette();

  const app = $('#app');
  app.classList.add('dissolve');
  toast('Ending simulation…');
  await sleep(760);

  app.classList.remove('on', 'dissolve');
  app.setAttribute('aria-hidden', 'true');
  $('#landing').setAttribute('data-gate', '');

  const r = $('#reveal');
  r.removeAttribute('data-gate');
  r.classList.add('on');

  // Re-trigger the staggered entrance each time.
  r.querySelectorAll('.stagger > *').forEach((n) => {
    n.style.animation = 'none';
    void n.offsetWidth;
    n.style.animation = '';
  });
}

$('#btn-again').onclick = async () => {
  $('#reveal').classList.remove('on');
  revealed = false;
  await sleep(420);
  ctx.sessionStart = Date.now();
  await runInit();
};

$('#btn-return').onclick = () => {
  $('#reveal').classList.remove('on');
  revealed = false;
  goHome();
};

async function restart() {
  $('#app').classList.remove('on');
  $('#app').setAttribute('aria-hidden', 'true');
  ctx.sessionStart = Date.now();
  await runInit();
}

function goHome() {
  $('#app').classList.remove('on');
  $('#app').setAttribute('aria-hidden', 'true');
  $('#reveal').classList.remove('on');
  $('#init').classList.remove('on');
  revealed = false;
  $('#landing').removeAttribute('data-gate');
  $('#landing').style.display = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ------------------------------ boot ------------------------------ */

// Deep link support: /#/messages opens the dashboard — but only after the
// login gate. An unauthenticated deep link still lands on the sign-in screen,
// and a successful login then continues to the requested route.
if (location.hash.startsWith('#/')) {
  pendingDeepLink = true;
}
