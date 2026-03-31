'use client';

import { useMemo, useState } from 'react';
import { passwordChecks, getPasswordFailures } from '@/lib/password-policy';

type Role = 'TENANT' | 'LANDLORD' | 'AGENT';

const ROLES: { value: Role; emoji: string; label: string; desc: string; badge?: string }[] = [
  { value: 'TENANT', emoji: '🏠', label: 'Tenant', desc: 'Find your perfect home' },
  { value: 'LANDLORD', emoji: '🔑', label: 'Landlord', desc: 'List & manage properties' },
  { value: 'AGENT', emoji: '🏢', label: 'Estate Agent', desc: 'Manage portfolio & tenants', badge: 'Premium' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('TENANT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordIssues = useMemo(() => getPasswordFailures(password), [password]);
  const passwordsMatch = password === confirmPassword || confirmPassword.length === 0;
  const canSubmit = !loading && passwordIssues.length === 0 && password.length > 0 && password === confirmPassword && !!name && !!email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (passwordIssues.length > 0) {
      setError('Password does not meet the requirements');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (res.ok) {
        window.location.href = role === 'TENANT' ? '/search' : '/dashboard';
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
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="12+ characters, mix of letters, numbers & symbols"
                  className={inputClass}
                />
                <div className="mt-2 rounded-xl bg-gray-50 border border-gray-100 p-3 text-xs text-gray-600 space-y-1">
                  {passwordChecks.map((rule) => (
                    <p key={rule.id} className={passwordIssues.includes(rule.label) ? 'text-gray-400' : 'text-gaff-teal font-medium'}>
                      {passwordIssues.includes(rule.label) ? '○' : '●'} {rule.label}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`${inputClass} ${!passwordsMatch ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`}
                />
                {!passwordsMatch && confirmPassword.length > 0 && (
                  <p className="text-xs text-red-500 mt-1">Passwords must match.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`relative py-3 px-2 rounded-lg border-2 text-center transition-colors ${
                        role === r.value
                          ? 'border-gaff-teal bg-gaff-teal/5 text-gaff-teal'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {r.badge && (
                        <span className="absolute -top-2 right-1 text-[10px] font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-white px-1.5 py-0.5 rounded-full">
                          {r.badge}
                        </span>
                      )}
                      <div className="text-lg">{r.emoji}</div>
                      <div className="text-xs font-semibold mt-1">{r.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pb-6">
                <div className="bg-white/95 md:bg-transparent md:backdrop-blur-0 backdrop-blur sticky bottom-0 left-0 right-0 md:static md:p-0 p-3 rounded-2xl shadow-sm md:shadow-none border border-gray-100/60 md:border-none">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full bg-gaff-teal text-white py-3 rounded-xl font-semibold hover:bg-gaff-teal-dark transition-colors disabled:opacity-50 shadow-lg shadow-gaff-teal/20"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                  <p className="mt-2 text-[11px] text-center text-gray-500">
                    By signing up, you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/auth/login" className="text-gaff-teal font-medium hover:underline">Sign in</a>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
