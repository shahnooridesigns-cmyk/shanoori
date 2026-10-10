import Link from 'next/link';

// Shown for any address that does not exist, in either language: the page cannot know which
// language the visitor was reading, so it says it in both.
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-beige px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-maroon/70">404</p>
      <h1 className="text-3xl font-semibold text-maroon md:text-5xl">Page not found</h1>
      <p className="max-w-md text-lg text-ink/70">The page you are looking for doesn&apos;t exist or has been moved.</p>
      <div lang="ar" dir="rtl" className="flex flex-col items-center gap-3">
        <p className="text-2xl font-semibold text-maroon md:text-3xl">الصفحة غير موجودة</p>
        <p className="max-w-md text-lg text-ink/70">الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="inline-flex items-center justify-center rounded-full bg-maroon px-8 py-3.5 font-semibold text-gold transition-opacity hover:opacity-90">
          Back to Home
        </Link>
        <Link href="/ar" lang="ar" dir="rtl" className="inline-flex items-center justify-center rounded-full border border-maroon px-8 py-3.5 font-semibold text-maroon transition-colors hover:bg-maroon hover:text-gold">
          العودة إلى الرئيسية
        </Link>
      </div>
    </main>
  );
}
