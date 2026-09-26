import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent-700">404</p>
      <h1 className="text-3xl md:text-5xl font-bold text-primary-900">Page not found</h1>
      <p className="text-lg text-foreground/70 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-primary-900 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-primary-800"
      >
        Back to Home
      </Link>
    </main>
  );
}
