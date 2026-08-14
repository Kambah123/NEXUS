// SYNTHETIC DATA — fictional in-simulation browsing activity.
// No real browser history is read. These are invented domains.

export const browserActivity = [
  { id: 'b1', title: 'Simulated lecture archive', host: 'archive.sim-campus.demo', t: 18, secs: 640, cat: 'Education' },
  { id: 'b2', title: 'Transit timetable — north line', host: 'transit.simnet.demo', t: 54, secs: 96, cat: 'Travel' },
  { id: 'b3', title: 'Weekly demo digest', host: 'digest.nexus.demo', t: 121, secs: 302, cat: 'News' },
  { id: 'b4', title: 'Synthetic dataset viewer', host: 'lab.nexus.demo', t: 194, secs: 1180, cat: 'Tools' },
  { id: 'b5', title: 'Recipe: demo pasta', host: 'kitchen.sim.demo', t: 268, secs: 210, cat: 'Lifestyle' },
  { id: 'b6', title: 'Fictional weather board', host: 'weather.simnet.demo', t: 331, secs: 74, cat: 'Utilities' },
  { id: 'b7', title: 'Course enrolment portal', host: 'portal.sim-campus.demo', t: 470, secs: 412, cat: 'Education' },
  { id: 'b8', title: 'Sample marketplace listing', host: 'market.sim.demo', t: 622, secs: 158, cat: 'Shopping' },
].map((b) => ({ ...b, ts: Date.now() - b.t * 60000 }));

export const browserStats = {
  sessions: 14,
  domains: 8,
  activeMinutes: 51,
  topCategory: 'Education',
};
