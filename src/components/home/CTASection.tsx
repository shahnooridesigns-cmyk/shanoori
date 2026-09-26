import React from 'react';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { resolveContact, toTelHref } from '@/lib/constants';
import { fetchSiteSettings } from '@/lib/sanity/fetch';

export const CTASection = async () => {
  const { phone } = resolveContact(await fetchSiteSettings());

  return (
    <section className="py-24 bg-primary-900 relative overflow-hidden text-center">
      <Container className="relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to Start Your Project?
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
          Contact us today to discuss your requirements and discover how Shah Noori can bring your vision to life.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-accent-300 px-8 py-4 font-bold text-primary-950 transition-colors hover:bg-accent-400"
          >
            Contact Us Now
          </Link>
          <a
            href={toTelHref(phone)}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-transparent px-8 py-4 font-bold text-white transition-colors hover:bg-white/10 hover:border-white/50"
          >
            Call {phone}
          </a>
        </div>
      </Container>
    </section>
  );
};
