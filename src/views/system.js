import { panel, viewHead } from '../lib/ui.js';
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
  ${viewHead('DEVICE STATUS', 'System',
    'Device health, session telemetry, and connected profile status.',
    `<span class="badge ok"><i class="dot"></i>ONLINE</span>`)}

  <div class="grid" style="grid-template-columns:1.15fr 1fr">
    ${panel('DEVICE TELEMETRY', `<div class="panel-pad">
      ${[
        ['device', `${device.deviceId}`],
        ['processor', '8-core · 2.8 GHz'],
        ['memory', '5.4 / 8 GB'],
        ['network', 'LTE · STABLE'],
        ['uptime', '62h'],
        ['battery', '84% · CHARGING'],
        ['storage', '186 / 256 GB'],
        ['temperature', '31°C · NORMAL'],
      ].map(([f, v]) => `<div class="kv">
        <span class="k">${f}</span>
        <span class="v" style="font-size:11.5px">${v}</span></div>`).join('')}
      <div style="margin-top:14px"><span class="badge ok"><i class="dot"></i>DEVICE HEALTH NORMAL</span></div>
    </div>`, { right: `<span class="label">LIVE STATUS</span>` })}

    ${panel('SESSION INTEGRITY', `<div class="panel-pad">
      ${[
        ['connection', 'SECURE'],
        ['encryption', 'ENABLED'],
        ['session', 'AUTHORIZED'],
        ['sync status', 'UP TO DATE'],
        ['last activity', 'JUST NOW'],
        ['background services', 'ACTIVE'],
      ].map(([k, v]) => `<div style="display:flex;justify-content:space-between;gap:14px;align-items:center;padding:13px 0;border-bottom:1px solid var(--line-soft)">
        <span class="k">${k}</span>
        <span class="v" style="font-size:12px;color:var(--ok)">${v}</span></div>`).join('')}
      <div style="margin-top:16px;padding:14px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.015)">
        <div style="font-size:12px;color:var(--text-2);line-height:1.7">Session integrity verified. All indexed modules are synchronized and available.</div>
      </div>
    </div>`, { right: `<span style="width:15px;color:var(--ok);display:inline-block">✓</span>` })}
  </div>

  <div class="grid" style="grid-template-columns:1fr 1fr;margin-top:14px">
    ${panel('PROFILE INDEX', `<div class="panel-pad">
      <div class="kv"><span class="k">Profile</span><span class="v">${device.owner}</span></div>
      <div class="kv"><span class="k">Device</span><span class="v">${device.deviceId}</span></div>
      <div class="kv"><span class="k">Messages indexed</span><span class="v">${totalMessages}</span></div>
      <div class="kv"><span class="k">Call records</span><span class="v">${callStats.total}</span></div>
      <div class="kv"><span class="k">Media assets</span><span class="v">${mediaStats.total}</span></div>
      <div class="kv"><span class="k">Locations indexed</span><span class="v">${locationStats.points}</span></div>
      <div class="kv"><span class="k">Applications</span><span class="v">${appStats.total}</span></div>
      <div class="kv"><span class="k">Activity records</span><span class="v">${TOTAL_EVENTS.toLocaleString()}</span></div>
    </div>`)}

    ${panel('SYSTEM CONTROLS', `<div class="panel-pad" style="display:flex;flex-direction:column;gap:12px">
      <button class="btn" id="btn-restart">RESTART SESSION</button>
      <button class="btn ghost" id="btn-home">RETURN TO LANDING</button>
      <div style="height:1px;background:var(--line);margin:4px 0"></div>
      <div class="label" style="margin-bottom:2px">SESSION</div>
      <div style="font-size:12px;color:var(--text-2);line-height:1.6">
        Session ID <span class="mono" style="color:var(--text)">${eventLogger.installation}</span><br>
        Engine <span class="mono" style="color:var(--text)">NEXUS 1.0</span>
      </div>
    </div>`)}
  </div>
  `;
}

let timer = null;

export function mount(root, ctx) {
  const elapsed = root.querySelector('#sess-elapsed');
  const start = root.querySelector('#sess-start');
  if (start) start.textContent = new Date(ctx.sessionStart).toTimeString().slice(0, 8);
  if (elapsed) {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!document.body.contains(elapsed)) { clearInterval(timer); return; }
      const s = Math.floor((Date.now() - ctx.sessionStart) / 1000);
      elapsed.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    }, 1000);
  }

  root.querySelector('#btn-restart').onclick = () => ctx.restart();
  root.querySelector('#btn-home').onclick = () => ctx.goHome();
}

export function unmount() { clearInterval(timer); }
