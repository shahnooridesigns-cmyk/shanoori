import React from 'react';
import Image from 'next/image';
import { Container } from '../shared/Container';
import Link from 'next/link';

export const Hero = () => {
  return (
    <section className="relative flex min-h-[80vh] items-center bg-primary-950 overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg"
          alt="Hero Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      
      <Container className="relative z-10 py-20">
        <div className="max-w-3xl flex flex-col gap-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Building Excellence <br/> Through Precision
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            Premium interior and fit-out services in Doha, Qatar. We transform spaces with unparalleled quality and design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-full bg-accent-300 px-8 py-3.5 font-semibold text-primary-950 transition-colors hover:bg-accent-400"
            >
              Get a Quote
            </Link>
            <Link 
              href="/projects" 
              className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-transparent px-8 py-3.5 font-semibold text-white transition-colors hover:bg-white/10 hover:border-white/50"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
