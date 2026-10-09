import React from 'react';
import { ClientNotes } from './ClientNotes';
import { fetchFeaturedReviews, fetchHomeContent } from '@/lib/sanity/fetch';

/** Every card comes from the Studio (Testimonials, Featured on). With none, the section is left out. */
export const Testimonials = async () => {
  const [reviews, { testimonials }] = await Promise.all([fetchFeaturedReviews(), fetchHomeContent()]);
  if (reviews.length === 0) return null;

  return (
    <section className="relative bg-beige" aria-label="Client testimonials">
      <ClientNotes title={testimonials.heading} reviews={reviews} />
    </section>
  );
};
