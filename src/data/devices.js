// SYNTHETIC DATA — virtual device profile.
// Nothing here is read from, or written to, any real device.

export const device = {
  owner: 'MONIKA',
  handle: '@monika.demo',
  kind: 'VIRTUAL DEVICE',
  platform: 'ANDROID',
  status: 'ONLINE',
  deviceId: 'NX-84A91-DEMO',
  forensicId: 'NX-DEMO-84912',
  os: 'Android 15',
  osBuild: 'AD15.240817.001-DEMO',
  model: 'Nexus X1',
  manufacturer: 'NEXUS SYNTHETICS',
  serial: 'SN-DEMO-0000-84912',
  battery: 78,
  batteryHealth: 94,
  batteryTemp: 31.4,
  charging: false,
  network: 'SIMULATED',
  carrier: 'SIM-NET (VIRTUAL)',
  signal: 4,
  wifi: 'NX_LAB_5G (SIMULATED)',
  ip: '10.0.0.42 (VIRTUAL SUBNET)',
  encryption: 'ACTIVE',
  storageUsed: 64,
  storageTotal: 128,
  ram: { used: 5.4, total: 8 },
  cpu: 'Octa-core 2.8 GHz (virtual)',
  cpuLoad: 34,
  screen: '6.4" 2400×1080 120Hz',
  uptimeHours: 62,
  lastSync: 'JUST NOW',
  timezone: 'UTC+01:00',
  locale: 'en-GB',
  rooted: false,
};

export const health = [
  { label: 'BATTERY HEALTH', value: 94, unit: '%', color: '#3fb27f' },
  { label: 'STORAGE USED', value: 50, unit: '%', color: '#e8843a' },
  { label: 'MEMORY LOAD', value: 68, unit: '%', color: '#5b8def' },
  { label: 'CPU LOAD', value: 34, unit: '%', color: '#d8323f' },
  { label: 'THERMAL', value: 41, unit: '%', color: '#9b7de0' },
  { label: 'SIGNAL', value: 82, unit: '%', color: '#3fb27f' },
];

export const security = [
  { k: 'Simulation encryption', v: 'ACTIVE', state: 'ok' },
  { k: 'Screen lock', v: 'PATTERN (SYNTHETIC)', state: 'ok' },
  { k: 'Root / jailbreak', v: 'NOT DETECTED', state: 'ok' },
  { k: 'Unknown sources', v: 'DISABLED', state: 'ok' },
  { k: 'Play Protect', v: 'SIMULATED', state: 'warm' },
  { k: 'Last integrity scan', v: '14 MIN AGO', state: 'ok' },
];

export const eventLogger = {
  status: 'ACTIVE',
  installation: 'NX-DEMO-203729594',
  duration: 'SIMULATION',
  version: '1.0',
  simulatedEvents: 1284,
  captureNotice:
    'This module generates counters from the local mock-data layer. It does not read keystrokes, clipboard, form input, or any device signal.',
};
