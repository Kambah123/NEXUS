// SYNTHETIC DATA — fictional conversations.
// Written by hand so the dialogue reads naturally; 24 messages total,
// matching the MESSAGES counter on the overview.

// t = minutes before page load. dir: 'in' = from contact, 'out' = from device owner.
const raw = [
  {
    id: 'm1', contact: 'c1', unread: 2, channel: 'SIM-CHAT',
    msgs: [
      { t: 214, dir: 'in', text: 'did you get the slides for tomorrow?', state: 'read' },
      { t: 209, dir: 'out', text: 'yeah just finished them. section 3 is still rough tho', state: 'delivered' },
      { t: 207, dir: 'in', text: 'send it over, i can clean it up tonight', state: 'read' },
      { t: 61, dir: 'out', text: 'sent. ignore the placeholder chart on slide 9', state: 'delivered' },
      { t: 14, dir: 'in', text: 'looks good. one typo on the last slide', state: 'unread' },
      { t: 6, dir: 'in', text: 'also are we still meeting at 7?', state: 'unread' },
    ],
  },
  {
    id: 'm2', contact: 'c2', unread: 1, channel: 'SIM-CHAT',
    msgs: [
      { t: 470, dir: 'in', text: 'morning! coffee before standup?', state: 'read' },
      { t: 466, dir: 'out', text: 'can\'t today, running late again 😅', state: 'delivered' },
      { t: 465, dir: 'in', text: 'classic', state: 'read' },
      { t: 132, dir: 'out', text: 'tomorrow for sure. usual place?', state: 'delivered' },
      { t: 43, dir: 'in', text: 'usual place. 8:15, don\'t be late this time', state: 'unread' },
    ],
  },
  {
    id: 'm3', contact: 'c3', unread: 0, channel: 'SIM-SMS',
    msgs: [
      { t: 890, dir: 'out', text: 'session moved to 6:30, gym is packed at 5', state: 'delivered' },
      { t: 884, dir: 'in', text: 'works for me', state: 'read' },
      { t: 320, dir: 'in', text: 'bring the resistance bands if you still have them', state: 'read' },
      { t: 318, dir: 'out', text: 'got them in the car 👍', state: 'read' },
    ],
  },
  {
    id: 'm4', contact: 'c4', unread: 0, channel: 'SIM-SMS',
    msgs: [
      { t: 1340, dir: 'in', text: 'a parcel came for you, left it with the porter', state: 'read' },
      { t: 1336, dir: 'out', text: 'thank you! i\'ll grab it this evening', state: 'read' },
      { t: 700, dir: 'in', text: 'no rush', state: 'read' },
      { t: 240, dir: 'out', text: 'got it, thanks again', state: 'read' },
    ],
  },
  {
    id: 'm5', contact: 'c5', unread: 0, channel: 'SIM-CHAT',
    msgs: [
      { t: 2600, dir: 'in', text: 'been ages! are you around next month?', state: 'read' },
      { t: 2580, dir: 'out', text: 'should be! send me dates and i\'ll book something', state: 'delivered' },
      { t: 1500, dir: 'in', text: 'perfect, will do 🙌', state: 'read' },
    ],
  },
  {
    id: 'm6', contact: 'c6', unread: 0, channel: 'SIM-MAIL',
    msgs: [
      { t: 4100, dir: 'in', text: 'Reminder: your enrolment window closes on Friday.', state: 'read' },
      { t: 4080, dir: 'out', text: 'Confirmed, submitted this morning.', state: 'read' },
    ],
  },
];

export const conversations = raw.map((c) => {
  const msgs = c.msgs
    .map((m) => ({ ...m, ts: Date.now() - m.t * 60000 }))
    .sort((a, b) => a.ts - b.ts);
  const last = msgs[msgs.length - 1];
  return { ...c, msgs, last, lastTs: last.ts, preview: last.text };
}).sort((a, b) => b.lastTs - a.lastTs);

export const totalMessages = conversations.reduce((n, c) => n + c.msgs.length, 0);
export const totalUnread = conversations.reduce((n, c) => n + c.unread, 0);
