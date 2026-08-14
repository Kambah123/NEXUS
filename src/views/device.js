import { panel, statTile, viewHead, simNote } from '../lib/ui.js';
import { icons } from '../lib/icons.js';
import { ring, sparkline } from '../lib/charts.js';
import { device, health, security, eventLogger } from '../data/devices.js';

export const meta = { title: 'DEVICE' };

export function render() {
  const storagePct = Math.round((device.storageUsed / device.storageTotal) * 100);
  return `
  ${viewHead('VIRTUAL DEVICE FORENSICS', 'Device Forensics',
    'A complete specification sheet for a device that does not exist.',
    `<span class="badge sim">VIRTUAL HARDWARE</span>`)}

  <div class="grid g-4">
    ${statTile('Battery', device.battery, { delta: 'percent (simulated)' })}
    ${statTile('Storage used', device.storageUsed, { delta: `of ${device.storageTotal} GB simulated` })}
    ${statTile('Uptime', device.uptimeHours, { delta: 'hours (simulated)' })}
    ${statTile('CPU load', device.cpuLoad, { delta: 'percent (simulated)' })}
  </div>

  <div class="grid" style="grid-template-columns:1fr 1fr 1fr;margin-top:14px">
    ${panel('DEVICE', `<div class="panel-pad">
      <div class="kv"><span class="k">Class</span><span class="v">Virtual Android Device</span></div>
      <div class="kv"><span class="k">Model</span><span class="v">${device.model}</span></div>
      <div class="kv"><span class="k">Manufacturer</span><span class="v">${device.manufacturer}</span></div>
      <div class="kv"><span class="k">Serial</span><span class="v">${device.serial}</span></div>
      <div class="kv"><span class="k">Device ID</span><span class="v">${device.forensicId}</span></div>
      <div class="kv"><span class="k">Screen</span><span class="v">${device.screen}</span></div>
    </div>`)}

    ${panel('SYSTEM', `<div class="panel-pad">
      <div class="kv"><span class="k">OS</span><span class="v">${device.os} Demo</span></div>
      <div class="kv"><span class="k">Build</span><span class="v">${device.osBuild}</span></div>
      <div class="kv"><span class="k">CPU</span><span class="v" style="font-size:11px">${device.cpu}</span></div>
      <div class="kv"><span class="k">Memory</span><span class="v">${device.ram.used} / ${device.ram.total} GB</span></div>
      <div class="kv"><span class="k">Locale</span><span class="v">${device.locale}</span></div>
      <div class="kv"><span class="k">Timezone</span><span class="v">${device.timezone}</span></div>
    </div>`)}

    ${panel('NETWORK', `<div class="panel-pad">
      <div class="kv"><span class="k">Connection</span><span class="v">SIMULATED CONNECTION</span></div>
      <div class="kv"><span class="k">Carrier</span><span class="v">${device.carrier}</span></div>
      <div class="kv"><span class="k">Wi-Fi</span><span class="v" style="font-size:11px">${device.wifi}</span></div>
      <div class="kv"><span class="k">Address</span><span class="v" style="font-size:11px">${device.ip}</span></div>
      <div class="kv"><span class="k">Signal</span><span class="v">${device.signal} / 5 (SIM)</span></div>
      <div class="kv"><span class="k">Encryption</span><span class="v" style="color:#7fd6ae">SIMULATION ENCRYPTION</span></div>
    </div>`)}
  </div>

  <div class="grid" style="grid-template-columns:1.2fr 1fr;margin-top:14px">
    ${panel('DEVICE HEALTH', `<div class="panel-pad grid g-2" style="gap:18px">
      ${health.map((h) => `
        <div>
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <span class="label">${h.label}</span>
            <span class="mono" style="font-size:12px;color:${h.color}">${h.value}${h.unit}</span>
          </div>
          <div class="meter" style="margin-top:8px"><i data-w="${h.value}" style="background:${h.color};width:0"></i></div>
        </div>`).join('')}
      <div class="span-2" style="margin-top:4px">
        <div class="label">SIMULATED THERMAL TREND — 12H</div>
        <div style="margin-top:8px">${sparkline([28, 30, 29, 33, 31, 35, 32, 36, 34, 31, 30, 31], { w: 640, h: 60, color: '#e8843a' })}</div>
      </div>
    </div>`)}

    ${panel('STORAGE', `<div class="score-wrap">
      <div class="score-ring" style="width:150px;height:150px">
        ${ring(storagePct, { size: 150, stroke: 8 })}
        <div class="val"><div>
          <div class="num" style="font-size:30px" data-count="${storagePct}" data-suffix="%">0</div>
          <div class="label" style="margin-top:2px">OF ${device.storageTotal} GB</div>
        </div></div>
      </div>
      <div style="width:100%;margin-top:18px">
        <div class="kv"><span class="k">Used</span><span class="v">${device.storageUsed} GB SIMULATED</span></div>
        <div class="kv"><span class="k">Free</span><span class="v">${device.storageTotal - device.storageUsed} GB SIMULATED</span></div>
        <div class="kv"><span class="k">Media</span><span class="v">18.4 GB SIMULATED</span></div>
        <div class="kv"><span class="k">Applications</span><span class="v">26.1 GB SIMULATED</span></div>
      </div>
    </div>`)}
  </div>

  <div class="grid" style="grid-template-columns:1fr 1fr;margin-top:14px">
    ${panel('SECURITY POSTURE', `<div class="panel-pad">
      ${security.map((s) => `<div class="kv"><span class="k">${s.k}</span>
        <span class="v" style="color:${s.state === 'ok' ? '#7fd6ae' : '#f0ab72'}">${s.v}</span></div>`).join('')}
    </div>`, { right: `<span style="width:15px;color:var(--ok);display:inline-block">${icons.shield}</span>` })}

    ${panel('NEXUS EVENT LOGGER', `<div class="panel-pad">
      <div class="kv"><span class="k">Status</span><span class="v" style="display:flex;align-items:center;gap:7px;color:#7fd6ae"><i class="dot live"></i>${eventLogger.status}</span></div>
      <div class="kv"><span class="k">Installation</span><span class="v">${eventLogger.installation}</span></div>
      <div class="kv"><span class="k">Duration</span><span class="v">${eventLogger.duration}</span></div>
      <div class="kv"><span class="k">Version</span><span class="v">${eventLogger.version}</span></div>
      <div class="kv"><span class="k">Simulated events</span><span class="v" data-count="${eventLogger.simulatedEvents}">0</span></div>
      <div style="margin-top:14px;display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border:1px solid var(--accent-line);border-radius:var(--r);background:var(--accent-soft)">
        <span style="width:15px;color:#f0a0a6;flex:none;margin-top:1px">${icons.logger}</span>
        <p style="font-size:11.5px;color:#e9b9bd;line-height:1.6">${eventLogger.captureNotice}</p>
      </div>
    </div>`)}
  </div>

  <div style="margin-top:14px">${simNote('No hardware identifiers, IMEI, serial numbers, sensors, or system properties are read from the machine running this page.')}</div>
  `;
}

export function mount(root) {
  const arc = root.querySelector('.ring-arc');
  if (arc) requestAnimationFrame(() => { arc.style.strokeDashoffset = arc.dataset.off; });
  requestAnimationFrame(() => {
    root.querySelectorAll('.meter i').forEach((m) => { m.style.width = `${m.dataset.w}%`; });
  });
}
