'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface User {
  id: string;
  name: string;
  role: string;
}

const NAV_LINKS = [
  { href: '/search?listingType=rent', label: 'Rent', value: 'rent' },
  { href: '/search?listingType=sale', label: 'Buy', value: 'sale' },
  { href: '/search?listingType=share', label: 'Share', value: 'share' },
];

function getDashboardLabel(role: string): string {
  switch (role) {
    case 'LANDLORD':
      return 'My Properties';
    case 'AGENT':
      return 'Portfolio';
    default:
      return 'My Dashboard';
  }
}

const glassNav = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[76px]';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [closing, setClosing] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      fetch('/api/messages/unread')
        .then((r) => (r.ok ? r.json() : { count: 0 }))
        .then((d) => setUnreadCount(d.count ?? 0))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) closeMenu();
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 220);
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
  const activeListingType = searchParams?.get('listingType');

  const navStateClass = scrolled
    ? 'bg-[rgba(6,8,16,0.85)] border border-white/5 shadow-[0_20px_60px_rgba(3,8,20,0.55)] backdrop-blur-2xl'
    : 'bg-[rgba(6,8,16,0.55)] border border-white/5 backdrop-blur-2xl shadow-[0_25px_60px_rgba(5,6,10,0.45)]';

  return (
    <>
      <div className={`sticky top-3 z-50 px-4 transition-all ${scrolled ? 'scale-[0.99]' : 'scale-100'}`}>
        <div className={`${navStateClass} rounded-3xl`}
        >
          <div className={glassNav}>
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6B11EE] to-[#2575FC] flex items-center justify-center shadow-[0_10px_30px_rgba(104,57,255,0.55)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M3 10l9-7 9 7v9a3 3 0 01-3 3H6a3 3 0 01-3-3z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-lg leading-4 tracking-tight">Gaff<span className="text-[#00F0FF]">.ie</span></p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Verified Living</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === '/search' && activeListingType === link.value;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-inner'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {!loading && user ? (
                <>
                  {(user.role === 'LANDLORD' || user.role === 'AGENT') && (
                    <Link href="/listing/new" className="text-white/70 hover:text-white text-sm font-medium">
                      List property
                    </Link>
                  )}
                  <Link href="/messages" className="relative p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4D6D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/80 hover:border-white/30"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-white/70">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0CE6FF] to-[#6B11EE] text-white font-semibold text-sm flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 top-14 w-64 glass-panel p-3 text-white animate-fade-in">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6B11EE] to-[#2575FC] text-white font-semibold flex items-center justify-center">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-xs text-white/60 capitalize">{user.role.toLowerCase()}</p>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-white/80">
                          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-white/5">
                            <span className="text-base">🏛️</span>
                            {dashboardLabel}
                          </Link>
                          <Link href="/messages" className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-white/5">
                            <span className="text-base">💬</span>
                            Messages
                            {unreadCount > 0 && <span className="ml-auto text-[10px] bg-white/15 px-2 py-0.5 rounded-full">{unreadCount}</span>}
                          </Link>
                          {(user.role === 'LANDLORD' || user.role === 'AGENT') && (
                            <Link href="/listing/new" className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-white/5">
                              <span className="text-base">➕</span>
                              Place Ad
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 rounded-2xl text-red-300 hover:bg-red-500/10 w-full"
                          >
                            <span>⏻</span>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : !loading ? (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login" className="ghost-pill text-sm font-semibold">Sign in</Link>
                  <Link href="/auth/register" className="neon-button text-sm">
                    Join the waitlist
                  </Link>
                </div>
              ) : null}
            </div>

            <div className="flex md:hidden items-center gap-2">
              {!loading && user && (
                <Link href="/messages" className="relative p-2 rounded-2xl bg-white/10 text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4D6D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                className="p-2 rounded-2xl bg-white/10 text-white"
                onClick={() => (menuOpen ? closeMenu() : openMenu())}
                aria-label="Toggle menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen && !closing ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={closeMenu} />
          <div
            className={`absolute right-0 top-0 bottom-0 w-[300px] glass-panel rounded-none rounded-l-3xl p-6 text-white transition-transform duration-300 ease-out ${closing ? 'translate-x-full' : 'translate-x-0'}`}
          >
            {!loading && user && (
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B11EE] to-[#2575FC] text-white font-semibold flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-white/60 capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="block px-4 py-3 rounded-2xl bg-white/5 text-sm font-semibold">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-white/10 my-5" />
            {!loading && user ? (
              <div className="space-y-2 text-sm">
                <Link href="/dashboard" className="block px-4 py-3 rounded-2xl bg-white/5">
                  {dashboardLabel}
                </Link>
                <Link href="/messages" className="block px-4 py-3 rounded-2xl bg-white/5">
                  Messages
                </Link>
                {(user.role === 'LANDLORD' || user.role === 'AGENT') && (
                  <Link href="/listing/new" className="block px-4 py-3 rounded-2xl bg-white/5">
                    Place Ad
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full px-4 py-3 rounded-2xl bg-red-500/20 text-red-200 font-semibold">
                  Sign Out
                </button>
              </div>
            ) : !loading ? (
              <div className="space-y-3">
                <Link href="/auth/login" className="block text-center ghost-pill">
                  Sign In
                </Link>
                <Link href="/auth/register" className="block text-center neon-button">
                  Create account
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
