export default function Footer() {
  const existingLinks = ['/search', '/auth/login', '/auth/register', '/dashboard', '/listing/new', '/about', '/contact', '/faq'];

  const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const exists = existingLinks.includes(href);
    if (exists) {
      return (
        <li>
          <a href={href} className="text-slate-600 hover:text-slate-900 transition-colors">
            {children}
          </a>
        </li>
      );
    }
    return (
      <li className="flex items-center gap-2">
        <span className="text-slate-500 cursor-default">{children}</span>
        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">Soon</span>
      </li>
    );
  };

  return (
    <footer className="bg-white text-slate-600 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gaff-teal to-gaff-teal-dark flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Gaff<span className="text-gaff-teal-light">.ie</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              Making housing in Ireland fair, transparent, and trustworthy. Every landlord verified. Every listing real.
            </p>
            {/* Social placeholders */}
            <div className="flex gap-3 mt-6">
              {['twitter', 'instagram', 'linkedin'].map((s) => (
                <span key={s} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 hover:bg-gaff-teal hover:text-white transition-colors cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s === 'twitter' && <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />}
                    {s === 'instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></>}
                    {s === 'linkedin' && <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>}
                  </svg>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold text-sm mb-4 uppercase tracking-wider">For Tenants</h4>
            <ul className="text-sm space-y-3">
              <FooterLink href="/search">Search properties</FooterLink>
              <FooterLink href="/auth/register">Get verified</FooterLink>
              <FooterLink href="/rights">Know your rights</FooterLink>
              <FooterLink href="/hap">HAP guide</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold text-sm mb-4 uppercase tracking-wider">For Landlords</h4>
            <ul className="text-sm space-y-3">
              <FooterLink href="/listing/new">List for free</FooterLink>
              <FooterLink href="/auth/register">Verify property</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/pricing">Premium plans</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold text-sm mb-4 uppercase tracking-wider">Company</h4>
            <ul className="text-sm space-y-3">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>© 2026 Gaff.ie. All rights reserved. Made in Ireland 🇮🇪</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Zero scam tolerance
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              GDPR protected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
