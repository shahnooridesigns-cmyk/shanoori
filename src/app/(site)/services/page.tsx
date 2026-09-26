import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/shared/Container';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { resolveWhatsAppNumber } from '@/lib/constants';
import { fetchSiteSettings } from '@/lib/sanity/fetch';
import type { Category } from '@/lib/sanity/types';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Civil construction, interior fit-out, mechanical, electrical and plumbing works in Doha, Qatar.',
};

const services: { id: Category; title: string; description: string }[] = [
  {
    id: 'civil',
    title: 'Civil Construction',
    description: 'We provide comprehensive civil construction services for residential, commercial, and industrial projects. Our team ensures structural integrity, adherence to safety standards, and timely completion.',
  },
  {
    id: 'interior',
    title: 'Interior & Fit-out',
    description: 'Transforming empty spaces into functional and aesthetically pleasing environments. We specialize in custom woodwork, partitioning, false ceilings, and complete interior furnishing.',
  },
  {
    id: 'mechanical',
    title: 'Mechanical Works',
    description: 'Expert mechanical installations including HVAC systems, ventilation, and industrial equipment setups. We guarantee efficient and sustainable mechanical solutions.',
  },
  {
    id: 'electrical',
    title: 'Electrical Works',
    description: 'From lighting design to complex industrial power distributions, our certified electricians deliver safe, reliable, and energy-efficient electrical systems.',
  },
  {
    id: 'plumbing',
    title: 'Plumbing Works',
    description: 'Complete plumbing and drainage solutions. We handle water supply systems, sanitary fixtures, and maintenance with the highest industry standards.',
  }
];

export default async function ServicesPage() {
  const settings = await fetchSiteSettings();

  return (
    <main className="flex-1 py-20 w-full overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6">Our Services</h1>
          <p className="text-lg text-foreground/80">
            A comprehensive suite of construction, fit-out, and MEP services delivered with precision and excellence across Qatar.
          </p>
        </div>

        <div className="flex flex-col gap-20 md:gap-32">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const phoneNumber = resolveWhatsAppNumber(settings, service.id);
            return (
              <section
                key={service.id}
                id={service.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
              >
                <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-primary-100 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <Image 
                    src="/placeholder.svg" 
                    alt={service.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className={`flex flex-col gap-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <h2 className="text-3xl font-bold text-primary-900">{service.title}</h2>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="pt-4">
                    <WhatsAppButton 
                      message={`Hello Shah Noori, I am interested in your ${service.title} services and would like to request a quote.`} 
                      phoneNumber={phoneNumber}
                    />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
