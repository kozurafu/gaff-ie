'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gaff-teal/40 focus:border-gaff-teal';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gaff-warm">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gaff-slate">Reset your password</h1>
          <p className="text-gray-500 mt-2">
            {sent ? 'Check your email for a reset link' : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">📧</div>
              <p className="text-gray-600 text-sm">
                If an account with <strong>{email}</strong> exists, we&apos;ve sent a password reset link.
                The link expires in 1 hour.
              </p>
              <a
                href="/auth/login"
                className="inline-block mt-4 text-gaff-teal font-medium hover:underline text-sm"
              >
                ← Back to login
              </a>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gaff-teal text-white py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                Remember your password?{' '}
                <a href="/auth/login" className="text-gaff-teal font-medium hover:underline">
                  Sign in
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
