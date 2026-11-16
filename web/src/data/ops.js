// Illustrative demo data for the /portal client-reporting dashboard.
// Everything here is SAMPLE data — the portal banner says so. When the
// Apps Script backend is configured, live ops data replaces this.

const img = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const DEMO_SITE = {
  id: 'demo-iq-whistling-thorn',
  client: 'Demo — Residential Estate',
  property: 'iQ Whistling Thorn (illustrative)',
  serviceScope: 'Landscaping & garden maintenance + communal-area cleaning',
  supervisor: 'Site supervisor (demo)',
};

// Recurring task schedule for the demo site.
export const DEMO_TASKS = [
  { id: 't1', task: 'Lawn mowing — north & south lawns', freq: 'Weekly', lastDone: '2026-11-10', nextDue: '2026-11-17', status: 'scheduled' },
  { id: 't2', task: 'Hedge trimming — perimeter & pool area', freq: 'Fortnightly', lastDone: '2026-11-03', nextDue: '2026-11-17', status: 'scheduled' },
  { id: 't3', task: 'Weeding — all garden beds', freq: 'Weekly', lastDone: '2026-11-12', nextDue: '2026-11-19', status: 'scheduled' },
  { id: 't4', task: 'Communal area cleaning — lobby & walkways', freq: 'Twice weekly', lastDone: '2026-11-14', nextDue: '2026-11-17', status: 'scheduled' },
  { id: 't5', task: 'Irrigation system check', freq: 'Monthly', lastDone: '2026-10-28', nextDue: '2026-11-28', status: 'scheduled' },
  { id: 't6', task: 'Tree pruning — jacaranda avenue', freq: 'Quarterly', lastDone: '2026-09-15', nextDue: '2026-12-15', status: 'scheduled' },
];

// Recent completed-work log entries (evidence trail).
export const DEMO_WORKLOGS = [
  {
    date: '2026-11-14',
    task: 'Communal area cleaning — lobby & walkways',
    by: 'Cleaning crew (demo)',
    notes: 'Full lobby, glass doors and main walkway detail-cleaned. Refuse area washed down.',
    photo: img('photo-1586023492125-27b2c045efd7'),
    photoAlt: 'Completed cleaning — representative photo',
  },
  {
    date: '2026-11-12',
    task: 'Weeding — all garden beds',
    by: 'Garden crew (demo)',
    notes: 'All beds weeded and edges re-cut. Two bed sections reported for mulch top-up.',
    photo: img('photo-1465146344425-f00d5f5c8f07'),
    photoAlt: 'Completed weeding — representative photo',
  },
  {
    date: '2026-11-10',
    task: 'Lawn mowing — north & south lawns',
    by: 'Garden crew (demo)',
    notes: 'Both lawns mowed and edges trimmed. Light fertiliser applied per schedule.',
    photo: img('photo-1523348837708-15d4a09cfac2'),
    photoAlt: 'Completed lawn mowing — representative photo',
  },
];

// Open issues register.
export const DEMO_ISSUES = [
  {
    id: 'i1',
    raised: '2026-11-08',
    title: 'Irrigation leak — south lawn zone 3',
    detail: 'Reduced pressure on south lawn heads; likely joint leak near bed edge.',
    priority: 'high',
    status: 'in-progress',
    due: '2026-11-20',
    owner: 'Maintenance contractor (demo)',
  },
  {
    id: 'i2',
    raised: '2026-11-11',
    title: 'Pool-area hedge overgrowth',
    detail: 'Hedge blocking pool sightlines; needs trim before holiday season.',
    priority: 'medium',
    status: 'open',
    due: '2026-11-24',
    owner: 'Garden crew (demo)',
  },
  {
    id: 'i3',
    raised: '2026-10-30',
    title: 'Entrance signage light out',
    detail: 'Reported to caretaker; awaiting electrician quotation.',
    priority: 'low',
    status: 'open',
    due: '2026-11-30',
    owner: 'Caretaker (demo)',
  },
];

// Sample monthly report summary (what a client would receive).
export const DEMO_MONTHLY = {
  period: 'November 2026',
  site: 'iQ Whistling Thorn (illustrative)',
  stats: [
    { label: 'Scheduled tasks completed', value: '94%', note: '31 of 33 planned visits' },
    { label: 'Issues resolved', value: '5', note: '2 still open, 1 in progress' },
    { label: 'Avg. response time', value: '1.2 days', note: 'issue acknowledgement' },
    { label: 'Photo-documented visits', value: '100%', note: 'every logged visit has evidence' },
  ],
  highlights: [
    'All lawn areas mowed and edged on schedule through the month.',
    'Communal cleaning completed twice weekly with photo evidence.',
    'One irrigation fault identified early and repair scheduled — prevented turf loss.',
  ],
};
