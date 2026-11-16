// Devine's four service lines — all confirmed on the company's own website.
// Image URLs verified HTTP 200; all are representative/illustrative
// licensed stock pending the company's own project photography.

const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const SERVICES = [
  {
    id: 'landscaping-gardening',
    path: '/services/landscaping-gardening',
    name: 'Landscaping & Gardening',
    tag: 'Ongoing care',
    icon: 'leaf',
    image: img('photo-1558904541-efa843a96f01'),
    imageAlt: 'Gardener maintaining a garden — representative photo',
    summary:
      'Ongoing garden and landscape maintenance for estates, complexes and commercial properties — lawn care, pruning, weeding and plant care on structured schedules.',
    card: 'Recurring garden and landscape upkeep — mowing, pruning, weeding and plant care on a schedule that keeps outdoor spaces healthy and neat.',
    points: [
      'Lawn mowing and edging on a recurring schedule',
      'Pruning, trimming and hedge shaping',
      'Weeding, bed maintenance and plant care',
      'Seasonal clean-ups and garden health checks',
      'Structured schedules with supervised teams',
    ],
    detail:
      'Devine maintains established landscapes across Pretoria estates and complexes — the unglamorous weekly work that keeps a property looking cared for all year. Teams work to a schedule agreed per site, with supervision and clear communication to the managing agent or trustee board.',
  },
  {
    id: 'commercial-estate-cleaning',
    path: '/services/commercial-estate-cleaning',
    name: 'Commercial & Estate Cleaning',
    tag: 'Recurring service',
    icon: 'sparkles',
    image: img('photo-1559526324-4b87b5e36e44'),
    imageAlt: 'Cleaning of a commercial interior — representative photo',
    summary:
      'Professional cleaning for residential estates, sectional title complexes and commercial properties — communal areas, walkways, staircases and shared facilities.',
    card: 'Reliable ongoing cleaning for estates, complexes and commercial sites — communal areas, walkways and shared facilities kept consistently clean.',
    points: [
      'Communal areas, walkways and staircases',
      'Entrance and lobby cleaning',
      'Shared facilities and refuse-area upkeep',
      'Scheduled service days agreed per site',
      'Supervised teams with attention to detail',
    ],
    detail:
      'A clean common area is the first thing residents and visitors notice. Devine provides structured, recurring cleaning for the shared spaces of estates and complexes — scheduled, supervised and tailored to what each site actually needs.',
  },
  {
    id: 'landscape-installations',
    path: '/services/landscape-installations',
    name: 'Landscape Installations',
    tag: 'Project work',
    icon: 'building',
    image: img('photo-1585320806297-9794b3e4eeae'),
    imageAlt: 'Landscape installation work — representative photo',
    summary:
      'New landscape design and installation for estates, complexes, commercial properties and developments — from soil prep and planting to lawns and finishing.',
    card: 'New gardens and outdoor spaces built from scratch — soil preparation, planting, lawns and finishing for estates, complexes and developments.',
    points: [
      'Soil preparation and ground improvement',
      'Plant and tree selection and planting',
      'Lawn installation and turf laying',
      'Garden beds, edging and hardscaping basics',
      'Final finishing and handover care plan',
    ],
    detail:
      'From a bare stand to a garden people use — installations cover the full build: soil prep, planting, lawns and finishing. Projects range from townhouse gardens to large-scale elevated landscapes on multi-storey developments.',
  },
  {
    id: 'caretaker',
    path: '/services/caretaker',
    name: 'Caretaker Services',
    tag: 'On-site presence',
    icon: 'shield',
    image: img('photo-1523217582562-09d0def993a6'),
    imageAlt: 'Managed property exterior — representative photo',
    summary:
      'Dedicated caretakers for residential estates and complexes — full-time or scheduled days, site supervision, contractor coordination and common-area monitoring.',
    card: 'On-site caretakers — full-time or scheduled — supervising common areas, coordinating contractors and keeping an eye on the property.',
    points: [
      'Full-time or scheduled service days',
      'Common-area supervision and monitoring',
      'Coordination of contractors and trades',
      'Obtaining quotations for required work',
      'Indoor greenery and plant solutions',
    ],
    detail:
      'Some sites need a person, not just a service. Devine caretakers can be assigned full-time or on scheduled days — supervising common areas, coordinating contractors, obtaining quotes for work needed and keeping the property watched over.',
  },
];

export const CLIENT_TYPES = [
  'Residential estates',
  'Sectional title complexes',
  'Commercial properties',
  'Property developers',
  'Managing agents',
];
