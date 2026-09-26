export type Category = 'civil' | 'interior' | 'mechanical' | 'electrical' | 'plumbing';

export interface ProjectSummary {
  _id: string;
  title: string;
  slug: string;
  category: Category;
  location?: string;
  year?: number;
  imageUrl?: string;
}

export interface ProjectDetail extends ProjectSummary {
  client?: { name?: string } | null;
  /** Plain text per the schema; older imported documents may still hold Portable Text blocks. */
  description?: string | PortableTextBlock[] | null;
  gallery?: { _key?: string; url?: string }[] | null;
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
  photoUrl?: string;
  projectSlug?: string;
  projectName?: string;
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
