// SYNTHETIC DATA — fictional call log. 8 calls: 3 in, 4 out, 1 missed.

const raw = [
  { id: 'k1', contact: 'c2', type: 'out', t: 22, sec: 214, net: 'SIM-VOICE' },
  { id: 'k2', contact: 'c1', type: 'in', t: 96, sec: 512, net: 'SIM-VOICE' },
  { id: 'k3', contact: 'c4', type: 'missed', t: 168, sec: 0, net: 'SIM-CELL' },
  { id: 'k4', contact: 'c1', type: 'out', t: 245, sec: 88, net: 'SIM-VOICE' },
  { id: 'k5', contact: 'c3', type: 'in', t: 402, sec: 143, net: 'SIM-CELL' },
  { id: 'k6', contact: 'c2', type: 'out', t: 611, sec: 1042, net: 'SIM-VOICE' },
  { id: 'k7', contact: 'c5', type: 'in', t: 880, sec: 76, net: 'SIM-CELL' },
  { id: 'k8', contact: 'c6', type: 'out', t: 1290, sec: 39, net: 'SIM-VOICE' },
];

export const calls = raw
  .map((c) => ({ ...c, ts: Date.now() - c.t * 60000 }))
  .sort((a, b) => b.ts - a.ts);

export const callStats = {
  total: calls.length,
  incoming: calls.filter((c) => c.type === 'in').length,
  outgoing: calls.filter((c) => c.type === 'out').length,
  missed: calls.filter((c) => c.type === 'missed').length,
  totalSeconds: calls.reduce((n, c) => n + c.sec, 0),
  longest: calls.reduce((a, c) => (c.sec > a.sec ? c : a), calls[0]),
};

// Synthetic call volume across a 24-hour window (2-hour buckets).
export const callVolume = [0, 0, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0];
export const callVolumeLabels = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];
