// Page changes are animated by components/shared/PageTransition.tsx (shutters) and, from the
// closing banner, components/shared/PageFlood.tsx. The template only re-mounts the page.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return children;
}
