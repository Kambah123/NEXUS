// Hand-rolled SVG chart primitives. No charting library.

function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

export function sparkline(values, { w = 92, h = 34, color = 'rgba(216,50,63,.8)', fill = true } = {}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - ((v - min) / span) * (h - 5) - 2.5,
  ]);
  const d = smoothPath(pts);
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  const id = 'sg' + Math.random().toString(36).slice(2, 8);
  return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity=".28"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    ${fill ? `<path d="${area}" fill="url(#${id})"/>` : ''}
    <path d="${d}" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`;
}

export function areaChart(series, labels, { w = 720, h = 220, colors = ['#d8323f', '#e8843a', '#5b8def', '#3fb27f', '#9b7de0'] } = {}) {
  const pad = { l: 34, r: 12, t: 14, b: 26 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const all = series.flatMap((s) => s.values);
  const max = Math.max(...all, 1) * 1.15;
  const gridY = 4;

  let out = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Synthetic activity chart">`;
  for (let i = 0; i <= gridY; i++) {
    const y = pad.t + (ih / gridY) * i;
    const v = Math.round(max - (max / gridY) * i);
    out += `<line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" stroke="rgba(255,255,255,.055)"/>`;
    out += `<text x="${pad.l - 8}" y="${y + 3.5}" text-anchor="end" font-family="ui-monospace,monospace" font-size="9" fill="#4a4a50">${v}</text>`;
  }
  labels.forEach((lb, i) => {
    if (labels.length > 12 && i % Math.ceil(labels.length / 8) !== 0) return;
    const x = pad.l + (i / (labels.length - 1 || 1)) * iw;
    out += `<text x="${x}" y="${h - 7}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="9" fill="#4a4a50">${lb}</text>`;
  });

  series.forEach((sr, si) => {
    const color = colors[si % colors.length];
    const pts = sr.values.map((v, i) => [
      pad.l + (i / (sr.values.length - 1 || 1)) * iw,
      pad.t + ih - (v / max) * ih,
    ]);
    const d = smoothPath(pts);
    const gid = 'ac' + si + Math.random().toString(36).slice(2, 6);
    out += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity=".22"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>`;
    out += `<path d="${d} L ${pad.l + iw} ${pad.t + ih} L ${pad.l} ${pad.t + ih} Z" fill="url(#${gid})"/>`;
    out += `<path class="line-draw" d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" style="animation-delay:${si * 90}ms"/>`;
    pts.forEach(([x, y], i) => {
      if (pts.length > 14 && i % 2) return;
      out += `<circle cx="${x}" cy="${y}" r="2.4" fill="#0b0b0b" stroke="${color}" stroke-width="1.3"/>`;
    });
  });
  return out + '</svg>';
}

export function barChart(values, labels, { w = 620, h = 170, color = '#d8323f', accent = '#e8843a' } = {}) {
  const pad = { l: 30, r: 10, t: 12, b: 24 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const max = Math.max(...values, 1) * 1.2;
  const bw = Math.max(6, (iw / values.length) * 0.56);
  let out = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Synthetic distribution chart">`;
  for (let i = 0; i <= 3; i++) {
    const y = pad.t + (ih / 3) * i;
    out += `<line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" stroke="rgba(255,255,255,.05)"/>`;
    out += `<text x="${pad.l - 7}" y="${y + 3.5}" text-anchor="end" font-family="ui-monospace,monospace" font-size="9" fill="#4a4a50">${Math.round(max - (max / 3) * i)}</text>`;
  }
  values.forEach((v, i) => {
    const x = pad.l + (i + 0.5) * (iw / values.length) - bw / 2;
    const bh = Math.max(2, (v / max) * ih);
    const y = pad.t + ih - bh;
    const peak = v === Math.max(...values);
    out += `<rect class="bar-grow" x="${x}" y="${y}" width="${bw}" height="${bh}" rx="2.5"
      fill="${peak ? accent : color}" opacity="${peak ? 0.95 : 0.6}" style="animation-delay:${i * 32}ms"/>`;
    if (labels[i] !== undefined) {
      out += `<text x="${x + bw / 2}" y="${h - 7}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8.5" fill="#4a4a50">${labels[i]}</text>`;
    }
  });
  return out + '</svg>';
}

export function ring(pct, { size = 178, stroke = 9, track = 'rgba(255,255,255,.07)' } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  const uid = Math.random().toString(36).slice(2, 8);
  const gid = `rg${uid}`;
  const fid = `rglow${uid}`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f0545f"/><stop offset="100%" stop-color="#e8843a"/>
      </linearGradient>
      <filter id="${fid}"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r - stroke - 4}" fill="none" stroke="rgba(255,255,255,.045)" stroke-width="1" stroke-dasharray="2 6"/>
    <circle class="ring-arc" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#${gid})"
      stroke-width="${stroke}" stroke-linecap="round" filter="url(#${fid})"
      stroke-dasharray="${c}" stroke-dashoffset="${c}"
      style="transition: stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1)" data-off="${off}"/>
  </svg>`;
}

export function donut(parts, { size = 132, stroke = 14 } = {}) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  let out = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="${stroke}"/>`;
  parts.forEach((p) => {
    const len = (p.value / total) * c;
    out += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${p.color}"
      stroke-width="${stroke}" stroke-dasharray="${len - 2} ${c - len + 2}" stroke-dashoffset="${-acc}" stroke-linecap="butt"/>`;
    acc += len;
  });
  return out + '</svg>';
}
