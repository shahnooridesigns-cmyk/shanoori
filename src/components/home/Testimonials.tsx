import React from 'react';
import { Container } from '../shared/Container';
import { SectionLabel } from '../shared/ui';
import { TestimonialSlider } from './TestimonialSlider';
import { fetchFeaturedReviews, fetchHomeContent } from '@/lib/sanity/fetch';

export const Testimonials = async () => {
  const [reviews, { testimonials }] = await Promise.all([fetchFeaturedReviews(), fetchHomeContent()]);
  if (reviews.length === 0) return null;

  return (
    <section className="bg-white pt-24 md:pt-32">
      <Container>
        <SectionLabel>Testimonials</SectionLabel>
        <h2 className="mt-4 text-5xl md:text-6xl font-semibold text-ink">{testimonials.heading}</h2>
        <div className="mt-14">
          <TestimonialSlider reviews={reviews} />
        </div>
      </Container>
    </section>
  );
};
