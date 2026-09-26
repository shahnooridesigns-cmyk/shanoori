import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ClientsStrip } from "@/components/home/ClientsStrip";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Reviews } from "@/components/home/Reviews";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <Hero />
      <WhyChooseUs />
      <ClientsStrip />
      <ServicesPreview />
      <FeaturedProjects />
      <Reviews />
      <CTASection />
    </main>
  );
}
