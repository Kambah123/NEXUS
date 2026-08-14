#!/usr/bin/env node
/**
 * NEXUS single-file bundler.
 *
 * The canonical app is plain ES modules served straight from disk — no build
 * step is required to deploy it. This script additionally produces
 * dist/nexus.html: one self-contained file (inline CSS + inline JS) that runs
 * from a file:// path, a USB stick, or any static host.
 *
 * Usage: node build.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ENTRY = 'src/app.js';

const order = [];
const seen = new Set();

function resolve(from, spec) {
  return path.normalize(path.join(path.dirname(from), spec)).replace(/\\/g, '/');
}

function collect(rel) {
  if (seen.has(rel)) return;
  seen.add(rel);
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const deps = [...src.matchAll(/(?:from|import)\s*\(?\s*['"](\.[^'"]+)['"]\s*\)?/g)].map((m) => m[1]);
  for (const d of deps) collect(resolve(rel, d));
  order.push(rel);
}

collect(ENTRY);

function transform(rel) {
  let src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const exported = new Set();

  // import { a, b as c } from './x.js'
  src = src.replace(/import\s*\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"];?/g, (_, names, spec) => {
    const target = resolve(rel, spec);
    const binding = names.split(',').map((n) => n.trim()).filter(Boolean)
      .map((n) => (n.includes(' as ') ? n.replace(/\s+as\s+/, ': ') : n)).join(', ');
    return `const { ${binding} } = __req(${JSON.stringify(target)});`;
  });

  // import defaultName from './x.js'  (unused today, supported for safety)
  src = src.replace(/import\s+([\w$]+)\s+from\s*['"](\.[^'"]+)['"];?/g, (_, name, spec) =>
    `const ${name} = __req(${JSON.stringify(resolve(rel, spec))}).default;`);

  // dynamic import('./views/x.js')
  src = src.replace(/import\(\s*['"](\.[^'"]+)['"]\s*\)/g, (_, spec) =>
    `Promise.resolve(__req(${JSON.stringify(resolve(rel, spec))}))`);

  // export declarations
  src = src.replace(/export\s+(async\s+)?function\s+([\w$]+)/g, (_, a, n) => { exported.add(n); return `${a || ''}function ${n}`; });
  src = src.replace(/export\s+(const|let|var)\s+([\w$]+)/g, (_, k, n) => { exported.add(n); return `${k} ${n}`; });
  src = src.replace(/export\s+class\s+([\w$]+)/g, (_, n) => { exported.add(n); return `class ${n}`; });

  // export { a, b }
  src = src.replace(/export\s*\{([^}]+)\};?/g, (_, names) => {
    names.split(',').map((n) => n.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((n) => exported.add(n));
    return '';
  });

  if (/\bexport\s/.test(src)) {
    throw new Error(`Unhandled export syntax in ${rel}`);
  }

  return `__def(${JSON.stringify(rel)}, function (__req) {\n${src}\nreturn { ${[...exported].join(', ')} };\n});`;
}

const runtime = `
(function () {
  var __factories = {}, __cache = {};
  function __def(id, fn) { __factories[id] = fn; }
  function __req(id) {
    if (__cache[id]) return __cache[id];
    var f = __factories[id];
    if (!f) throw new Error('Module not bundled: ' + id);
    var exports = f(__req);
    __cache[id] = exports;
    return exports;
  }
`;

const modules = order.map(transform).join('\n\n');
const bootstrap = `\n  __req(${JSON.stringify(ENTRY)});\n})();\n`;

const css = fs.readFileSync(path.join(ROOT, 'src/styles/main.css'), 'utf8');
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Function replacements: a string replacement would interpret `$$`/`$&` in the
// source (the DOM helpers are literally named `$` and `$$`).
html = html
  .replace('<link rel="stylesheet" href="./src/styles/main.css">', () => `<style>\n${css}\n</style>`)
  .replace('<script type="module" src="./src/app.js"></script>',
    () => `<script>\n${runtime}\n${modules}\n${bootstrap}</script>`);

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'dist/nexus.html'), html);

const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log(`✓ dist/nexus.html — ${order.length} modules, ${kb} KB single file`);
