import type { Category, SiteSettings } from './sanity/types';

export const WHATSAPP_NUMBER = "97433494880";

export const FALLBACK_CONTACT = {
  address: 'Birkat Al Awamer, Qatar',
  phone: '+974 3349 4880',
  email: 'info@sncreatives.com',
};

/**
 * The office as Google Maps knows it: the "SHAH NOORI" listing in Birkat Al Awamer
 * (plus code 4F5V+M9H). The map and the directions link use this exact pin, whatever address
 * text is typed in the Studio.
 */
export const OFFICE_LOCATION = {
  latitude: 25.1091888,
  longitude: 51.4934765,
  plusCode: '4F5V+M9H',
  area: 'Birkat Al Awamer',
  /** The business page on Google Maps (reviews, photos, and its own Directions button) */
  mapsUrl:
    'https://www.google.com/maps/place/SHAH+NOORI/@25.1091888,51.4934765,17z/data=!4m6!3m5!1s0x3e45d300410674bf:0x617543858aee7f7b!8m2!3d25.1091888!4d51.4934765!16s%2Fg%2F11ldx3p0qr',
};

/** Google's map of the office, for an iframe */
export const officeMapEmbed = (locale: string) =>
  `https://www.google.com/maps?q=${OFFICE_LOCATION.latitude},${OFFICE_LOCATION.longitude}&z=16&hl=${locale}&output=embed`;

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

/** A wa.me link that opens a chat with the message already typed */
export const whatsAppHref = (phoneNumber: string | undefined, message: string) =>
  `https://wa.me/${toWhatsAppDigits(phoneNumber) || WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
