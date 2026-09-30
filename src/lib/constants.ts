import type { Category, SiteSettings } from './sanity/types';

export const WHATSAPP_NUMBER = "97433494880";

export const FALLBACK_CONTACT = {
  address: 'Doha, Qatar',
  phone: '+974 3349 4880',
  email: 'info@sncreatives.com',
};

/** Digits only — wa.me requires the international number without "+", spaces or dashes. */
export const toWhatsAppDigits = (value?: string | null) => value?.replace(/\D/g, '') ?? '';

/** Keeps only characters valid in a tel: URI. */
export const toTelHref = (value: string) => `tel:${value.replace(/[^\d+]/g, '')}`;

export const resolveWhatsAppNumber = (settings: SiteSettings | null, category?: Category) =>
  toWhatsAppDigits(category && settings?.serviceContacts?.[category]) ||
  toWhatsAppDigits(settings?.whatsappNumber) ||
  WHATSAPP_NUMBER;

export const resolveContact = (settings: SiteSettings | null) => ({
  address: settings?.address || FALLBACK_CONTACT.address,
  phone: settings?.phoneNumbers?.[0] || FALLBACK_CONTACT.phone,
  email: settings?.email || FALLBACK_CONTACT.email,
  whatsapp: resolveWhatsAppNumber(settings),
});
