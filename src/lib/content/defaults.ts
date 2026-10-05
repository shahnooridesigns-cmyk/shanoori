/**
 * The site's built-in copy. Every value here can be overridden from Sanity Studio:
 * the Studio forms (sanity/schemaTypes/pages.ts) are generated from these objects and
 * open pre-filled with them, and the site falls back to them for anything left empty
 * (see resolve.ts). So adding a key here adds it to both Studio and the site's content.
 *
 * Conventions the generator relies on:
 * - keys named `image`, `image1`, … are photos (local path here, an upload in Studio)
 * - keys named `icon` are a dropdown of icon names
 * - "\n" in a string is a line break in a heading; a blank line starts a new paragraph
 */

export const WHY_ICONS = ['blocks', 'wrench', 'award', 'infinity'] as const;
export const SERVICE_ICONS = [
  'terrain', 'batch', 'building', 'shield', 'grid', 'roller', 'compass', 'cone', 'store', 'layout', 'stripes', 'pen',
] as const;

export const sharedDefaults = {
  faq: {
    heading: 'Built on\nthe Details.',
    text: "Every project is a balance of structure, systems, materials and execution. Here's how we bring the details together.",
    items: [
      {
        q: 'What comes together in a Shah Noori project?',
        a: 'Civil construction, interior & fit-out, and MEP works are coordinated as one integrated project scope.',
      },
      {
        q: 'Where does a project begin?',
        a: 'With a conversation about your brief, site and budget. We then visit the site, review drawings and prepare a clear scope and estimate before any work starts.',
      },
      {
        q: 'How do the disciplines work together?',
        a: 'Our civil, fit-out and MEP teams plan together from day one, so structure, services and finishes are coordinated before execution, avoiding clashes, rework and delays.',
      },
      {
        q: 'What happens before handover?',
        a: 'Every system is tested and commissioned, snag items are closed out, and authority approvals are completed so you receive a safe, functional, ready-to-use space.',
      },
    ],
  },
  cta: {
    heading: 'Ready to Elevate\nYour Space',
    text: "Let's create something memorable together",
    buttonLabel: 'Start a Project',
    image: '/images/cta.webp',
  },
  clients: {
    heading: 'Trusted by Businesses & Brands',
  },
  interior: {
    title: 'Interior & Fit-Out',
    summary: 'Creating refined, functional environments through thoughtful planning and high-quality fit-out execution.',
    tags: ['Fit-out', 'Finishing', 'Interior execution'],
    image: '/images/service-interior.webp',
    pill: 'Div 01 / Interior',
    tagline: 'Refined spaces delivered with craftsmanship.',
    description:
      'Complete interior fit-out for offices, retail, hospitality and villas: partitions, ceilings, joinery, finishes and furnishing delivered by our in-house teams and workshop.',
    highlights: ['Shell & Core Fit-Out', 'Bespoke Joinery & Millwork', 'Premium Finishes & Cladding'],
    cta: 'Explore Fit-Out Division',
  },
  mep: {
    title: 'MEP Works',
    summary: 'Complete mechanical, electrical and plumbing solutions integrated seamlessly into every project.',
    tags: ['Mechanical', 'Electrical', 'Plumbing', 'Commissioning'],
    image: '/images/service-mep.webp',
    pill: 'Div 02 / MEP',
    tagline: 'Integrated systems, tested and commissioned.',
    description:
      'In-house mechanical, electrical, ELV and plumbing installation, testing and commissioning, coordinated with civil and fit-out works and approved by Kahramaa and Civil Defense.',
    highlights: ['HVAC & Mechanical Systems', 'Electrical & Low-Current Works', 'Plumbing, Drainage & Fire Systems'],
    cta: 'Explore MEP Division',
  },
  civil: {
    title: 'Civil Construction',
    summary: 'Building strong foundations through precise execution, reliable workmanship, and coordinated project management.',
    tags: ['Structural works', 'Construction', 'Site execution'],
    image: '/images/service-civil.webp',
    pill: 'Div 03 / Civil',
    tagline: 'Reliable construction solutions for diverse projects.',
    description:
      'Full-spectrum civil contracting spanning reinforced substructures, commercial podiums, industrial slabs, and structural alterations in compliance with Ashghal and municipal guidelines.',
    highlights: ['Foundation & Superstructure Works', 'Structural Steel & Core Alterations', 'Commercial & Residential Turn-Key Delivery'],
    cta: 'Explore Civil Division',
  },
};

export const homeDefaults = {
  hero: {
    title: 'Shah Noori',
    text: 'Integrated construction and fit-out solutions, thoughtfully executed from concept to completion.',
    buttonLabel: 'Start a Project',
    image: '/images/hero-home.webp',
  },
  about: {
    text: 'We are an integrated construction and contracting company delivering civil, interior & fit-out, and complete MEP solutions with precision, reliability, and a commitment to quality.',
    stats: [
      { value: '15+', label: 'Years of Experience' },
      { value: '100+', label: 'Completed Projects' },
      { value: '98%', label: 'Client Satisfaction' },
    ],
  },
  work: {
    heading: 'Selected Work',
    text: 'A collection of spaces shaped through precision, craftsmanship, and integrated execution.',
  },
  why: {
    heading: 'Why Choose Us?',
    text: 'End-to-end reliability in Qatar through sovereign-level quality control, unified responsibility, and localized engineering governance.',
    reasons: [
      {
        icon: 'blocks',
        title: 'Integrated Capability',
        text: 'Civil Construction, Interior & Fit-Out and MEP works under one company. Eliminates sub-contractor friction.',
        tag: 'Single Responsibility',
      },
      {
        icon: 'wrench',
        title: 'Direct MEP Execution',
        text: 'Complete Mechanical, Electrical and Plumbing works, including installation, testing and commissioning without third-party delay.',
        tag: 'Direct Force',
      },
      {
        icon: 'award',
        title: 'Quality Workmanship',
        text: 'Professional execution with a focus on quality and consistency, abiding strictly by Qatar Construction Specifications (QCS).',
        tag: 'ISO & QCS Compliant',
      },
      {
        icon: 'infinity',
        title: 'End-to-End Execution',
        text: 'One reliable point of responsibility throughout the project life cycle, from early BIM spatial planning to final municipal sign-off.',
        tag: 'Turnkey Assurance',
      },
    ],
  },
  services: {
    heading: 'What we\ndeliver',
    text: 'We bring every stage of your project together — from construction and fit-out to complete MEP execution.',
  },
  process: {
    heading: 'How We Work',
    text: 'A structured approach from the first conversation to final handover.',
    steps: [
      { title: 'Understand', sub: 'Brief · Site · Scope', text: 'We begin by understanding your vision, site conditions, and project objectives in detail.' },
      { title: 'Coordinate', sub: 'Planning · Engineering · Materials', text: 'We coordinate planning, engineering, and material selection to create a clear and efficient execution strategy.' },
      { title: 'Execute', sub: 'Civil · Fit-Out · MEP', text: 'Our teams execute with precision across civil construction, interior fit-out, and MEP works with strict quality control.' },
      { title: 'Handover', sub: 'Testing · Commissioning · Completion', text: 'We ensure everything is tested, commissioned, and completed to deliver a safe, functional, and ready-to-use space.' },
    ],
  },
  testimonials: {
    heading: 'What Our Clients Say',
  },
};

export const aboutDefaults = {
  hero: {
    title: 'Integrated Construction & Contracting Company in Qatar',
    buttonLabel: 'Start a Project',
    image: '/images/hero-about.webp',
  },
  story: {
    text:
      'Established on 11 September 2022, Shah Noori brings together a strong foundation of construction expertise and 15 years of professional experience in Qatar. Founded by Riyas N, the company has grown with a clear focus on delivering reliable, high-quality construction solutions.\n\n' +
      'With 100+ projects completed, our experience spans the demands of diverse construction environments, combining practical knowledge with disciplined project execution.',
    image1: '/images/story-1.webp',
    image2: '/images/story-2.webp',
  },
  approach: {
    heading: 'Precision in Planning.\nExcellence in Execution.',
    text:
      'Every project begins with understanding its requirements, context, and objectives. At Shah Noori, we believe successful construction is built long before the first structure takes shape.\n\n' +
      'Our approach is centred around precision planning, proactive communication, and uncompromising quality control. By maintaining close coordination throughout every stage, we ensure that decisions are clear, processes remain efficient, and every detail receives the attention it deserves.',
  },
  stats: {
    heading: 'Measured by\nexperience and trust',
    items: [
      { value: '15+', text: '15 years of construction experience in Qatar, bringing proven expertise and industry knowledge to every project.' },
      { value: '100+', text: 'With 100+ completed projects, Shah Noori delivers reliable construction solutions with consistency and quality.' },
    ],
  },
  mission: {
    heading: 'Our Mission',
    text: 'To deliver high-quality and cost-effective services and products through a motivated and focused team, guided by sound engineering principles and ethical business practices.',
  },
  vision: {
    heading: 'Our Vision',
    text: 'To create new concepts of living, build lasting client trust and provide personalized solutions while becoming a leading provider of quality Electro-Mechanical and Engineering services globally.',
  },
  services: {
    heading: 'Complete Solutions Under One Roof',
  },
};

export const servicesDefaults = {
  hero: {
    title: 'End-to-End Civil, Interior & Fit-Out, and MEP Engineering Solutions',
    image: '/images/hero-services.webp',
  },
  interior: {
    eyebrow: 'Interior & Fit-Out',
    title: 'Interior & Fit-Out Works',
    text: 'Executing complete luxury interiors: shell & core fit-outs, executive lounges, five-star hospitality boutiques, and private palatial majlis spaces with integrated bespoke joinery workshops.',
    linkLabel: 'Explore Fit-Out Portfolio',
    features: [
      { image: '/images/interior-1.webp', pill: 'Turnkey Villa Majlis', title: 'Calacatta Marble & Fluted Oak', text: 'Integrated brass mashrabiya panels, acoustic timber walling, and bespoke curved velvet furnishings.' },
      { image: '/images/interior-2.webp', pill: 'Birkat Awamer Workshop', title: 'CNC Millwork & Joinery Hub', text: 'In-house master carpenters producing high-tolerance reception counters, carved doors, and bespoke cabinetry.' },
      { image: '/images/interior-3.webp', pill: 'Hospitality & Retail', title: 'Curved Travertine & Champagne Gold', text: 'Fluted travertine archways, concealed perimeter LED coves, and boutique hospitality lounges.' },
    ],
    specialties: [
      {
        icon: 'store',
        title: 'Sector Coverage',
        text: 'Turnkey solutions for diverse commercial & private typologies.',
        chips: ['Turnkey Fit-Out', 'Offices & HQs', 'Retail Stores', 'Restaurants', 'Luxury Villas', 'Hospitality'],
      },
      {
        icon: 'layout',
        title: 'Partitions & Ceilings',
        text: 'Certified acoustic decibel damping and fire rated drywall.',
        chips: ['Gypsum Partitions', 'Drywall Systems', 'Acoustic Ceilings', 'GRG & Coves', 'Metal Baffles'],
      },
      {
        icon: 'stripes',
        title: 'Finishes & Cladding',
        text: 'Premium materials selected and polished to mirror tolerances.',
        chips: ['Bookmatched Marble', 'Solid Parquet', 'Venetian Plaster', 'Micro-Cement', 'Acoustic Fabric'],
      },
      {
        icon: 'pen',
        title: 'Joinery & Metalcraft',
        text: 'Direct from our fabrication facility to the job site.',
        chips: ['Custom Millwork', 'Frameless Glass', 'Brass Accents', 'Fire Doors', 'Reception Desks'],
      },
    ],
  },
  mep: {
    eyebrow: 'MEP Works',
    title: 'Turnkey Electro-Mechanical (MEP)',
    text: 'In-house Mechanical, Electrical, ELV, and Plumbing coordination eliminates clash rework, reduces ceiling plenum conflicts, and accelerates Kahramaa and Civil Defense approvals across Qatar.',
    linkLabel: 'Explore MEP Systems',
    features: [
      { image: '/images/mep-1.webp', pill: 'Industrial Chiller Plant & BMS', title: 'Central Mechanical Plant & Low Current Infrastructure', text: 'Smart SCADA controls, dual centrifugal chillers, stainless pipe insulation, and organized low-noise cable risers.' },
      { image: '/images/mep-2.webp', pill: 'Lusail Marina Towers', title: 'Integrated High-Rise Vertical MEP', text: 'Complete electrical feeds, chilled water loops, and life safety certified to GSAS 4-star standards.' },
    ],
  },
  civil: {
    eyebrow: 'Civil Construction',
    title: 'Civil & Structural Works',
    text: 'Undertaking reinforced superstructures, deep foundation earthworks, structural retrofits, and high-precision building shells across Doha and Lusail under QCS 2014 protocols.',
    linkLabel: 'Explore Civil Scope',
    features: [
      {
        image: '/images/civil-1.webp',
        pill: 'West Bay Commercial Tower Core',
        title: 'Cast-In-Place Concrete & Core Structural Engineering',
        text: 'Robotic total station accuracy, heavy tower cranes, and accelerated slip-form scheduling.',
      },
      {
        image: '/images/civil-2.webp',
        pill: 'Ashghal Ready QA/QC',
        title: 'On-Site Blueprint & Digital BIM Coordination',
        text: 'Tight tolerance structural surveys ensuring zero interference before MEP pass-throughs.',
      },
    ],
    listHeading: 'Specialized Civil Competencies',
    competencies: [
      { icon: 'terrain', title: 'Site Preparation', text: 'Excavation, grading & shoring', tag: 'Phase 01 · Enabling' },
      { icon: 'batch', title: 'Concrete Works', text: 'High-grade batching & casting', tag: '±1.5mm Precision' },
      { icon: 'building', title: 'RCC Works', text: 'Reinforced cores, columns & slabs', tag: 'ASTM Grade 60' },
      { icon: 'shield', title: 'Waterproofing', text: 'SBS membranes & polyurea coatings', tag: '10-Yr Guarantee' },
      { icon: 'grid', title: 'Block & Masonry', text: 'Thermal, hollow & solid partitions', tag: 'Thermal Envelope' },
      { icon: 'roller', title: 'Plastering & Screed', text: 'Self-leveling & gypsum finishes', tag: 'Laser Leveled' },
      { icon: 'compass', title: 'Structural Retrofits', text: 'Carbon fiber, steel propping & core cuts', tag: 'Engineered Safety' },
      { icon: 'cone', title: 'External & Curbs', text: 'Heavy paving, kerbs & site hardscaping', tag: 'Ashghal Specs' },
    ],
  },
  handover: {
    heading: 'Harmonized Single-Point Responsibility',
    text: 'How Shah Noori orchestrates Civil, Fit-Out, and MEP engineering from 3D BIM design through authority certification.',
    steps: [
      { title: 'BIM Clash Detection', sub: 'Navisworks Coordination', text: 'Full spatial integration across structural concrete beams, interior ceiling tiers, and HVAC duct networks before site execution.' },
      { title: 'Laser Rough-In Phase', sub: 'Civil & MEP Conduits', text: 'Precision setting out of wall chases, floor sleeves, and recessed junction trays before structural plastering and screeding.' },
      { title: 'Hydrostatic & Megger', sub: 'Rigorous Verification', text: '10-bar pressure holding for piping loops and insulation resistance Megger testing across all electrical panelboards.' },
      { title: 'QCDD & Authority Sign-Off', sub: 'Turnkey Handover', text: 'Civil Defense inspection certificates, Kahramaa meter energization, and complete As-Built O&M manuals for client operations.' },
    ],
  },
};

export const projectsDefaults = {
  hero: {
    heading: "Spaces we've\nbrought to life.",
    text: 'A collection of spaces shaped through precision, craftsmanship, and integrated execution across Qatar.',
  },
  list: {
    heading: 'All Work',
    buttonLabel: 'Start a Project',
  },
};

export const contactDefaults = {
  hero: {
    heading: "Let's Build Your Next",
    highlight: 'Project Together.',
    lead: 'Looking for a reliable construction, interior fit-out or MEP company in Qatar?',
    text: 'Talk to Shah Noori about your project requirements and work with one integrated project partner.',
    badges: ['Grade-A Classified', 'Turnkey Delivery Under One Roof', 'Rapid 24-Hour Tender Response'],
  },
  form: {
    eyebrow: 'Direct Tender Submission & RFQ',
    heading: 'Request a Project Consultation',
    text: 'Submit your tender documents or project specifications for confidential evaluation.',
  },
  location: {
    eyebrow: 'Operational Center & Production Plant',
    heading: 'Find Our Location',
    text: 'Strategically located in Birkat Awamer logistics and manufacturing hub with integrated joinery workshop, MEP testing yard, and administrative engineering offices.',
    travelTimes: [
      { place: "Hamad Int'l Airport", time: '20 Mins', via: 'Via G-Ring Expressway' },
      { place: 'West Bay & Corniche', time: '25 Mins', via: 'Via Sabah Al-Ahmad Corridor' },
      { place: 'Lusail Marina District', time: '28 Mins', via: 'Via Al Majd Orbital' },
    ],
    officeLabel: 'Corporate Headquarters',
    officeNote: 'Central Engineering Yard, Joinery Complex & Executive Boardroom',
  },
  whatsapp: {
    eyebrow: 'Immediate Technical Channel',
    badge: 'Active Now',
    heading: 'WhatsApp: Direct Enquiry',
    text: 'Instant chat with our senior project estimator & engineering directors.',
  },
};

export type SharedContent = typeof sharedDefaults;
export type HomeContent = typeof homeDefaults;
export type AboutContent = typeof aboutDefaults;
export type ServicesContent = typeof servicesDefaults;
export type ProjectsContent = typeof projectsDefaults;
export type ContactContent = typeof contactDefaults;
