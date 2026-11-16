// Insights-page data — demand matrix across service lines and sectors.
// Scores are qualitative positioning (0-100) used only for the chart
// planner; they are NOT measured business metrics.

export const INSIGHT_LABELS = [
  'Landscaping & Gardening',
  'Commercial & Estate Cleaning',
  'Landscape Installations',
  'Caretaker Services',
  'Residential estates',
  'Sectional title complexes',
  'Commercial properties',
  'Property developers',
  'Managing agents',
];

// Default chart spec rendered before/without AI — also the eval-gate
// fallback. Scores are editorial positioning scores, not claims.
export const DEFAULT_SPEC = {
  charts: [
    {
      type: 'vbar',
      title: 'Service line focus (positioning score)',
      items: [
        { label: 'Landscaping & Gardening', value: 90 },
        { label: 'Commercial & Estate Cleaning', value: 80 },
        { label: 'Landscape Installations', value: 75 },
        { label: 'Caretaker Services', value: 70 },
      ],
    },
    {
      type: 'hbar',
      title: 'Client types served',
      items: [
        { label: 'Residential estates', value: 95 },
        { label: 'Sectional title complexes', value: 90 },
        { label: 'Commercial properties', value: 70 },
        { label: 'Property developers', value: 65 },
        { label: 'Managing agents', value: 60 },
      ],
    },
    {
      type: 'donut',
      title: 'Recurring vs project work mix (illustrative)',
      items: [
        { label: 'Recurring care & cleaning', value: 70 },
        { label: 'Installations & projects', value: 30 },
      ],
    },
  ],
};

export const INSIGHT_ROWS = [
  {
    service: 'Landscaping & Gardening',
    sectors: 'Strongest fit: residential estates, sectional title, commercial campuses',
    note: 'Recurring weekly/fortnightly work — the bread-and-butter contract line.',
  },
  {
    service: 'Commercial & Estate Cleaning',
    sectors: 'Strongest fit: sectional title, estates, commercial shared areas',
    note: 'Pairs naturally with landscaping on the same sites.',
  },
  {
    service: 'Landscape Installations',
    sectors: 'Developers, new estates, commercial upgrades',
    note: 'Project-based — can include elevated/multi-storey work per published projects.',
  },
  {
    service: 'Caretaker Services',
    sectors: 'Estates and complexes needing on-site presence',
    note: 'Highest-touch line — supervision, contractor coordination, indoor greenery.',
  },
];

// Public signals — real, verifiable directory/company facts.
export const PUBLIC_SIGNALS = [
  { label: 'Years in operation', value: '13 (company-stated)' },
  { label: 'Directory rating', value: '5.0★ / 27 reviews' },
  { label: 'Service lines', value: '4 + indoor greenery' },
  { label: 'Client types', value: '5 sectors' },
  { label: 'Coverage', value: 'Pretoria & greater Tshwane' },
];

// For the AI briefing + chart planner.
export function insightSummary() {
  const svc = INSIGHT_ROWS.map((r) => `${r.service}: ${r.note}`).join('; ');
  const pub = PUBLIC_SIGNALS.map((p) => `${p.label}: ${p.value}`).join('; ');
  return `Service lines — ${svc}\nPublic signals — ${pub}`;
}
