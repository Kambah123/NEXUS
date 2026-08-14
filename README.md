# NEXUS

**DEVICE INTELLIGENCE // SIMULATION**

A cinematic, fully fictional "device intelligence" dashboard — built as a harmless prank you can show your friends.

---

## ⚠️ Read this first

**NEXUS is a simulation. It has zero surveillance capability.**

It cannot — and does not — read messages, place or intercept calls, track a location, open a camera or microphone, list installed apps, capture keystrokes, harvest files, or contact any device, account, or server.

There is no backend. There are no network requests. No permission is ever requested. Every message, call, photo, coordinate, contact, application and event you see is invented data generated locally in your browser from the deterministic mock-data engine in [`src/data/`](src/data).

Use it on friends who'll enjoy the joke, and press **REVEAL SIMULATION** before anyone is genuinely worried. Never present it to anyone as evidence that their device was accessed.

---

## What's inside

Ten interactive modules, all rendering synthetic data:

| Module | What it shows |
|---|---|
| **Overview** | Target identity card, animated counters, live event feed, intelligence score ring |
| **Messages** | Fictional threads with search, filters, unread counts and delivery states |
| **Calls** | Invented call log with direction split, duration stats and a 24h volume chart |
| **Media Vault** | 49 procedurally drawn vector "photos", videos and screenshots + cinematic modal |
| **Location** | A hand-drawn fictional city, animated movement trail and waypoint history |
| **Applications** | 46 fictional apps with versions, usage bars and simulated state |
| **Contacts** | An animated relationship graph of six people who do not exist |
| **Activity** | Multi-series charts across 1H / 6H / 12H / 24H / 7D + simulated browsing |
| **Device** | Full forensic spec sheet, health meters, and the (fake) event logger |
| **System** | Dataset status, integrity guarantees, and the reveal control |

Plus a cinematic landing page, a staged initialization sequence, a `Ctrl`/`Cmd` + `K` command palette, toasts, skeleton loading, a mobile bottom-nav layout, and the **YOU'VE BEEN NEXUS'D** payoff screen.

---

## Running it

No build step, no dependencies, no install. It's plain ES modules — but browsers block module imports over `file://`, so serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server works (`npx serve`, `php -S`, VS Code Live Server, …).

### Scripts

```bash
npm test     # smoke suite: data layer, determinism, all 10 view renders, safety audit
npm run build # optional: bundle everything into dist/nexus.html (one self-contained file)
```

`npm run build` produces a single ~170 KB HTML file with inline CSS and JS that runs from anywhere — handy for a USB stick or an offline laptop. The multi-file version is the canonical app; the bundle is a convenience.

---

## Deploying to Vercel

The app is static, so there is nothing to configure:

1. Push this repo to your GitHub account (already done if you're reading it there).
2. In Vercel, **Add New → Project** and import the repo.
3. Framework preset: **Other**. Leave build command empty, output directory `.`.
4. Deploy.

`vercel.json` is included with cache headers. You can also drag the folder onto [vercel.com/new](https://vercel.com/new), or deploy from the CLI:

```bash
npx vercel --prod
```

Deep links work: `your-app.vercel.app/#/messages` opens straight into that module.

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Ctrl` / `Cmd` + `K` | Command palette |
| `1` – `9`, `0` | Jump between modules |
| `Esc` | Close palette or modal |

These are navigation only. Nothing about your input is recorded, stored, or transmitted — see the audit below.

---

## Project structure

```
index.html            Landing page, init sequence, overlays, reveal screen
build.js              Optional single-file bundler (no dependencies)
test/smoke.mjs        Smoke suite + responsible-simulation audit
src/
  app.js              Shell, hash router, command palette, toasts, reveal
  data/               The mock-data engine — every dataset lives here
    devices.js  messages.js  calls.js   media.js     locations.js
    apps.js     contacts.js  activity.js  browser.js
  lib/                rng, formatting, DOM helpers, SVG charts, icons, UI fragments
  views/              One module per screen
  styles/main.css     Design system and responsive layout
```

Data is generated from a fixed seed (`mulberry32`), so the prank reads identically every run — the same 24 messages, 8 calls, 49 assets, 18 waypoints, 1,284 events, 87% score.

---

## The safety audit

`npm test` fails the build if any of these appear in the source:

- `navigator.geolocation`
- `getUserMedia` / `mediaDevices`
- `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`
- `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`
- clipboard access
- keypress/keyup capture
- permission requests
- any external asset URL

That's the guarantee, enforced mechanically rather than promised in prose.

---

## Design

Near-black `#070707` canvas, graphite surfaces, hairline borders, restrained crimson reserved for state and emphasis, warm orange as secondary. System sans for UI, monospace for IDs, timestamps and coordinates. Everything visual — logo, icons, map, charts, media thumbnails — is hand-authored SVG or CSS, so there are no image requests and nothing to load.

---

## Licence

MIT. It's a joke app; enjoy it responsibly.
