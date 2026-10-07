import React from 'react';
import { ClientNotes } from './ClientNotes';
import { fetchFeaturedReviews, fetchHomeContent } from '@/lib/sanity/fetch';
import type { Review } from '@/lib/sanity/types';

/**
 * Stand-in testimonials, shown only while the Studio has no featured reviews, so the section can
 * be seen and judged. They are invented: replace them with real reviews before launch.
 */
const PLACEHOLDER_REVIEWS: Review[] = [
  {
    _id: 'placeholder-1',
    clientName: 'Client Name',
    clientCompany: 'Retail Fit-out Client',
    rating: 5,
    reviewText: 'The team handled design, joinery and MEP as one job. We opened on the date they promised, and the finish is exactly what we were shown.',
    imageUrl: '/assets/images/services/interior-2-hd.webp',
  },
  {
    _id: 'placeholder-2',
    clientName: 'Client Name',
    clientCompany: 'Hospitality Client',
    rating: 5,
    reviewText: 'Clear communication from the first site visit to handover. Every detail we asked about was answered, and nothing was left unfinished.',
    imageUrl: '/assets/images/about/story-2-hd.webp',
  },
  {
    _id: 'placeholder-3',
    clientName: 'Client Name',
    clientCompany: 'Villa Interior Client',
    rating: 5,
    reviewText: 'They took an empty shell and gave us a home. The lighting, the ceilings and the finishes all work together beautifully.',
    imageUrl: '/assets/images/services/interior-1-hd.webp',
  },
];

export const Testimonials = async () => {
  const [reviews, { testimonials }] = await Promise.all([fetchFeaturedReviews(), fetchHomeContent()]);

  return (
    <section className="relative bg-beige" aria-label="Client testimonials">
      <ClientNotes title={testimonials.heading} reviews={reviews.length > 0 ? reviews : PLACEHOLDER_REVIEWS} />
    </section>
  );
};
