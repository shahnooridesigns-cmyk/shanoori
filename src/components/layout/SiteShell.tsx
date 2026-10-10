import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { BackToTop } from "@/components/shared/BackToTop";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { CursorEffects } from "@/components/shared/CursorEffects";
import { Preloader } from "@/components/shared/Preloader";
import { PageFlood } from "@/components/shared/PageFlood";
import { PageTransition } from "@/components/shared/PageTransition";
import { LocaleProvider } from "@/components/shared/LocaleProvider";
import { FALLBACK_CONTACT, resolveContact, resolveWhatsAppNumber } from "@/lib/constants";
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import { fetchSiteSettings } from "@/lib/sanity/fetch";
import { dirOf, type Locale } from "@/lib/locale";
import { setLocale } from "@/lib/locale.server";

/**
 * Everything around a page: header, footer, floating buttons, smooth scroll, and the language.
 * Used by both layouts, src/app/(site) for English and src/app/(ar) for Arabic. The wrapper
 * element carries lang and dir, so the Arabic site reads right to left.
 */
export async function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  // Before anything below renders, so server components (Footer, the page) see the language
  setLocale(locale);

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
    <LocaleProvider locale={locale}>
      <div lang={locale} dir={dirOf(locale)} data-locale={locale} className="flex min-h-full flex-1 flex-col">
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
      </div>
    </LocaleProvider>
  );
}
