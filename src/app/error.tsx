'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gaff-slate mb-3">Something went wrong</h2>
        <p className="text-gaff-slate-600 mb-8">
          An unexpected error occurred. Please try again or contact us if the problem persists.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-gaff-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-gaff-teal-dark"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
