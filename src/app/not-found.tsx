import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gaff-teal mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gaff-slate mb-3">Page not found</h2>
        <p className="text-gaff-slate-600 mb-8">
          Sorry, we couldn&apos;t find what you&apos;re looking for. The page may have been moved or removed.
        </p>
        <Link
          href="/"
          className="inline-block bg-gaff-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-gaff-teal-dark"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
