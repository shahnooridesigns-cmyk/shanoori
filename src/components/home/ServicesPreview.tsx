import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../shared/Container';

const services = [
  { title: 'Civil Construction', href: '/services#civil' },
  { title: 'Interior & Fit-out', href: '/services#interior' },
  // MEP = mechanical, electrical & plumbing; these are consecutive sections starting at #mechanical
  { title: 'MEP Works', href: '/services#mechanical' },
];

export const ServicesPreview = () => {
  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Our Services</h2>
            <p className="text-foreground/70 text-lg">
              Comprehensive construction and interior solutions tailored to your unique requirements.
            </p>
          </div>
          <Link href="/services" className="text-primary-700 font-semibold hover:text-primary-900 flex items-center gap-2 whitespace-nowrap">
            View All Services &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <Link key={idx} href={service.href} className="group block relative overflow-hidden rounded-2xl bg-primary-950 aspect-[4/3]">
              <Image
                src="/placeholder.svg"
                alt={service.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                <span className="text-accent-300 font-medium group-hover:underline">Explore &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};
