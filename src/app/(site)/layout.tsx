import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { FALLBACK_CONTACT, resolveWhatsAppNumber } from "@/lib/constants";
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

  return (
    <SmoothScrollProvider>
      <Header whatsapp={whatsapp} phones={phones.length ? phones : [FALLBACK_CONTACT.phone]} />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
      <WhatsAppButton variant="floating" phoneNumber={whatsapp} />
    </SmoothScrollProvider>
  );
}
