import { groq } from 'next-sanity';

const projectSummaryFields = groq`
  _id,
  title,
  "slug": slug.current,
  category,
  location,
  year,
  "imageUrl": coverImage.asset->url,
  "clientName": client->name,
  "excerpt": description
`;

// A review shows the person's name and photo when given, and falls back to the linked
// Client's name and logo. Older reviews have only the typed-in fields.
const reviewFields = groq`
  _id,
  "clientName": coalesce(clientName, client->name),
  "clientCompany": select(defined(clientName) && defined(client) => client->name, clientCompany),
  rating,
  reviewText,
  "photoUrl": coalesce(clientPhoto.asset->url, client->logo.asset->url),
  "photoIsLogo": !defined(clientPhoto.asset) && defined(client->logo.asset),
  "imageUrl": image.asset->url
`;

export const getAllProjects = groq`
  *[_type == "project" && defined(slug.current)] | order(year desc) {
    ${projectSummaryFields}
  }
`;

export const getFeaturedProjects = groq`
  *[_type == "project" && featured == true && defined(slug.current)] | order(year desc) {
    ${projectSummaryFields}
  }
`;

export const getProjectBySlug = groq`
  *[_type == "project" && slug.current == $slug][0] {
    ${projectSummaryFields},
    client->{name, "logoUrl": logo.asset->url},
    // Reviews belong to a client, not a project: the page shows the newest one from this project's client
    "review": *[_type == "review" && defined(client) && client._ref == ^.client._ref] | order(_createdAt desc)[0] { ${reviewFields} },
    description,
    gallery[] {
      _key,
      "url": asset->url
    }
  }
`;

export const getAllClients = groq`
  *[_type == "client"] | order(_createdAt asc) {
    _id,
    name,
    "logoUrl": logo.asset->url
  }
`;

export const getSiteSettings = groq`
  *[_type == "siteSettings"][0] {
    whatsappNumber,
    phoneNumbers,
    address,
    email,
    serviceContacts,
    instagramUrl,
    facebookUrl
  }
`;

export const getFeaturedReviews = groq`
  *[_type == "review" && featured == true] | order(_createdAt desc) {
    ${reviewFields}
  }
`;
