import React from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Container } from '@/components/shared/Container';
import { PageHero } from '@/components/shared/PageHero';
import { FaqSection } from '@/components/shared/FaqSection';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { ChipCard, DivisionHeader, FeatureCard, Icons, MiniCard, type FeatureCardData } from '@/components/services/ServiceBlocks';
import { BalancedGrid } from '@/components/shared/BalancedGrid';
import { fetchAllProjects, fetchServicesContent } from '@/lib/sanity/fetch';
import type { Category } from '@/lib/sanity/types';

export const metadata: Metadata = pageMeta({
  title: 'Interior Fit-out, MEP & Civil Services in Qatar',
  description:
    'Interior fit-out, MEP (mechanical, electrical, plumbing) and civil construction services in Doha, Qatar, delivered end to end by one team.',
  path: '/services',
});

/** Icon picked in Studio (SERVICE_ICONS in lib/content/defaults.ts) */
const icon = (name: string) => Icons[name as keyof typeof Icons] ?? Icons.grid;

/**
 * Photo cards for however many the Studio holds: one fills the row, two sit wide + narrow,
 * three share a row, four make a square, and beyond that the first card widens so every
 * row of three is full.
 */
const featureLayout = (count: number) => {
  if (count <= 1) return { grid: '', first: '' };
  if (count === 2) return { grid: 'lg:grid-cols-[1.42fr_1fr]', first: '' };
  if (count === 3) return { grid: 'md:grid-cols-3', first: '' };
  if (count === 4) return { grid: 'md:grid-cols-2', first: '' };
  const first = count % 3 === 2 ? 'lg:col-span-2' : count % 3 === 1 ? 'lg:col-span-3' : '';
  return { grid: 'md:grid-cols-2 lg:grid-cols-3', first };
};

const FeatureCards = ({ cards }: { cards: FeatureCardData[] }) => {
  const layout = featureLayout(cards.length);
  return (
    <div className={`mt-12 grid gap-6 ${layout.grid}`}>
      {cards.map((card, i) => (
        <FeatureCard key={i} card={card} className={i === 0 ? layout.first : ''} sizes="(min-width: 1024px) 60vw, 100vw" />
      ))}
    </div>
  );
};

export default async function ServicesPage() {
  const [{ hero, interior, mep, civil, handover }, projects] = await Promise.all([fetchServicesContent(), fetchAllProjects()]);
  // Link to the projects of a kind only when there are some: the first of these categories that has any
  const projectsLink = (...categories: Category[]) => {
    const found = categories.find((category) => projects.some((project) => project.category === category));
    return found ? `/projects?category=${found}` : undefined;
  };

  return (
    <main className="flex-1 w-full">
      <PageHero
        label="Our Services"
        image={hero.image}
        title={hero.title}
      />

      <div className="bg-gradient-to-b from-beige to-butter">
        {/* Interior & Fit-Out */}
        <section id="interior" className="pt-10 pb-12">
          <Container>
            <DivisionHeader
              eyebrow={interior.eyebrow}
              title={interior.title}
              intro={interior.text}
              linkLabel={interior.linkLabel}
              href={projectsLink('interior')}
            />
            <FeatureCards cards={interior.features} />
            <BalancedGrid count={interior.specialties.length} gap="1.25rem" className="mt-12">
              {interior.specialties.map((s, i) => <ChipCard key={i} {...s} icon={icon(s.icon)} />)}
            </BalancedGrid>
          </Container>
        </section>

        {/* MEP */}
        <section id="mep" className="py-12">
          <Container>
            <DivisionHeader
              eyebrow={mep.eyebrow}
              title={mep.title}
              intro={mep.text}
              linkLabel={mep.linkLabel}
              href={projectsLink('mechanical', 'electrical', 'plumbing')}
            />
            <FeatureCards cards={mep.features} />
          </Container>
        </section>

        {/* Civil */}
        <section id="civil" className="py-12">
          <Container>
            <DivisionHeader
              eyebrow={civil.eyebrow}
              title={civil.title}
              intro={civil.text}
              linkLabel={civil.linkLabel}
              href={projectsLink('civil')}
            />
            <FeatureCards cards={civil.features} />

            <h3 className="text-reveal text-brand-gradient mt-16 w-fit text-2xl font-semibold">{civil.listHeading}</h3>
            <BalancedGrid count={civil.competencies.length} gap="1.25rem" className="mt-6">
              {civil.competencies.map((c, i) => <MiniCard key={i} {...c} icon={icon(c.icon)} />)}
            </BalancedGrid>
          </Container>
        </section>

        {/* Single-point responsibility */}
        <section className="pt-16 pb-24">
          <Container>
            <h2 className="text-brand-gradient mx-auto w-fit max-w-xl text-center text-4xl md:text-5xl font-semibold leading-tight">
              {handover.heading}
            </h2>
            <p className="text-reveal mx-auto mt-5 max-w-2xl text-center text-lg text-ink/80">
              {handover.text}
            </p>
            <BalancedGrid as="ol" count={handover.steps.length} gap="1.25rem" className="mt-14">
              {handover.steps.map((step, i) => (
                <li key={i} className="card-reveal card-lift rounded-[24px] bg-white p-6 pb-10">
                  <span className="text-5xl font-medium text-maroon/40">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 text-lg font-semibold text-maroon">{step.title}</h3>
                  <p className="text-sm text-ink/70">{step.sub}</p>
                  <p className="mt-5 text-sm leading-relaxed text-ink/90">{step.text}</p>
                </li>
              ))}
            </BalancedGrid>
          </Container>
        </section>
      </div>

      <FaqSection />
      <CtaBanner />
    </main>
  );
}
