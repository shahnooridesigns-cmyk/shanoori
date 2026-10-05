import React from 'react';
import { ServicesReveal } from './ServicesReveal';
import { StackedServices } from './StackedServices';
import { toDivisions } from '@/lib/services';
import { fetchHomeContent, fetchSharedContent } from '@/lib/sanity/fetch';

export const ServicesShowcase = async () => {
  const [{ services }, shared] = await Promise.all([fetchHomeContent(), fetchSharedContent()]);

  return (
    <ServicesReveal heading={services.heading} text={services.text}>
      <StackedServices divisions={toDivisions(shared)} />
    </ServicesReveal>
  );
};
