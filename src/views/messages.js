import { viewHead, avatar, simNote } from '../lib/ui.js';
import { icons } from '../lib/icons.js';
import { hhmm, dayLabel, ago } from '../lib/format.js';
import { conversations, totalMessages, totalUnread } from '../data/messages.js';
import { byId } from '../data/contacts.js';

export const meta = { title: 'MESSAGES' };

let state = { active: conversations[0].id, q: '', filter: 'all', viewing: false };

export function render() {
  return `
  ${viewHead('SYNTHETIC COMMUNICATIONS', 'Messages',
    `${totalMessages} simulated messages across ${conversations.length} fictional threads.`,
    `<span class="badge">${totalUnread} UNREAD</span><span class="badge sim">SYNTHETIC</span>`)}

  <div class="msg-layout ${state.viewing ? 'viewing' : ''}" id="msgl">
    <section class="panel conv-list">
      <div class="conv-search">
        <input class="input" id="msgq" placeholder="Search synthetic threads…" value="${state.q}" autocomplete="off">
      </div>
      <div class="filters">
        ${[['all', 'ALL'], ['unread', 'UNREAD'], ['chat', 'SIM-CHAT'], ['sms', 'SIM-SMS'], ['mail', 'SIM-MAIL']]
          .map(([k, l]) => `<button class="chip ${state.filter === k ? 'on' : ''}" data-filter="${k}">${l}</button>`).join('')}
      </div>
      <div class="convs scroll" id="convs">${convList()}</div>
    </section>

    <section class="panel thread-view" id="thread">${thread()}</section>
  </div>

  <div style="margin-top:14px">${simNote('These conversations are fictional text written for the simulation. NEXUS cannot read SMS, chat apps, or any real messaging service.')}</div>
  `;
}

function filtered() {
  const q = state.q.trim().toLowerCase();
  return conversations.filter((c) => {
    const p = byId[c.contact];
    if (state.filter === 'unread' && !c.unread) return false;
    if (state.filter === 'chat' && c.channel !== 'SIM-CHAT') return false;
    if (state.filter === 'sms' && c.channel !== 'SIM-SMS') return false;
    if (state.filter === 'mail' && c.channel !== 'SIM-MAIL') return false;
    if (!q) return true;
    return p.name.toLowerCase().includes(q)
      || p.full.toLowerCase().includes(q)
      || c.msgs.some((m) => m.text.toLowerCase().includes(q));
  });
}

function convList() {
  const list = filtered();
  if (!list.length) {
    return `<div class="empty"><div class="glyph">⌀</div><div class="mono" style="font-size:11px;letter-spacing:.14em">NO MATCHING THREADS</div></div>`;
  }
  return list.map((c) => {
    const p = byId[c.contact];
    return `<button class="conv ${state.active === c.id ? 'on' : ''}" data-conv="${c.id}">
      ${avatar(p.name, { size: 'sm', hue: p.hue })}
      <div class="cbody">
        <div class="crow"><span class="cname">${p.name}</span><span class="ctime">${hhmm(c.lastTs)}</span></div>
        <div class="cprev">${c.preview}</div>
        <div class="label" style="margin-top:4px">${c.channel} · ${c.msgs.length} MSG</div>
      </div>
      ${c.unread ? `<span class="unread mono">${c.unread}</span>` : ''}
    </button>`;
  }).join('');
}

function thread() {
  const c = conversations.find((x) => x.id === state.active) || conversations[0];
  const p = byId[c.contact];
  let lastDay = '';
  const bubbles = c.msgs.map((m) => {
    const day = dayLabel(m.ts);
    let sep = '';
    if (day !== lastDay) {
      lastDay = day;
      sep = `<div style="text-align:center;margin:8px 0"><span class="label">${day}</span></div>`;
    }
    return `${sep}<div class="bubble-row ${m.dir === 'out' ? 'out' : ''}">
      <div class="bubble">${m.text}</div>
      <div class="bubble-meta">
        <span>${hhmm(m.ts)}</span>
        <span>${m.dir === 'out' ? (m.state === 'read' ? 'READ' : 'DELIVERED') : m.state === 'unread' ? 'NEW' : 'RECEIVED'}</span>
      </div>
    </div>`;
  }).join('');

  return `
    <div class="thread-head">
      <button class="icon-btn" id="backconv" style="display:none">${icons.close}</button>
      ${avatar(p.name, { size: 'sm', hue: p.hue })}
      <div style="flex:1;min-width:0">
        <div style="font-size:13.5px;font-weight:540">${p.full}</div>
        <div class="label" style="margin-top:2px">${c.channel} · ${p.number} · LAST ${ago(c.lastTs)}</div>
      </div>
      <span class="badge sim">SYNTHETIC</span>
    </div>
    <div class="bubbles scroll" id="bubbles">${bubbles}</div>
    <div class="thread-foot">
      <div class="readonly">READ-ONLY SIMULATION — COMPOSER DISABLED</div>
      <span class="badge">${c.msgs.length} MSG</span>
    </div>`;
}

export function mount(root, ctx) {
  const layout = root.querySelector('#msgl');
  const q = root.querySelector('#msgq');
  const convs = root.querySelector('#convs');
  const isMobile = () => window.matchMedia('(max-width: 960px)').matches;

  const refreshList = () => { convs.innerHTML = convList(); wireConvs(); };
  const refreshThread = () => {
    const t = root.querySelector('#thread');
    t.innerHTML = thread();
    const b = t.querySelector('#bubbles');
    if (b) b.scrollTop = b.scrollHeight;
    const back = t.querySelector('#backconv');
    if (back && isMobile()) {
      back.style.display = 'inline-flex';
      back.onclick = () => { state.viewing = false; layout.classList.remove('viewing'); };
    }
  };

  function wireConvs() {
    convs.querySelectorAll('[data-conv]').forEach((b) => {
      b.onclick = () => {
        state.active = b.dataset.conv;
        state.viewing = true;
        convs.querySelectorAll('.conv').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
        if (isMobile()) layout.classList.add('viewing');
        refreshThread();
      };
    });
  }

  q.addEventListener('input', () => { state.q = q.value; refreshList(); });
  root.querySelectorAll('[data-filter]').forEach((b) => {
    b.onclick = () => {
      state.filter = b.dataset.filter;
      root.querySelectorAll('[data-filter]').forEach((x) => x.classList.toggle('on', x === b));
      refreshList();
    };
  });

  wireConvs();
  refreshThread();
  ctx.toast('Synthetic message dataset loaded');
}
