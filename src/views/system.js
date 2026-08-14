import { panel, viewHead, simNote } from '../lib/ui.js';
import { icons } from '../lib/icons.js';
import { device, eventLogger } from '../data/devices.js';
import { totalMessages } from '../data/messages.js';
import { callStats } from '../data/calls.js';
import { mediaStats } from '../data/media.js';
import { appStats } from '../data/apps.js';
import { locationStats } from '../data/locations.js';
import { TOTAL_EVENTS } from '../data/activity.js';

export const meta = { title: 'SYSTEM' };

export function render() {
  return `
  ${viewHead('SIMULATION CONTROL', 'System',
    'Dataset status, integrity guarantees, and simulation controls.',
    `<span class="badge sim">SIMULATION</span>`)}

  <div class="grid" style="grid-template-columns:1.15fr 1fr">
    ${panel('MOCK DATA LAYER', `<div class="panel-pad">
      ${[
        ['devices', '1 virtual profile'],
        ['messages', `${totalMessages} synthetic messages`],
        ['calls', `${callStats.total} synthetic calls`],
        ['media', `${mediaStats.total} generated assets`],
        ['locations', `${locationStats.points} fictional waypoints`],
        ['apps', `${appStats.total} fictional applications`],
        ['contacts', '6 fictional people'],
        ['activity', `${TOTAL_EVENTS.toLocaleString()} simulated events`],
        ['browser', '8 invented domains'],
      ].map(([f, v]) => `<div class="kv">
        <span class="k" style="display:flex;gap:8px;align-items:center">
          <span style="width:13px;color:var(--faint)">${icons.file}</span>${f}</span>
        <span class="v" style="font-size:11.5px">${v}</span></div>`).join('')}
      <div style="margin-top:14px"><span class="badge ok"><i class="dot"></i>ALL DATASETS LOADED — SEEDED &amp; DETERMINISTIC</span></div>
    </div>`, { right: `<span class="label">SRC / DATA</span>` })}

    ${panel('INTEGRITY GUARANTEES', `<div class="panel-pad">
      ${[
        'No network requests leave this page',
        'No geolocation permission requested',
        'No camera or microphone access',
        'No keyboard, clipboard or input capture',
        'No cookies, storage or tracking',
        'No real device or account is contacted',
      ].map((t) => `<div style="display:flex;gap:11px;align-items:center;padding:9px 0;border-bottom:1px solid var(--line-soft)">
        <span style="width:14px;color:var(--ok);flex:none">${icons.check}</span>
        <span style="font-size:12.5px;color:var(--text-2)">${t}</span></div>`).join('')}
    </div>`, { right: `<span style="width:15px;color:var(--ok);display:inline-block">${icons.shield}</span>` })}
  </div>

  <div class="grid" style="grid-template-columns:1fr 1fr;margin-top:14px">
    ${panel('SESSION', `<div class="panel-pad">
      <div class="kv"><span class="k">Simulation ID</span><span class="v">${eventLogger.installation}</span></div>
      <div class="kv"><span class="k">Target profile</span><span class="v">${device.owner} · ${device.deviceId}</span></div>
      <div class="kv"><span class="k">Engine version</span><span class="v">NEXUS 1.0</span></div>
      <div class="kv"><span class="k">Data mode</span><span class="v">DETERMINISTIC SEED</span></div>
      <div class="kv"><span class="k">Started</span><span class="v" id="sess-start">—</span></div>
      <div class="kv"><span class="k">Elapsed</span><span class="v" id="sess-elapsed">00:00</span></div>
    </div>`)}

    ${panel('SIMULATION CONTROLS', `<div class="panel-pad" style="display:flex;flex-direction:column;gap:12px">
      <button class="btn" id="btn-restart">${icons.bolt} REGENERATE SESSION</button>
      <button class="btn ghost" id="btn-home">RETURN TO LANDING</button>
      <div style="height:1px;background:var(--line);margin:4px 0"></div>
      <div>
        <div class="label" style="margin-bottom:8px">END THE PRANK</div>
        <button class="btn primary" id="btn-reveal" style="width:100%">${icons.eye} REVEAL SIMULATION</button>
        <p style="font-size:11.5px;color:var(--muted);line-height:1.6;margin-top:10px">
          Shows your friend the payoff screen and explains that nothing was ever accessed. Use it before they get genuinely worried.
        </p>
      </div>
    </div>`)}
  </div>

  <div style="margin-top:14px">
    ${simNote('NEXUS is an entertainment product. It contains no surveillance capability of any kind, and it must not be presented to anyone as evidence that their device was accessed. Reveal the prank promptly.')}
  </div>
  `;
}

let timer = null;

export function mount(root, ctx) {
  root.querySelector('#sess-start').textContent = new Date(ctx.sessionStart).toTimeString().slice(0, 8);
  const elapsed = root.querySelector('#sess-elapsed');
  clearInterval(timer);
  timer = setInterval(() => {
    if (!document.body.contains(elapsed)) { clearInterval(timer); return; }
    const s = Math.floor((Date.now() - ctx.sessionStart) / 1000);
    elapsed.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }, 1000);

  root.querySelector('#btn-reveal').onclick = () => ctx.reveal();
  root.querySelector('#btn-restart').onclick = () => ctx.restart();
  root.querySelector('#btn-home').onclick = () => ctx.goHome();
}

export function unmount() { clearInterval(timer); }
