// Devine Facilities Management — verified company facts.
// Sources: live site devinefacilities.co.za (checked 16 Nov 2026),
// directory listings (2pos, za.directmap.info), Facebook page.

export const SITE = {
  name: 'Devine Facilities Management',
  short: 'Devine Facilities',
  tagline: 'Landscapes, premises and peace of mind — kept.',
  established: '13', // years, per company website "About Us"
  city: 'Pretoria & greater Tshwane, Gauteng',
  postalAddress: 'P O Box 908043, Montana, 0182',
  email: 'marissa@devinefacilities.co.za', // primary public contact
  serviceAreaNote: 'Serving Pretoria and surrounding areas',
  website: 'https://www.devinefacilities.co.za/',
  facebook: 'https://www.facebook.com/devinegardenservices/',
};

export const PEOPLE = [
  {
    name: 'Marissa van der Walt',
    role: 'Contact',
    phoneDisplay: '+27 83 299 6599',
    phoneTel: '+27832996599',
    email: 'marissa@devinefacilities.co.za',
  },
  {
    name: 'Tjaart van der Walt',
    role: 'Contact',
    phoneDisplay: '+27 83 390 7898',
    phoneTel: '+27833907898',
    email: 'tjaart@devinefacilities.co.za',
  },
];

export const PRIMARY_CONTACT = PEOPLE[0];

// Public review signal — directory-aggregated rating (labelled as such
// wherever it appears; not independently re-verified).
export const REVIEWS = {
  rating: '5.0',
  count: '27',
  source: 'public directory listings',
};

// The one testimonial published on the company's own website.
export const TESTIMONIAL = {
  quote:
    'I, on behalf of the Trustees, would like to express our sincere gratitude to Devine Facilities for the trimming of the trees in the communal areas at iQ Whistling Thorn at no cost. Your kind gesture is highly appreciated.',
  author: 'Marie de Braak',
  context: 'Trustee, iQ Whistling Thorn estate',
};

export const SECTORS = [
  'Residential estates',
  'Sectional title complexes',
  'Commercial properties',
  'Property developers',
  'Managing agents',
];

export function mailto(subject, body, to = PRIMARY_CONTACT.email) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to}?${params.join('&')}`;
}
