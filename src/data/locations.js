// SYNTHETIC DATA — fictional location trail.
// Coordinates are invented. Browser geolocation is never requested.

const PLACES = [
  ['NORTHGATE RESIDENCE', 'dwell'], ['MERIDIAN AVENUE', 'transit'], ['CENTRAL TRANSIT HUB', 'transit'],
  ['ORCHARD STREET', 'transit'], ['ATLAS CAMPUS — WEST', 'dwell'], ['CAMPUS COURTYARD', 'dwell'],
  ['LIBRARY ANNEX', 'dwell'], ['HARBOUR WALK', 'transit'], ['PIER 12 CAFÉ', 'dwell'],
  ['SOUTHBANK CROSSING', 'transit'], ['MARKET SQUARE', 'dwell'], ['LINDEN PARK', 'dwell'],
  ['RIVERSIDE PATH', 'transit'], ['GRAND STATION EAST', 'transit'], ['VERTEX GYM', 'dwell'],
  ['CEDAR LANE', 'transit'], ['NORTHGATE APPROACH', 'transit'], ['NORTHGATE RESIDENCE', 'dwell'],
];

// Hand-placed path points in a 1000×560 map space — reads like a real day's route.
const PATH = [
  [140, 430], [206, 400], [268, 352], [330, 330], [392, 300], [438, 268],
  [500, 250], [560, 236], [618, 258], [666, 300], [700, 348], [742, 392],
  [790, 410], [828, 372], [846, 318], [806, 272], [726, 236], [640, 214],
];

export const locations = PATH.map(([x, y], i) => {
  const [label, kind] = PLACES[i];
  const minsAgo = (PATH.length - 1 - i) * 47 + 2;
  return {
    id: `L${String(i + 1).padStart(2, '0')}`,
    idx: i + 1,
    label,
    kind,
    x, y,
    lat: +(12.3456 + (y - 300) * -0.00042).toFixed(4),
    lon: +(78.9012 + (x - 500) * 0.00051).toFixed(4),
    ts: Date.now() - minsAgo * 60000,
    accuracy: 'SIMULATED',
    dwellMin: kind === 'dwell' ? 18 + ((i * 13) % 52) : 0,
    speed: kind === 'dwell' ? 0 : 4 + ((i * 7) % 21),
  };
}).reverse();

export const currentPosition = locations[0];

export const movementEvents = [
  { id: 'mv1', label: 'DEPARTED NORTHGATE RESIDENCE', t: 806, mode: 'WALK' },
  { id: 'mv2', label: 'ENTERED TRANSIT CORRIDOR', t: 712, mode: 'TRANSIT' },
  { id: 'mv3', label: 'ARRIVED ATLAS CAMPUS — WEST', t: 618, mode: 'WALK' },
  { id: 'mv4', label: 'DEPARTED CAMPUS COURTYARD', t: 384, mode: 'WALK' },
  { id: 'mv5', label: 'ARRIVED MARKET SQUARE', t: 190, mode: 'TRANSIT' },
  { id: 'mv6', label: 'RETURN ROUTE ENGAGED', t: 49, mode: 'WALK' },
].map((m) => ({ ...m, ts: Date.now() - m.t * 60000 }));

export const locationStats = {
  points: locations.length,
  movements: movementEvents.length,
  distanceKm: 11.4,
  dwellSites: locations.filter((l) => l.kind === 'dwell').length,
  routeState: 'ACTIVE',
};
