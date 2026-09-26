import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { fetchFeaturedReviews } from '@/lib/sanity/fetch';

export const Reviews = async () => {
  const reviews = await fetchFeaturedReviews();

  if (reviews.length === 0) {
    // Only render empty state in dev for gracefully hiding in prod
    if (process.env.NODE_ENV === 'development') {
      return (
        <section className="py-24 bg-white">
          <Container>
            <div className="text-center text-foreground/60 p-8 border border-dashed rounded-xl border-gray-300">
              [Dev Only] No featured reviews found in Sanity. Add some and check &quot;Featured&quot; to display them here.
            </div>
          </Container>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">What Our Clients Say</h2>
          <p className="text-foreground/70 text-lg">
            Hear from the businesses and individuals who have experienced the Shah Noori standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => {
            const rating = Math.min(5, Math.max(1, Math.round(review.rating ?? 5)));
            return (
              <div
                key={review._id}
                className="bg-primary-50 p-8 rounded-2xl border border-primary-100 flex flex-col h-full shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {review.photoUrl ? (
                      <Image
                        src={review.photoUrl}
                        alt={review.clientName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-900 text-white font-bold text-xl" aria-hidden="true">
                        {review.clientName?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-900 leading-tight">{review.clientName}</h3>
                    {review.clientCompany && (
                      <p className="text-sm text-foreground/70">{review.clientCompany}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 mb-4 text-accent-500" role="img" aria-label={`Rated ${rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < rating ? 'fill-current' : 'fill-gray-300'}`}
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-foreground/80 italic mb-6 flex-grow text-lg">
                  &quot;{review.reviewText}&quot;
                </p>

                {review.projectSlug && (
                  <div className="mt-auto pt-4 border-t border-primary-100">
                    <Link
                      href={`/projects/${encodeURIComponent(review.projectSlug)}`}
                      className="text-sm font-semibold text-primary-700 hover:text-primary-900 flex items-center gap-1 transition-colors"
                    >
                      Project: {review.projectName} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
