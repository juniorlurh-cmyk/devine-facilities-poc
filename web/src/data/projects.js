// Case-study cards based on the real project types published on
// devinefacilities.co.za/our-projects. Photos are licensed stock —
// the company's own project photography replaces them once supplied.

const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PROJECTS = [
  {
    name: 'Elevated landscape installation',
    service: 'Landscape Installations',
    location: 'Upmarket residential estate, Pretoria',
    summary:
      'Supply and installation of plants, trees and custom planters for landscaped outdoor areas on the third and sixth floors — specialised crane lifting, careful planning and complete installation of elevated green space.',
    tags: ['Crane lifting', 'Multi-storey', 'Custom planters', 'Trees & plants'],
    image: img('photo-1416879595882-3373a0480b5b'),
    imageAlt: 'Elevated garden landscaping — representative photo',
  },
  {
    name: 'Corporate indoor plant installation',
    service: 'Indoor greenery',
    location: 'Modern corporate environment, Pretoria',
    summary:
      'Supply and installation of indoor plants and decorative planters — suspended orchid displays, vibrant bromeliads and contemporary planting arrangements selected to complement interior architecture.',
    tags: ['Suspended displays', 'Orchids', 'Bromeliads', 'Interior planting'],
    image: img('photo-1600607688969-a5bfcd646154'),
    imageAlt: 'Indoor plants in a modern interior — representative photo',
  },
  {
    name: 'Townhouse landscape installation',
    service: 'Landscape Installations',
    location: 'Residential development, Pretoria',
    summary:
      'A full outdoor-space transformation — soil preparation, plant selection, lawn installation, garden beds and finishing details, built to create an attractive, functional and sustainable landscape.',
    tags: ['Soil prep', 'Lawn installation', 'Garden beds', 'Finishing'],
    image: img('photo-1501004318641-b39e6451bec6'),
    imageAlt: 'Newly landscaped garden — representative photo',
  },
  {
    name: 'Estate & complex cleaning programme',
    service: 'Commercial & Estate Cleaning',
    location: 'Residential estates & sectional title, Pretoria',
    summary:
      'Structured cleaning schedules for communal areas, walkways, staircases and shared facilities — supervised teams keeping common spaces consistently clean and welcoming.',
    tags: ['Scheduled cleaning', 'Communal areas', 'Supervision', 'Shared facilities'],
    image: img('photo-1586023492125-27b2c045efd7'),
    imageAlt: 'Professional cleaning of shared spaces — representative photo',
  },
];
