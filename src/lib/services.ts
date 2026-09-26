/** The three service divisions, shared by the Home, About and Services pages. */
export interface Division {
  id: 'civil' | 'interior' | 'mep';
  number: string;
  title: string;
  /** Home "What we deliver" list */
  summary: string;
  tags: string[];
  image: string;
  /** About "Complete Solutions Under One Roof" cards */
  pill: string;
  tagline: string;
  description: string;
  highlights: string[];
  cta: string;
  /** Project categories this division covers, for the /projects filter link */
  projectCategory: string;
}

export const divisions: Division[] = [
  {
    id: 'civil',
    number: '01',
    title: 'Civil Construction',
    summary: 'Building strong foundations through precise execution, reliable workmanship, and coordinated project management.',
    tags: ['Structural works', 'Construction', 'Site execution'],
    image: '/images/service-civil.jpg',
    pill: 'Div 01 / Civil',
    tagline: 'Reliable construction solutions for diverse projects.',
    description:
      'Full-spectrum civil contracting spanning reinforced substructures, commercial podiums, industrial slabs, and structural alterations in compliance with Ashghal and municipal guidelines.',
    highlights: ['Foundation & Superstructure Works', 'Structural Steel & Core Alterations', 'Commercial & Residential Turn-Key Delivery'],
    cta: 'Explore Civil Division',
    projectCategory: 'civil',
  },
  {
    id: 'interior',
    number: '02',
    title: 'Interior & Fit-Out',
    summary: 'Creating refined, functional environments through thoughtful planning and high-quality fit-out execution.',
    tags: ['Fit-out', 'Finishing', 'Interior execution'],
    image: '/images/service-interior.jpg',
    pill: 'Div 02 / Interior',
    tagline: 'Refined spaces delivered with craftsmanship.',
    description:
      'Complete interior fit-out for offices, retail, hospitality and villas: partitions, ceilings, joinery, finishes and furnishing delivered by our in-house teams and workshop.',
    highlights: ['Shell & Core Fit-Out', 'Bespoke Joinery & Millwork', 'Premium Finishes & Cladding'],
    cta: 'Explore Fit-Out Division',
    projectCategory: 'interior',
  },
  {
    id: 'mep',
    number: '03',
    title: 'MEP Works',
    summary: 'Complete mechanical, electrical and plumbing solutions integrated seamlessly into every project.',
    tags: ['Mechanical', 'Electrical', 'Plumbing', 'Commissioning'],
    image: '/images/service-mep.jpg',
    pill: 'Div 03 / MEP',
    tagline: 'Integrated systems, tested and commissioned.',
    description:
      'In-house mechanical, electrical, ELV and plumbing installation, testing and commissioning, coordinated with civil and fit-out works and approved by Kahramaa and Civil Defense.',
    highlights: ['HVAC & Mechanical Systems', 'Electrical & Low-Current Works', 'Plumbing, Drainage & Fire Systems'],
    cta: 'Explore MEP Division',
    projectCategory: 'mechanical',
  },
];
