// Minimal DOM helpers. No framework, no dependencies.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

export function frag(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content;
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Animated numeric counter with easing.
export function countUp(node, target, { duration = 1100, decimals = 0, pad = 0, suffix = '' } = {}) {
  const start = performance.now();
  const from = 0;
  function step(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = from + (target - from) * eased;
    let out = decimals ? val.toFixed(decimals) : String(Math.round(val));
    if (pad) out = out.padStart(pad, '0');
    node.textContent = out + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function onVisible(node, cb, once = true) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { cb(e.target); if (once) io.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  io.observe(node);
  return io;
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
