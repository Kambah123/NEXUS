import { panel, statTile, identityCard, viewHead, avatar } from '../lib/ui.js';
import { ring, sparkline, donut } from '../lib/charts.js';
import { icons } from '../lib/icons.js';
import { ago, hhmmss, hhmm, dur } from '../lib/format.js';
import { device } from '../data/devices.js';
import { conversations, totalMessages, totalUnread } from '../data/messages.js';
import { calls, callStats } from '../data/calls.js';
import { mediaStats } from '../data/media.js';
import { appStats } from '../data/apps.js';
import { locationStats, currentPosition } from '../data/locations.js';
import { activityStats, seedEvents } from '../data/activity.js';
import { byId } from '../data/contacts.js';

export const meta = { title: 'OVERVIEW' };

const SCORE = 87;

export function render() {
  const recentMsgs = conversations.slice(0, 4);
  const recentCalls = calls.slice(0, 4);

  return `
  ${viewHead('NEXUS // INTELLIGENCE CENTER', 'Overview', 'Live telemetry and intelligence signals for the active device profile.',
    `<span class="badge sim"><i class="dot red live"></i> SESSION ACTIVE</span>`)}

  ${identityCard()}

  <div class="grid g-6" style="margin-top:14px">
    ${statTile('Messages', totalMessages, { spark: [3, 5, 2, 7, 4, 8, 6, 9], delta: `${totalUnread} unread` })}
    ${statTile('Calls', callStats.total, { pad: 2, spark: [1, 0, 2, 1, 3, 1, 2, 2], delta: `${callStats.missed} missed` })}
    ${statTile('Media', mediaStats.total, { spark: [4, 6, 5, 9, 7, 11, 8, 12], delta: `${mediaStats.videos} videos` })}
    ${statTile('Applications', appStats.total, { spark: [8, 9, 7, 10, 12, 11, 13, 12], delta: `${appStats.foreground} foreground` })}
    ${statTile('Locations', locationStats.points, { spark: [2, 3, 2, 4, 3, 5, 4, 6], delta: `${locationStats.distanceKm} km trail` })}
    ${statTile('Activity events', activityStats.total, { spark: [40, 52, 47, 63, 58, 71, 66, 78], delta: `${activityStats.perHour}/hr avg` })}
  </div>

  <div class="grid" style="grid-template-columns: 1.55fr 1fr; margin-top:14px" id="ov-split">
    ${panel('LIVE ACTIVITY', `<div class="feed scroll" id="feed"></div>`, {
      right: `<span class="badge ok"><i class="dot live"></i> STREAMING</span>`,
    })}

    ${panel('DEVICE INTELLIGENCE', `
      <div class="score-wrap">
        <div class="score-ring">
          ${ring(SCORE)}
          <div class="val"><div>
            <div class="num" data-count="${SCORE}" data-suffix="%">0</div>
            <div class="label" style="margin-top:2px">CONFIDENCE INDEX</div>
          </div></div>
        </div>
        <div class="score-legend">
          <div><span class="label">System</span><div class="v" style="color:#7fd6ae">STABLE</div></div>
          <div><span class="label">Dataset</span><div class="v">COMPLETE</div></div>
          <div><span class="label">Session</span><div class="v" style="color:#f0a0a6">ACTIVE</div></div>
        </div>
      </div>`)}
  </div>

  <div class="grid g-3" style="margin-top:14px">
    ${panel('RECENT MESSAGES', recentMsgs.map((c) => {
      const p = byId[c.contact];
      return `<button class="conv" data-goto="messages">
        ${avatar(p.name, { size: 'sm', hue: p.hue })}
        <div class="cbody">
          <div class="crow"><span class="cname">${p.name}</span><span class="ctime mono">${hhmm(c.lastTs)}</span></div>
          <div class="cprev">${c.preview}</div>
        </div>
        ${c.unread ? `<span class="unread mono">${c.unread}</span>` : ''}
      </button>`;
    }).join(''), { right: `<button class="chip" data-goto="messages">OPEN</button>` })}

    ${panel('RECENT CALLS', recentCalls.map((c) => {
      const p = byId[c.contact];
      const cls = c.type === 'in' ? 'in' : c.type === 'out' ? 'out' : 'missed';
      const ic = c.type === 'in' ? icons.arrowIn : c.type === 'out' ? icons.arrowOut : icons.missed;
      return `<div class="conv" style="cursor:default">
        <span class="call-icon ${cls}" style="width:30px;height:30px">${ic}</span>
        <div class="cbody">
          <div class="crow"><span class="cname">${p.name}</span><span class="ctime mono">${hhmm(c.ts)}</span></div>
          <div class="cprev mono" style="font-size:10.5px">${c.type.toUpperCase()} · ${c.sec ? dur(c.sec) : 'NO ANSWER'} · ${c.net}</div>
        </div>
      </div>`;
    }).join(''), { right: `<button class="chip" data-goto="calls">OPEN</button>` })}

    ${panel('EVENT DISTRIBUTION', `
      <div style="display:flex;gap:18px;align-items:center;padding:16px 18px;flex-wrap:wrap">
        <div style="flex:none">${donut(activityStats.byCategory)}</div>
        <div style="flex:1;min-width:130px">
          ${activityStats.byCategory.map((c) => `
            <div class="kv"><span class="k" style="display:flex;align-items:center;gap:7px">
              <i style="width:7px;height:7px;border-radius:2px;background:${c.color};display:inline-block"></i>${c.label}</span>
              <span class="v">${c.value}</span></div>`).join('')}
        </div>
      </div>`, { right: `<button class="chip" data-goto="activity">OPEN</button>` })}
  </div>

  <div class="grid g-3" style="margin-top:14px">
    ${panel('LAST KNOWN POSITION', `
      <div class="panel-pad">
        <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start">
          <div>
            <div class="label">Coordinates</div>
            <div class="mono" style="font-size:19px;margin-top:6px">${currentPosition.lat.toFixed(4)}°</div>
            <div class="mono" style="font-size:19px">${currentPosition.lon.toFixed(4)}°</div>
          </div>
          <span class="badge warm">TRACKED</span>
        </div>
        <div class="kv" style="margin-top:14px"><span class="k">Site</span><span class="v">${currentPosition.label}</span></div>
        <div class="kv"><span class="k">Accuracy</span><span class="v">${currentPosition.accuracy}</span></div>
        <div class="kv"><span class="k">Updated</span><span class="v">${ago(currentPosition.ts)}</span></div>
      </div>`, { right: `<button class="chip" data-goto="location">MAP</button>` })}

    ${panel('DEVICE STATE', `
      <div class="panel-pad">
        <div class="kv"><span class="k">Battery</span><span class="v">${device.battery}% · ${device.charging ? 'CHARGING' : 'DISCHARGING'}</span></div>
        <div class="kv"><span class="k">Storage</span><span class="v">${device.storageUsed} / ${device.storageTotal} GB</span></div>
        <div class="kv"><span class="k">Memory</span><span class="v">${device.ram.used} / ${device.ram.total} GB</span></div>
        <div class="kv"><span class="k">Network</span><span class="v">${device.network}</span></div>
        <div class="kv"><span class="k">Uptime</span><span class="v">${device.uptimeHours}h</span></div>
        <div style="margin-top:12px">${sparkline([30, 44, 38, 52, 47, 61, 55, 68, 62, 74], { w: 240, h: 42, color: '#5b8def' })}</div>
      </div>`, { right: `<button class="chip" data-goto="device">FORENSICS</button>` })}

    ${panel('SESSION INTEGRITY', `
      <div class="panel-pad" style="display:flex;flex-direction:column;gap:11px">
        ${[
          ['Telemetry index', 'LOADED'],
          ['External requests', 'NONE'],
          ['Device permissions', 'NONE REQUESTED'],
          ['Input capture', 'DISABLED'],
        ].map(([k, v]) => `<div class="kv"><span class="k">${k}</span><span class="v" style="color:#7fd6ae">${v}</span></div>`).join('')}
      </div>`)}
  </div>
  `;
}

let feedTimer = null;

export function mount(root, ctx) {
  const arc = root.querySelector('.ring-arc');
  if (arc) requestAnimationFrame(() => { arc.style.strokeDashoffset = arc.dataset.off; });

  const feed = root.querySelector('#feed');
  if (feed) {
    const seed = seedEvents(9);
    seed.forEach((e) => feed.append(feedNode(e)));
    clearInterval(feedTimer);
    feedTimer = setInterval(() => {
      if (!document.body.contains(feed)) { clearInterval(feedTimer); return; }
      const e = ctx.nextEvent();
      feed.prepend(feedNode(e));
      while (feed.children.length > 40) feed.lastChild.remove();
    }, 4200);
  }
}

export function unmount() {
  clearInterval(feedTimer);
}

function feedNode(e) {
  const d = document.createElement('div');
  d.className = 'feed-item';
  d.innerHTML = `<i class="fdot dot" style="background:${e.color}"></i>
    <div style="flex:1;min-width:0">
      <div class="ftime">${hhmmss(e.ts)}</div>
      <div class="ftxt">${e.text}</div>
    </div>
    <span class="mono" style="font-size:9.5px;color:var(--faint)">${e.ref}</span>`;
  return d;
}
