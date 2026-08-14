/**
 * Smoke test — runs in plain Node with no DOM.
 *
 * Every view's render() is a pure string builder, so this exercises the whole
 * data layer, chart primitives and templates without a browser. It also
 * audits the source tree for forbidden capability APIs.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const ok = (name, cond, extra = '') => {
  if (cond) console.log(`  ✓ ${name}${extra ? ` — ${extra}` : ''}`);
  else { console.log(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`); failures++; }
};

console.log('\nDATA LAYER');
const { device } = await import('../src/data/devices.js');
const { conversations, totalMessages, totalUnread } = await import('../src/data/messages.js');
const { calls, callStats } = await import('../src/data/calls.js');
const { media, mediaStats } = await import('../src/data/media.js');
const { locations, locationStats } = await import('../src/data/locations.js');
const { apps, appStats } = await import('../src/data/apps.js');
const { contacts } = await import('../src/data/contacts.js');
const { TOTAL_EVENTS, seriesFor, timeline, seedEvents } = await import('../src/data/activity.js');
const { browserActivity } = await import('../src/data/browser.js');

ok('device profile is virtual', device.kind === 'VIRTUAL DEVICE' && device.network === 'SIMULATED');
ok('messages total = 24', totalMessages === 24, `${totalMessages}`);
ok('unread counted', totalUnread === 3, `${totalUnread}`);
ok('calls total = 8', callStats.total === 8, `${calls.length}`);
ok('call split 3 in / 4 out / 1 missed',
  callStats.incoming === 3 && callStats.outgoing === 4 && callStats.missed === 1,
  `${callStats.incoming}/${callStats.outgoing}/${callStats.missed}`);
ok('media total = 49', mediaStats.total === 49, `${media.length}`);
ok('media tabs populated', mediaStats.photos === 28 && mediaStats.videos === 9 && mediaStats.screenshots === 12);
ok('locations = 18', locationStats.points === 18, `${locations.length}`);
ok('movement events = 6', locationStats.movements === 6);
ok('apps = 46', appStats.total === 46, `${apps.length}`);
ok('contacts = 6', contacts.length === 6);
ok('activity events = 1284', TOTAL_EVENTS === 1284);
ok('browser rows present', browserActivity.length === 8);

console.log('\nDETERMINISM');
const a = seriesFor('24H').series.map((s) => s.values.join()).join('|');
const b = seriesFor('24H').series.map((s) => s.values.join()).join('|');
ok('series are stable across calls', a === b);
ok('timeline builds', timeline(22).length === 22);
ok('seed events build', seedEvents(9).length === 9);
for (const r of ['1H', '6H', '12H', '24H', '7D']) {
  const s = seriesFor(r);
  ok(`range ${r}`, s.series.length === 5 && s.labels.length === s.series[0].values.length);
}

console.log('\nVIEW RENDER');
const ctx = { toast() {}, openModal() {}, closeModal() {}, reveal() {}, restart() {}, goHome() {}, navigate() {}, nextEvent: () => ({}), sessionStart: Date.now() };
const views = ['overview', 'messages', 'calls', 'media', 'location', 'apps', 'contacts', 'activity', 'device', 'system'];
for (const v of views) {
  try {
    const mod = await import(`../src/views/${v}.js`);
    const html = mod.render(ctx);
    const bad = /undefined|NaN|\[object Object\]/.test(html);
    ok(`${v}.render()`, typeof html === 'string' && html.length > 500 && !bad,
      `${(html.length / 1024).toFixed(1)} KB${bad ? ' — CONTAINS undefined/NaN' : ''}`);
  } catch (e) {
    ok(`${v}.render()`, false, e.message);
  }
}

console.log('\nRESPONSIBLE SIMULATION AUDIT');
const FORBIDDEN = [
  ['geolocation', /navigator\s*\.\s*geolocation/],
  ['getUserMedia / camera / mic', /getUserMedia|mediaDevices/],
  ['network calls', /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/],
  ['storage', /localStorage|sessionStorage|indexedDB|document\.cookie/],
  ['clipboard', /navigator\s*\.\s*clipboard|['"]paste['"]|['"]copy['"]/],
  ['keypress capture', /['"]keypress['"]|['"]keyup['"]|['"]input['"]\s*,\s*\(?e\)?\s*=>\s*[^)]*send/],
  ['permissions', /navigator\s*\.\s*permissions|requestPermission/],
  ['external asset', /https?:\/\/(?!hyperagent)[^"'\s]+\.(js|css|png|jpg|woff2?)/],
];
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]);
}
const files = [...walk(join(ROOT, 'src')), join(ROOT, 'index.html')];
// Strip comments so prose about what NEXUS does NOT do can't trip the audit.
const stripped = new Map(files.map((f) => [f,
  readFileSync(f, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/<!--[\s\S]*?-->/g, ''),
]));
for (const [name, re] of FORBIDDEN) {
  const hits = files.filter((f) => re.test(stripped.get(f)));
  ok(`no ${name}`, hits.length === 0, hits.map((h) => h.replace(ROOT, '')).join(', '));
}

console.log(`\n${failures === 0 ? '✓ ALL CHECKS PASSED' : `✗ ${failures} FAILURE(S)`}\n`);
process.exit(failures ? 1 : 0);
