import SearchBar from "@/components/ui/SearchBar";
import ListingCard from "@/components/ui/ListingCard";

const sampleListings = [
  {
    id: "1",
    price: 2200,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    address: "12 Ranelagh Road",
    area: "Ranelagh, Dublin 6",
    image: "/placeholder-1.jpg",
    verified: true,
    hapWelcome: true,
    timeAgo: "2 days ago",
    propertyType: "Apartment",
  },
  {
    id: "2",
    price: 1650,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 450,
    address: "Apt 4, Grand Canal Square",
    area: "Grand Canal Dock, Dublin 2",
    image: "/placeholder-2.jpg",
    verified: true,
    hapWelcome: false,
    timeAgo: "1 day ago",
    propertyType: "Studio",
  },
  {
    id: "3",
    price: 2800,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    address: "45 Drumcondra Road Upper",
    area: "Drumcondra, Dublin 9",
    image: "/placeholder-3.jpg",
    verified: true,
    hapWelcome: true,
    timeAgo: "5 days ago",
    propertyType: "House",
  },
];

const differentiators = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: "Every Landlord Verified",
    description: "Government ID + property ownership checked. No fake listings, no scams.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>
      </svg>
    ),
    title: "Free to List",
    description: "Basic listings are free forever. No €135+ fees like other platforms.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        <path d="M8 9h8M8 13h4"/>
      </svg>
    ),
    title: "Messages That Work",
    description: "Real-time messaging with read receipts. Every enquiry gets seen.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 014 4c0 1.95-2 4-4 6-2-2-4-4.05-4-6a4 4 0 014-4z"/><path d="M12 12v10"/><path d="M8 15l4-3 4 3"/><path d="M6 19l6-4 6 4"/>
      </svg>
    ),
    title: "AI Scam Detection",
    description: "Fake listings caught automatically. Stock photos, pricing anomalies — flagged instantly.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    ),
    title: "Smart Matching",
    description: "AI matches you to properties based on budget, commute, and lifestyle.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    title: "Real Customer Support",
    description: "Live chat, 4-hour email SLA, phone callbacks. Actual humans who help.",
  },
];

const steps = [
  {
    num: "1",
    title: "Search",
    desc: "Browse verified listings or let our AI match you to your perfect gaff.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    ),
  },
  {
    num: "2",
    title: "Verify",
    desc: "Get your verified badge — prove you're real, stand out from the crowd.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    ),
  },
  {
    num: "3",
    title: "Connect",
    desc: "Message landlords directly. Read receipts mean no more ghosting.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
    ),
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gaff-slate via-gaff-slate-light to-gaff-slate animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,148,136,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(217,119,6,0.08),transparent_50%)]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center py-20">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 text-gaff-teal-light text-sm font-medium bg-gaff-teal/10 px-4 py-1.5 rounded-full mb-8 border border-gaff-teal/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Ireland&apos;s first verified property platform
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up tracking-tight">
            Find your next{' '}
            <span className="bg-gradient-to-r from-gaff-teal-light to-gaff-teal bg-clip-text text-transparent">
              gaff
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '100ms' }}>
            Every landlord checked. Every listing real. Every message delivered.
            <br className="hidden sm:block" />
            <span className="text-gray-500">The property platform Ireland actually deserves.</span>
          </p>
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto py-6 px-4">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-gaff-slate-600">
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: 'Every landlord verified' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>, text: 'Free to list' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M18 6L6 18"/></svg>, text: 'Zero scam tolerance' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, text: 'Messages that work' },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-gaff-slate-600/70 font-medium">
                <span className="text-gaff-teal">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Gaff */}
      <section className="py-24 px-4 bg-gaff-warm bg-pattern">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gaff-teal text-sm font-semibold uppercase tracking-widest">Why Gaff</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gaff-slate mt-3 mb-4">
              Built different, on purpose
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              We built the property platform Ireland actually deserves. No compromises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {differentiators.map((d, i) => (
              <div
                key={i}
                className="gradient-border bg-white rounded-2xl p-7 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-gray-100/80"
              >
                <div className="w-12 h-12 rounded-xl bg-gaff-teal-50 text-gaff-teal flex items-center justify-center mb-5">
                  {d.icon}
                </div>
                <h3 className="text-lg font-semibold text-gaff-slate mb-2">{d.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gaff-teal text-sm font-semibold uppercase tracking-widest">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gaff-slate mt-3">
              Three steps to your new home
            </h2>
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-gaff-teal/20 via-gaff-teal/40 to-gaff-teal/20" />
            <div className="grid grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <div key={s.num} className="text-center relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-gaff-teal to-gaff-teal-dark text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md relative z-10">
                    {s.icon}
                  </div>
                  <span className="text-xs font-bold text-gaff-teal uppercase tracking-widest">Step {s.num}</span>
                  <h3 className="text-xl font-bold text-gaff-slate mt-2 mb-3">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden relative pl-12">
            {/* Vertical line */}
            <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-gaff-teal/40 via-gaff-teal/20 to-gaff-teal/40" />
            <div className="space-y-10">
              {steps.map((s) => (
                <div key={s.num} className="relative">
                  <div className="absolute -left-12 top-0 w-10 h-10 bg-gradient-to-br from-gaff-teal to-gaff-teal-dark text-white rounded-xl flex items-center justify-center shadow-sm text-sm">
                    {s.icon}
                  </div>
                  <span className="text-xs font-bold text-gaff-teal uppercase tracking-widest">Step {s.num}</span>
                  <h3 className="text-lg font-bold text-gaff-slate mt-1 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 px-4 bg-gaff-warm bg-pattern">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <span className="text-gaff-teal text-sm font-semibold uppercase tracking-widest">Featured</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gaff-slate mt-3">
                Latest verified listings
              </h2>
              <p className="text-gray-500 mt-2">Real properties from verified landlords in Dublin</p>
            </div>
            <a href="/search" className="text-gaff-teal font-semibold text-sm hover:text-gaff-teal-dark flex items-center gap-1 shrink-0">
              View all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gaff-slate relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.08),transparent_70%)]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "2,000+", label: "Verified Listings" },
              { num: "500+", label: "Verified Landlords" },
              { num: "< 4hr", label: "Support Response" },
              { num: "0", label: "Scam Reports" },
            ].map((s, i) => (
              <div key={i} className="group">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gaff-teal-light to-gaff-teal bg-clip-text text-transparent mb-2">
                  {s.num}
                </div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gaff-teal via-gaff-teal-dark to-gaff-slate animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to find your gaff?
          </h2>
          <p className="text-white/70 mb-10 text-lg leading-relaxed">
            Whether you&apos;re searching for a home or listing a property — it&apos;s free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/search" className="bg-white text-gaff-teal font-semibold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Start searching
            </a>
            <a href="/listing/new" className="border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              List your property — free
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
