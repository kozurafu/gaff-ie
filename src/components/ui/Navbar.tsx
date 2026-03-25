'use client';

import { useState, useEffect } from 'react';

type UserRole = 'TENANT' | 'LANDLORD' | 'AGENT' | 'ADMIN';

interface User {
  id: string;
  name: string;
  role: UserRole;
}

const NAV_ITEMS: Record<UserRole, { href: string; label: string }[]> = {
  TENANT: [
    { href: '/search', label: 'Search' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
  LANDLORD: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/search', label: 'Search' },
    { href: '/listing/new', label: 'Add Property' },
  ],
  AGENT: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/tenants', label: 'Tenants' },
    { href: '/search', label: 'Search' },
    { href: '/listing/new', label: 'Add Property' },
  ],
  ADMIN: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/search', label: 'Search' },
  ],
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const navItems = user ? (NAV_ITEMS[user.role] || NAV_ITEMS.TENANT) : [{ href: '/search', label: 'Search' }];

  const AuthLinks = ({ mobile = false }: { mobile?: boolean }) => {
    const base = mobile ? 'block py-2 text-sm font-medium' : 'text-sm font-medium';
    if (loading) return null;

    if (user) {
      return (
        <>
          {mobile && navItems.map((item) => (
            <a key={item.href} href={item.href} className={`${base} text-gray-600 hover:text-gaff-teal transition-colors`}>
              {item.label}
            </a>
          ))}
          {!mobile && (
            <a href="/dashboard" className={`${base} text-gray-600 hover:text-gaff-teal transition-colors`}>
              Hi, {user.name.split(' ')[0]}
            </a>
          )}
          {mobile ? (
            <button onClick={handleLogout} className={`${base} text-gray-600 hover:text-gaff-teal text-left w-full`}>
              Logout
            </button>
          ) : (
            <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gaff-teal transition-colors">
              Logout
            </button>
          )}
        </>
      );
    }

    return (
      <>
        <a href="/auth/login" className={`${base} text-gray-600 hover:text-gaff-teal transition-colors`}>
          Sign In
        </a>
        {mobile ? (
          <a href="/auth/register" className="block text-center py-2.5 text-sm font-semibold bg-gaff-teal text-white rounded-lg">
            Sign Up
          </a>
        ) : (
          <a href="/auth/register" className="text-sm font-semibold bg-gaff-teal hover:bg-gaff-teal-dark text-white px-4 py-2 rounded-lg transition-colors">
            Sign Up
          </a>
        )}
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gaff-teal flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gaff-slate">
              Gaff<span className="text-gaff-teal">.ie</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-gray-600 hover:text-gaff-teal transition-colors">
                {item.label}
              </a>
            ))}
            <AuthLinks />
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            <AuthLinks mobile />
          </div>
        </div>
      )}
    </nav>
  );
}
