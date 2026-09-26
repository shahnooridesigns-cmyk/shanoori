import { groq } from 'next-sanity';

const projectSummaryFields = groq`
  _id,
  title,
  "slug": slug.current,
  category,
  location,
  year,
  "imageUrl": coverImage.asset->url,
  "clientName": client->name
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
    client->{name},
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
    _id,
    clientName,
    clientCompany,
    rating,
    reviewText,
    "photoUrl": clientPhoto.asset->url,
    "projectSlug": relatedProject->slug.current,
    "projectName": relatedProject->title
  }
`;
