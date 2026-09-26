import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { PageHero } from '@/components/shared/PageHero';
import { FaqSection } from '@/components/shared/FaqSection';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { ChipCard, DivisionHeader, FeatureCard, Icons, MiniCard } from '@/components/services/ServiceBlocks';

export const metadata: Metadata = {
  title: 'Services',
  description: 'End-to-end civil construction, interior & fit-out, and MEP engineering solutions in Doha, Qatar.',
};

const civilCompetencies = [
  { icon: Icons.terrain, title: 'Site Preparation', text: 'Excavation, grading & shoring', tag: 'Phase 01 · Enabling' },
  { icon: Icons.batch, title: 'Concrete Works', text: 'High-grade batching & casting', tag: '±1.5mm Precision' },
  { icon: Icons.building, title: 'RCC Works', text: 'Reinforced cores, columns & slabs', tag: 'ASTM Grade 60' },
  { icon: Icons.shield, title: 'Waterproofing', text: 'SBS membranes & polyurea coatings', tag: '10-Yr Guarantee' },
  { icon: Icons.grid, title: 'Block & Masonry', text: 'Thermal, hollow & solid partitions', tag: 'Thermal Envelope' },
  { icon: Icons.roller, title: 'Plastering & Screed', text: 'Self-leveling & gypsum finishes', tag: 'Laser Leveled' },
  { icon: Icons.compass, title: 'Structural Retrofits', text: 'Carbon fiber, steel propping & core cuts', tag: 'Engineered Safety' },
  { icon: Icons.cone, title: 'External & Curbs', text: 'Heavy paving, kerbs & site hardscaping', tag: 'Ashghal Specs' },
];

const fitOutSpecialties = [
  {
    icon: Icons.store,
    title: 'Sector Coverage',
    text: 'Turnkey solutions for diverse commercial & private typologies.',
    chips: ['Turnkey Fit-Out', 'Offices & HQs', 'Retail Stores', 'Restaurants', 'Luxury Villas', 'Hospitality'],
  },
  {
    icon: Icons.layout,
    title: 'Partitions & Ceilings',
    text: 'Certified acoustic decibel damping and fire rated drywall.',
    chips: ['Gypsum Partitions', 'Drywall Systems', 'Acoustic Ceilings', 'GRG & Coves', 'Metal Baffles'],
  },
  {
    icon: Icons.stripes,
    title: 'Finishes & Cladding',
    text: 'Premium materials selected and polished to mirror tolerances.',
    chips: ['Bookmatched Marble', 'Solid Parquet', 'Venetian Plaster', 'Micro-Cement', 'Acoustic Fabric'],
  },
  {
    icon: Icons.pen,
    title: 'Joinery & Metalcraft',
    text: 'Direct from our fabrication facility to the job site.',
    chips: ['Custom Millwork', 'Frameless Glass', 'Brass Accents', 'Fire Doors', 'Reception Desks'],
  },
];

const handoverSteps = [
  { title: 'BIM Clash Detection', sub: 'Navisworks Coordination', text: 'Full spatial integration across structural concrete beams, interior ceiling tiers, and HVAC duct networks before site execution.' },
  { title: 'Laser Rough-In Phase', sub: 'Civil & MEP Conduits', text: 'Precision setting out of wall chases, floor sleeves, and recessed junction trays before structural plastering and screeding.' },
  { title: 'Hydrostatic & Megger', sub: 'Rigorous Verification', text: '10-bar pressure holding for piping loops and insulation resistance Megger testing across all electrical panelboards.' },
  { title: 'QCDD & Authority Sign-Off', sub: 'Turnkey Handover', text: 'Civil Defense inspection certificates, Kahramaa meter energization, and complete As-Built O&M manuals for client operations.' },
];

export default function ServicesPage() {
  return (
    <main className="flex-1 w-full">
      <PageHero
        label="Our Services"
        image="/images/hero-services.jpg"
        title={<>End-to-End Civil, Interior &amp; Fit-Out, and MEP Engineering Solutions</>}
      />

      <div className="bg-gradient-to-b from-beige to-butter">
        {/* Civil */}
        <section id="civil" className="pt-10 pb-12">
          <Container>
            <DivisionHeader
              eyebrow="Civil Construction"
              title="Civil & Structural Works"
              intro="Undertaking reinforced superstructures, deep foundation earthworks, structural retrofits, and high-precision building shells across Doha and Lusail under QCS 2014 protocols."
              linkLabel="Explore Civil Scope"
              href="/projects?category=civil"
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.42fr_1fr]">
              <FeatureCard
                sizes="(min-width: 1024px) 60vw, 100vw"
                card={{
                  image: '/images/civil-1.jpg',
                  pill: 'West Bay Commercial Tower Core',
                  title: 'Cast-In-Place Concrete & Core Structural Engineering',
                  text: 'Robotic total station accuracy, heavy tower cranes, and accelerated slip-form scheduling.',
                }}
              />
              <FeatureCard
                sizes="(min-width: 1024px) 40vw, 100vw"
                card={{
                  image: '/images/civil-2.jpg',
                  pill: 'Ashghal Ready QA/QC',
                  title: 'On-Site Blueprint & Digital BIM Coordination',
                  text: 'Tight tolerance structural surveys ensuring zero interference before MEP pass-throughs.',
                }}
              />
            </div>

            <h3 className="text-brand-gradient mt-16 w-fit text-2xl font-semibold">Specialized Civil Competencies</h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {civilCompetencies.map((c) => <MiniCard key={c.title} {...c} />)}
            </div>
          </Container>
        </section>

        {/* Interior & Fit-Out */}
        <section id="interior" className="py-12">
          <Container>
            <DivisionHeader
              eyebrow="Interior & Fit-Out"
              title="Interior & Fit-Out Works"
              intro="Executing complete luxury interiors: shell & core fit-outs, executive lounges, five-star hospitality boutiques, and private palatial majlis spaces with integrated bespoke joinery workshops."
              linkLabel="Explore Fit-Out Portfolio"
              href="/projects?category=interior"
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <FeatureCard
                sizes="(min-width: 768px) 33vw, 100vw"
                card={{ image: '/images/interior-1.jpg', pill: 'Turnkey Villa Majlis', title: 'Calacatta Marble & Fluted Oak', text: 'Integrated brass mashrabiya panels, acoustic timber walling, and bespoke curved velvet furnishings.' }}
              />
              <FeatureCard
                sizes="(min-width: 768px) 33vw, 100vw"
                card={{ image: '/images/interior-2.jpg', pill: 'Birkat Awamer Workshop', title: 'CNC Millwork & Joinery Hub', text: 'In-house master carpenters producing high-tolerance reception counters, carved doors, and bespoke cabinetry.' }}
              />
              <FeatureCard
                sizes="(min-width: 768px) 33vw, 100vw"
                card={{ image: '/images/interior-3.jpg', pill: 'Hospitality & Retail', title: 'Curved Travertine & Champagne Gold', text: 'Fluted travertine archways, concealed perimeter LED coves, and boutique hospitality lounges.' }}
              />
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {fitOutSpecialties.map((s) => <ChipCard key={s.title} {...s} />)}
            </div>
          </Container>
        </section>

        {/* MEP */}
        <section id="mep" className="py-12">
          <Container>
            <DivisionHeader
              eyebrow="MEP Works"
              title="Turnkey Electro-Mechanical (MEP)"
              intro="In-house Mechanical, Electrical, ELV, and Plumbing coordination eliminates clash rework, reduces ceiling plenum conflicts, and accelerates Kahramaa and Civil Defense approvals across Qatar."
              linkLabel="Explore MEP Systems"
              href="/projects?category=mechanical"
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.42fr_1fr]">
              <FeatureCard
                sizes="(min-width: 1024px) 60vw, 100vw"
                card={{ image: '/images/mep-1.jpg', pill: 'Industrial Chiller Plant & BMS', title: 'Central Mechanical Plant & Low Current Infrastructure', text: 'Smart SCADA controls, dual centrifugal chillers, stainless pipe insulation, and organized low-noise cable risers.' }}
              />
              <FeatureCard
                sizes="(min-width: 1024px) 40vw, 100vw"
                card={{ image: '/images/mep-2.jpg', pill: 'Lusail Marina Towers', title: 'Integrated High-Rise Vertical MEP', text: 'Complete electrical feeds, chilled water loops, and life safety certified to GSAS 4-star standards.' }}
              />
            </div>
          </Container>
        </section>

        {/* Single-point responsibility */}
        <section className="pt-16 pb-24">
          <Container>
            <h2 className="text-brand-gradient mx-auto w-fit max-w-xl text-center text-4xl md:text-5xl font-semibold leading-tight">
              Harmonized Single-Point Responsibility
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-ink/80">
              How Shah Noori orchestrates Civil, Fit-Out, and MEP engineering from 3D BIM design through authority certification.
            </p>
            <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {handoverSteps.map((step, i) => (
                <li key={step.title} className="rounded-[24px] bg-white p-6 pb-10">
                  <span className="text-5xl font-medium text-maroon/40">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 text-lg font-semibold text-maroon">{step.title}</h3>
                  <p className="text-sm text-ink/70">{step.sub}</p>
                  <p className="mt-5 text-sm leading-relaxed text-ink/90">{step.text}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      </div>

      <FaqSection />
      <CtaBanner />
    </main>
  );
}
