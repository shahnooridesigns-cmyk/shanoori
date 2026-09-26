import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/shared/Container';

export const metadata: Metadata = {
  title: 'About',
  description: 'Shah Noori Interior & Fit-out is a construction and interior design firm based in Doha, Qatar.',
};

export default function AboutPage() {
  return (
    <main className="flex-1 py-20 w-full overflow-hidden">
      <Container>
        {/* About Us Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-900">About Shah Noori</h1>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Shah Noori Interior & Fit-out is a premier construction and interior design firm based in Doha, Qatar. With years of experience and a passion for excellence, we have established ourselves as a trusted partner for residential, commercial, and industrial projects.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Our team of dedicated professionals works tirelessly to bring your vision to life, ensuring every detail is executed with precision and care. From initial concept to final handover, we are committed to exceeding your expectations.
              </p>
            </div>
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-primary-100">
              <Image 
                src="/placeholder.svg" 
                alt="About Shah Noori" 
                fill 
                className="object-cover" 
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="bg-primary-50 rounded-3xl p-8 md:p-16 border border-primary-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-primary-900 mb-2">Our Mission</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                To deliver exceptional interior and construction services that consistently exceed client expectations through innovative solutions, superior craftsmanship, and unwavering integrity.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-primary-900 mb-2">Our Vision</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                To be the most recognized and trusted fit-out and construction company in Qatar, setting industry standards for quality, sustainability, and client satisfaction.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
