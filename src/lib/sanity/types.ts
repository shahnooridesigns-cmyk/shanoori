export type Category = 'civil' | 'interior' | 'mechanical' | 'electrical' | 'plumbing';

export interface ProjectSummary {
  _id: string;
  title: string;
  slug: string;
  category: Category;
  /** Kind of place (retail, office, …); what the Projects page filters by */
  spaceType?: string | null;
  location?: string;
  year?: number;
  imageUrl?: string;
  clientName?: string;
  /** The description as stored; cards show its first paragraph */
  excerpt?: string | null;
  /** Arabic wording from the Studio, used on the Arabic site where filled in */
  titleAr?: string | null;
  locationAr?: string | null;
  descriptionAr?: string | null;
}

export interface ProjectDetail extends ProjectSummary {
  client?: { name?: string; logoUrl?: string } | null;
  review?: Review | null;
  /** Plain text per the schema; older imported documents may still hold Portable Text blocks. */
  description?: string | PortableTextBlock[] | null;
  gallery?: { _key?: string; url?: string; width?: number; height?: number }[] | null;
}

export interface PortableTextBlock {
  _type: string;
  children?: { text?: string }[];
}

export interface ClientLogo {
  _id: string;
  name: string;
  logoUrl?: string;
}

export interface Review {
  _id: string;
  clientName: string;
  clientCompany?: string;
  rating?: number;
  reviewText: string;
  /** Arabic wording from the Studio, used on the Arabic site where filled in */
  reviewTextAr?: string | null;
  clientNameAr?: string | null;
  photoUrl?: string;
  /** photoUrl is the client's logo (show it whole) rather than a person's photo (crop to a circle) */
  photoIsLogo?: boolean;
  /** Large photo for the testimonial card. Always the review's own, never a project's */
  imageUrl?: string;
}

export interface SiteSettings {
  whatsappNumber?: string;
  phoneNumbers?: string[];
  address?: string;
  email?: string;
  serviceContacts?: Partial<Record<Category, string>>;
  instagramUrl?: string;
  facebookUrl?: string;
}
