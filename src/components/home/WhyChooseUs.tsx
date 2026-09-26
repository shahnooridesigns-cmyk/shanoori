import React from 'react';
import { Container } from '../shared/Container';

const reasons = [
  { title: 'Expert Team', description: 'Highly qualified professionals with years of industry experience.' },
  { title: 'Quality Materials', description: 'We source only the finest materials for a lasting finish.' },
  { title: 'Timely Delivery', description: 'Strict adherence to project timelines without compromising quality.' }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Why Choose Us</h2>
            <p className="text-foreground/70 text-lg">
              We are committed to delivering exceptional quality and service in every project we undertake.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, idx) => (
              <div key={idx} className="bg-primary-50 p-8 rounded-2xl border border-primary-100 flex flex-col gap-4 text-center md:text-left transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary-900 rounded-full flex items-center justify-center text-accent-300 font-bold text-xl mb-2 mx-auto md:mx-0">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-primary-900">{reason.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
