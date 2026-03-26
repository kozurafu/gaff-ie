'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccess(true);
      } else {
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

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gaff-warm">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gaff-slate mb-2">Invalid reset link</h1>
            <p className="text-gray-500 text-sm mb-4">This link is missing the reset token.</p>
            <a href="/auth/forgot-password" className="text-gaff-teal font-medium hover:underline text-sm">
              Request a new reset link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gaff-warm">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gaff-slate">Set new password</h1>
          <p className="text-gray-500 mt-2">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">✅</div>
              <p className="text-gray-600 text-sm">Your password has been reset successfully.</p>
              <a
                href="/auth/login"
                className="inline-block bg-gaff-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors"
              >
                Sign in with new password
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gaff-teal text-white py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-gaff-warm">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
