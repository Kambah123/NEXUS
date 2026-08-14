import { panel, statTile, viewHead, simNote } from '../lib/ui.js';
import { icons } from '../lib/icons.js';
import { ago, hhmm, dayLabel, dur, bytes } from '../lib/format.js';
import { media, mediaStats } from '../data/media.js';

export const meta = { title: 'MEDIA' };

let tab = 'all';

export function render() {
  return `
  ${viewHead('SECURE SYNTHETIC VAULT', 'Media Vault',
    `${mediaStats.total} generated items · ${bytes(mediaStats.sizeMb)} simulated`,
    `<span class="badge sim">GENERATED</span>`)}

  <div class="grid g-4">
    ${statTile('All items', mediaStats.total)}
    ${statTile('Photos', mediaStats.photos)}
    ${statTile('Videos', mediaStats.videos)}
    ${statTile('Screenshots', mediaStats.screenshots)}
  </div>

  <div style="margin-top:14px">
    ${panel('VAULT', `<div class="panel-pad"><div class="media-grid" id="mgrid">${tiles()}</div></div>`, {
      right: [['all', 'ALL'], ['photo', 'PHOTOS'], ['video', 'VIDEOS'], ['screenshot', 'SCREENSHOTS']]
        .map(([k, l]) => `<button class="chip ${tab === k ? 'on' : ''}" data-tab="${k}">${l}</button>`).join(' '),
    })}
  </div>

  <div style="margin-top:14px">${simNote('Every thumbnail is drawn procedurally as vector art at runtime. NEXUS never opens a camera, microphone, gallery, or file system.')}</div>
  `;
}

function tiles() {
  const list = media.filter((m) => tab === 'all' || m.kind === tab);
  if (!list.length) return `<div class="empty"><div class="glyph">⌀</div><div class="mono">EMPTY</div></div>`;
  return list.map((m, i) => `
    <button class="media-tile" data-media="${m.id}" style="animation:viewIn .4s cubic-bezier(.16,1,.3,1) ${Math.min(i * 18, 420)}ms backwards">
      ${m.thumb}
      <span class="mtype">${m.kind.toUpperCase()}</span>
      ${m.kind === 'video' ? `<span class="play-badge"><div>${icons.play}</div></span>` : ''}
      <span class="mo">
        <span class="mname">${m.name}</span>
        <span class="mname" style="opacity:.65">${m.kind === 'video' ? dur(m.seconds) : bytes(m.sizeMb)}</span>
      </span>
    </button>`).join('');
}

function modalBody(m) {
  return `
    <div class="modal-head">
      <div>
        <div class="eyebrow">MEDIA SIMULATION</div>
        <div class="mono" style="font-size:13px;margin-top:3px">${m.name}.${m.ext}</div>
      </div>
      <button class="icon-btn" data-close>${icons.close}</button>
    </div>
    <div class="modal-body">
      <div class="modal-stage">
        <div style="width:min(520px,100%);aspect-ratio:1;border-radius:12px;overflow:hidden;border:1px solid var(--line)">${m.thumb}</div>
      </div>
      <div class="modal-side">
        <div class="kv"><span class="k">File</span><span class="v">${m.name}</span></div>
        <div class="kv"><span class="k">Type</span><span class="v">${m.kind.toUpperCase()}</span></div>
        <div class="kv"><span class="k">Created</span><span class="v">${dayLabel(m.ts)} ${hhmm(m.ts)}</span></div>
        <div class="kv"><span class="k">Source</span><span class="v">VIRTUAL DEVICE</span></div>
        <div class="kv"><span class="k">Album</span><span class="v">${m.album}</span></div>
        <div class="kv"><span class="k">Dimensions</span><span class="v">${m.dims}</span></div>
        <div class="kv"><span class="k">Size</span><span class="v">${bytes(m.sizeMb)}</span></div>
        ${m.seconds ? `<div class="kv"><span class="k">Duration</span><span class="v">${dur(m.seconds)}</span></div>` : ''}
        <div class="kv"><span class="k">Captured</span><span class="v">${ago(m.ts)}</span></div>
        <div class="kv"><span class="k">Checksum</span><span class="v" style="font-size:10px">${m.hash}</span></div>
        <div style="margin-top:14px">
          <span class="badge sim">SYNTHETIC ASSET</span>
        </div>
        <p style="font-size:11.5px;color:var(--muted);line-height:1.6;margin-top:12px">
          Rendered from vector primitives inside the simulation. There is no underlying photo or video file.
        </p>
      </div>
    </div>`;
}

export function mount(root, ctx) {
  const grid = root.querySelector('#mgrid');

  function wire() {
    grid.querySelectorAll('[data-media]').forEach((b) => {
      b.onclick = () => {
        const m = media.find((x) => x.id === b.dataset.media);
        ctx.openModal(modalBody(m));
      };
    });
  }
  wire();

  root.querySelectorAll('[data-tab]').forEach((b) => {
    b.onclick = () => {
      tab = b.dataset.tab;
      root.querySelectorAll('[data-tab]').forEach((x) => x.classList.toggle('on', x === b));
      grid.innerHTML = tiles();
      wire();
    };
  });

  ctx.toast(`${mediaStats.total} synthetic assets indexed`);
}
