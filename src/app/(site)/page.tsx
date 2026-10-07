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
        <Process />
        <TrustedBy />
        <Testimonials />
        <FaqSection />
        <CtaBanner />
      </div>
    </main>
  );
}
