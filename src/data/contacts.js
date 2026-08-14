// SYNTHETIC DATA — fictional contact network. No real people.

export const contacts = [
  {
    id: 'c1', name: 'ALEX', full: 'Alex Renner', hue: 4, tier: 'inner',
    relation: 'FREQUENT', role: 'Study group', number: '+00 700 111 0142',
    since: 'Mar 2023', strength: 92, interactions: 412, angle: -90,
    note: 'Highest synthetic interaction volume in the dataset.',
  },
  {
    id: 'c2', name: 'SARAH', full: 'Sarah Kováč', hue: 28, tier: 'inner',
    relation: 'FREQUENT', role: 'Colleague', number: '+00 700 111 0287',
    since: 'Jan 2022', strength: 84, interactions: 355, angle: -18,
    note: 'Simulated evening messaging pattern.',
  },
  {
    id: 'c3', name: 'MICHAEL', full: 'Michael Ardo', hue: 210, tier: 'mid',
    relation: 'REGULAR', role: 'Gym', number: '+00 700 111 0333',
    since: 'Sep 2023', strength: 61, interactions: 188, angle: 54,
    note: 'Weekend-weighted synthetic activity.',
  },
  {
    id: 'c4', name: 'DANIEL', full: 'Daniel Vos', hue: 150, tier: 'mid',
    relation: 'REGULAR', role: 'Neighbour', number: '+00 700 111 0410',
    since: 'Jun 2024', strength: 48, interactions: 96, angle: 126,
    note: 'Short-form synthetic message threads only.',
  },
  {
    id: 'c5', name: 'JAMES', full: 'James Okoro', hue: 268, tier: 'outer',
    relation: 'OCCASIONAL', role: 'Old friend', number: '+00 700 111 0559',
    since: 'Nov 2021', strength: 33, interactions: 54, angle: 198,
    note: 'Sparse simulated contact cadence.',
  },
  {
    id: 'c6', name: 'LENA', full: 'Lena Fischer', hue: 330, tier: 'outer',
    relation: 'OCCASIONAL', role: 'Course admin', number: '+00 700 111 0678',
    since: 'Feb 2025', strength: 26, interactions: 31, angle: 252,
    note: 'Administrative synthetic notifications.',
  },
];

export const byId = Object.fromEntries(contacts.map((c) => [c.id, c]));
