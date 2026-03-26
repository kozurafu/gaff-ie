'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = '/search';
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Invalid email or password');
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
    <>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gaff-warm">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gaff-slate">Welcome back</h1>
            <p className="text-gray-500 mt-2">Sign in to your Gaff.ie account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <div className="text-right mt-1">
                  <a href="/auth/forgot-password" className="text-xs text-gaff-teal hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gaff-teal text-white py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <a href="/auth/register" className="text-gaff-teal font-medium hover:underline">
                Sign up for free
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>🛡️ Verified platform</span>
              <span>•</span>
              <span>🔒 Secure login</span>
              <span>•</span>
              <span>🇮🇪 Made in Ireland</span>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
