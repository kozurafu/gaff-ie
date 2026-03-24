'use client';

import { useState } from 'react';
import Footer from '@/components/ui/Footer';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (res.ok) {
        window.location.href = '/search';
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Registration failed. Please try again.');
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
            <h1 className="text-3xl font-bold text-gaff-slate">Create your account</h1>
            <p className="text-gray-500 mt-2">Join Ireland&apos;s most trusted property platform</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Seán Murphy" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['tenant', 'landlord'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3 rounded-lg border-2 text-sm font-semibold capitalize transition-colors ${
                        role === r
                          ? 'border-gaff-teal bg-gaff-teal/5 text-gaff-teal'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {r === 'tenant' ? '🏠 Tenant' : '🔑 Landlord'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gaff-teal text-white py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-4 text-xs text-gray-400 text-center">
              By signing up, you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
            </p>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/auth/login" className="text-gaff-teal font-medium hover:underline">Sign in</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
