import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { BackToTop } from "@/components/shared/BackToTop";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { CursorEffects } from "@/components/shared/CursorEffects";
import { Preloader } from "@/components/shared/Preloader";
import { PageFlood } from "@/components/shared/PageFlood";
import { PageTransition } from "@/components/shared/PageTransition";
import { FALLBACK_CONTACT, resolveContact, resolveWhatsAppNumber } from "@/lib/constants";
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import { fetchSiteSettings } from "@/lib/sanity/fetch";

// Render per request so Sanity edits appear without a redeploy. Without this, the Sanity
// fetches run once at build time and the pages stay frozen. Responses come from the Sanity
// CDN in production, so this stays cheap and needs no ISR cache on Cloudflare.
export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSiteSettings();
  const whatsapp = resolveWhatsAppNumber(settings);
  // Ignore blank entries left in the Studio list
  const phones = (settings?.phoneNumbers ?? []).map((p) => p?.trim()).filter(Boolean);

  // Tells search engines who the business is: name, place, contact and what it does
  const contact = resolveContact(settings);
  const business = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}${SHARE_IMAGE}`,
    description: "Interior fit-out, MEP and civil contracting company in Doha, Qatar.",
    telephone: contact.phone,
    email: contact.email,
    address: { "@type": "PostalAddress", streetAddress: contact.address, addressLocality: "Doha", addressCountry: "QA" },
    areaServed: { "@type": "Country", name: "Qatar" },
    knowsAbout: ["Interior fit-out", "MEP works", "Mechanical works", "Electrical works", "Plumbing", "Civil construction"],
    sameAs: [settings?.instagramUrl, settings?.facebookUrl].filter(Boolean),
  };

  return (
    <SmoothScrollProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }}
      />
      <Preloader />
      <Header whatsapp={whatsapp} phones={phones.length ? phones : [FALLBACK_CONTACT.phone]} />
      <div className="scroll-titles flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
      <BackToTop />
      <WhatsAppButton variant="floating" phoneNumber={whatsapp} />
      <CursorEffects />
      <PageFlood />
      <PageTransition />
    </SmoothScrollProvider>
  );
}
