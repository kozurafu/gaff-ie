import SearchBar from "@/components/ui/SearchBar";
import ListingCard from "@/components/ui/ListingCard";

const sampleListings = [
  {
    id: "1", price: 2200, bedrooms: 2, bathrooms: 1, sqft: 850,
    address: "12 Ranelagh Road", area: "Ranelagh, Dublin 6",
    image: "/placeholder-1.jpg", verified: true, hapWelcome: true,
    timeAgo: "2 days ago", propertyType: "Apartment",
  },
  {
    id: "2", price: 1650, bedrooms: 1, bathrooms: 1, sqft: 450,
    address: "Apt 4, Grand Canal Square", area: "Grand Canal Dock, Dublin 2",
    image: "/placeholder-2.jpg", verified: true, hapWelcome: false,
    timeAgo: "1 day ago", propertyType: "Studio",
  },
  {
    id: "3", price: 2800, bedrooms: 3, bathrooms: 2, sqft: 1200,
    address: "45 Drumcondra Road Upper", area: "Drumcondra, Dublin 9",
    image: "/placeholder-3.jpg", verified: true, hapWelcome: true,
    timeAgo: "5 days ago", propertyType: "House",
  },
];

const locations = [
  { name: "Dublin", count: "1,200+", gradient: "from-gaff-teal/70 to-gaff-teal-dark/80" },
  { name: "Cork", count: "340+", gradient: "from-emerald-500/70 to-emerald-700/80" },
  { name: "Galway", count: "180+", gradient: "from-blue-500/70 to-blue-700/80" },
  { name: "Limerick", count: "150+", gradient: "from-violet-500/70 to-violet-700/80" },
  { name: "Waterford", count: "90+", gradient: "from-amber-500/70 to-amber-700/80" },
  { name: "Kilkenny", count: "60+", gradient: "from-rose-500/70 to-rose-700/80" },
];

const differentiators = [
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>),
    title: "Every Landlord Verified",
    description: "Government ID + property ownership checked before any listing goes live.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>),
    title: "Free to List",
    description: "Basic listings are free forever. No €135+ fees like other platforms.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M8 9h8M8 13h4"/></svg>),
    title: "Messages That Work",
    description: "Real-time messaging with read receipts. No more ghosting.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4M12 16h.01"/></svg>),
    title: "AI Scam Detection",
    description: "Fake listings caught automatically. Stock photos and pricing anomalies flagged instantly.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero — search-first like Daft */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gaff-slate" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,148,136,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(217,119,6,0.06),transparent_60%)]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-16 pb-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            Find your next{' '}
            <span className="bg-gradient-to-r from-gaff-teal-light to-gaff-teal bg-clip-text text-transparent">gaff</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-lg mx-auto">
            Ireland&apos;s verified property platform. Every landlord checked, every listing real.
          </p>

          {/* Search tabs + bar — like Daft's rent/buy/share */}
          <SearchBar variant="hero" />
        </div>
      </section>

      {/* Browse by location — like Daft's popular areas */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gaff-slate mb-2">Browse by location</h2>
          <p className="text-gray-500 text-sm mb-8">Verified properties across Ireland</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {locations.map((loc) => (
              <a
                key={loc.name}
                href={`/search?location=${loc.name}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] flex items-end"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${loc.gradient} group-hover:scale-105 transition-transform duration-300`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="relative z-10 p-3 w-full">
                  <div className="text-white font-semibold text-sm">{loc.name}</div>
                  <div className="text-white/70 text-xs">{loc.count} properties</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Latest listings — like Daft's featured */}
      <section className="py-16 px-4 bg-gaff-warm bg-pattern">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gaff-slate">Latest verified listings</h2>
              <p className="text-gray-500 text-sm mt-1">Real properties from verified landlords</p>
            </div>
            <a href="/search" className="text-gaff-teal font-semibold text-sm hover:text-gaff-teal-dark flex items-center gap-1 shrink-0">
              View all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Gaff — trust signals */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gaff-slate text-center mb-10">Why Gaff.ie?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((d, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gaff-teal-50 text-gaff-teal flex items-center justify-center mx-auto mb-4">
                  {d.icon}
                </div>
                <h3 className="text-sm font-semibold text-gaff-slate mb-1.5">{d.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-12 px-4 bg-gaff-slate">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "100%", label: "Landlords Verified" },
            { num: "€0", label: "To List a Property" },
            { num: "< 4hr", label: "Support Response" },
            { num: "0", label: "Scam Reports" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-bold text-gaff-teal-light">{s.num}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-gaff-teal to-gaff-teal-dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to find your gaff?
          </h2>
          <p className="text-white/70 mb-8">
            Whether you&apos;re searching or listing — it&apos;s free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/search" className="bg-white text-gaff-teal font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors shadow-lg">
              Start searching
            </a>
            <a href="/listing/new" className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              List your property
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
