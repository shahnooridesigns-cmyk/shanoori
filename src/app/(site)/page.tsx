import { Hero } from "@/components/home/Hero";
import { AboutIntro } from "@/components/home/AboutIntro";
import { SelectedWork } from "@/components/home/SelectedWork";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqSection } from "@/components/shared/FaqSection";
import { CtaBanner } from "@/components/shared/CtaBanner";

export default function Home() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <Hero />
      <AboutIntro />
      <SelectedWork />
      <WhyChooseUs />
      <ServicesShowcase />
      <Process />
      <Testimonials />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
