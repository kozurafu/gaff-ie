'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  role: string;
}

const NAV_LINKS = [
  { href: '/search?listingType=rent', label: 'Rent' },
  { href: '/search?listingType=sale', label: 'Buy' },
  { href: '/search?listingType=share', label: 'Share' },
];

function getDashboardLabel(role: string): string {
  switch (role) {
    case 'LANDLORD': return 'My Properties';
    case 'AGENT': return 'Portfolio';
    default: return 'My Dashboard';
  }
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [closing, setClosing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = () => {
      fetch('/api/messages/unread').then(r => r.ok ? r.json() : { count: 0 }).then(d => setUnreadCount(d.count ?? 0)).catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) closeMenu();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 250);
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    setClosing(false);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const dashboardLabel = user ? getDashboardLabel(user.role) : 'Dashboard';

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-gray-100/50'
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gaff-teal to-gaff-teal-dark flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gaff-slate tracking-tight">
                Gaff<span className="text-gaff-teal">.ie</span>
              </span>
            </a>

            {/* Center nav — category tabs (desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname === '/search' && typeof window !== 'undefined' && new URL(window.location.href).searchParams.get('listingType') === link.label.toLowerCase()
                      ? 'bg-gaff-teal-50 text-gaff-teal'
                      : 'text-gaff-slate-600 hover:bg-gray-50 hover:text-gaff-slate'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {!loading && user ? (
                <>
                  {(user.role === 'LANDLORD' || user.role === 'AGENT') && (
                    <a href="/listing/new" className="text-sm font-medium text-gaff-slate-600 hover:text-gaff-teal transition-colors">
                      Place Ad
                    </a>
                  )}
                  <a href="/messages" className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors text-gaff-slate-600 hover:text-gaff-teal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gaff-teal text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </a>
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gaff-teal to-gaff-teal-dark text-white font-semibold text-xs flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    {dropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-slide-down">
                          <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-sm font-semibold text-gaff-slate truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                          </div>
                          <a href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gaff-slate-600 hover:bg-gray-50">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                            {dashboardLabel}
                          </a>
                          <a href="/messages" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gaff-slate-600 hover:bg-gray-50">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                            Messages{unreadCount > 0 && <span className="ml-auto bg-gaff-teal text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                          </a>
                          {(user.role === 'LANDLORD' || user.role === 'AGENT') && (
                            <a href="/listing/new" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gaff-slate-600 hover:bg-gray-50">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                              Place Ad
                            </a>
                          )}
                          <div className="border-t border-gray-50 mt-1 pt-1">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : !loading ? (
                <>
                  <a href="/auth/login" className="text-sm font-medium text-gaff-slate-600 hover:text-gaff-teal transition-colors">
                    Sign In
                  </a>
                  <a href="/auth/register" className="text-sm font-semibold bg-gaff-teal hover:bg-gaff-teal-dark text-white px-5 py-2 rounded-lg transition-colors">
                    Sign Up
                  </a>
                </>
              ) : null}
            </div>

            {/* Mobile: messages icon + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              {!loading && user && (
                <a href="/messages" className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors text-gaff-slate-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gaff-teal text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </a>
              )}
              <button
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => menuOpen ? closeMenu() : openMenu()}
                aria-label="Toggle menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen && !closing ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in panel */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeMenu}>
          <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-250 ${closing ? 'opacity-0' : 'opacity-100'}`} />
          <div
            className={`absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-250 ease-out ${closing ? 'translate-x-full' : 'translate-x-0 animate-slide-in-right'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button onClick={closeMenu} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User info header (when logged in) */}
            {!loading && user && (
              <div className="px-6 pb-4 mb-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gaff-teal to-gaff-teal-dark text-white font-semibold text-sm flex items-center justify-center shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gaff-slate truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-4 space-y-1">
              {/* Category links */}
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-gaff-slate-600 hover:bg-gray-50 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  {link.label}
                </a>
              ))}

              <div className="border-t border-gray-100 my-3" />

              {!loading && user ? (
                <>
                  <a href="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gaff-slate-600 hover:bg-gray-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                    {dashboardLabel}
                  </a>
                  <a href="/messages" className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gaff-slate-600 hover:bg-gray-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    Messages
                    {unreadCount > 0 && <span className="ml-auto bg-gaff-teal text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
                  </a>
                  {(user.role === 'LANDLORD' || user.role === 'AGENT') && (
                    <a href="/listing/new" className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gaff-slate-600 hover:bg-gray-50 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                      Place Ad
                    </a>
                  )}
                  <div className="border-t border-gray-100 my-3" />
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    Sign Out
                  </button>
                </>
              ) : !loading ? (
                <>
                  <a href="/auth/login" className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gaff-slate-600 hover:bg-gray-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                    Sign In
                  </a>
                  <a href="/auth/register" className="block mx-3 mt-3 text-center py-3 text-sm font-semibold bg-gaff-teal hover:bg-gaff-teal-dark text-white rounded-lg transition-colors">
                    Sign Up
                  </a>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
