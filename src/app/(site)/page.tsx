import { Hero } from "@/components/home/Hero";
import { AboutIntro } from "@/components/home/AboutIntro";
import { SelectedWork } from "@/components/home/SelectedWork";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustedBy } from "@/components/shared/TrustedBy";
import { FaqSection } from "@/components/shared/FaqSection";
import { CtaBanner } from "@/components/shared/CtaBanner";
import type { Metadata } from "next";
import { metaFor } from "@/lib/meta.server";

export const generateMetadata = (): Metadata => metaFor('home', '/');

export default function Home() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <Hero />
      {/* Above the pinned hero, so these sections slide up over its photo */}
      <div className="relative z-10 flex flex-col">
        <AboutIntro />
        <SelectedWork />
        <WhyChooseUs />
        <ServicesShowcase />
        {/* The client logos wait behind the process section, which scrolls away to uncover them.
            One box around both: the section after it holds the box in place and slides over the logos */}
        <div className="relative isolate flex flex-col">
          <Process />
          <TrustedBy reveal />
        </div>
        <Testimonials />
        <FaqSection />
        <CtaBanner />
      </div>
    </main>
  );
}
