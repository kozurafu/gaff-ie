import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import ListingCard from "@/components/ui/ListingCard";

interface Listing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number | null;
  address: string;
  city: string;
  county: string;
  propertyType: string;
  listingType: string;
  verified: boolean;
  hapWelcome: boolean;
  images: string[];
  createdAt: string;
}

async function getListings(): Promise<Listing[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/listings?limit=6`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.listings || [];
  } catch {
    return [];
  }
}

const stats = [
  { value: "100%", label: "Identity-verified landlords" },
  { value: "<4m", label: "Median response time" },
  { value: "12 AI", label: "Signals per listing" },
  { value: "0", label: "Unverified scams published" },
];

const trustSignals = [
  {
    title: "Vision-grade glass UI",
    body: "Layered glass surfaces and neon cues guide renters through verified data without friction.",
  },
  {
    title: "AI match guidance",
    body: "Smart scoring surfaces listings aligned with your budget, commute, pets + HAP requirements in real time.",
  },
  {
    title: "Viewing OS",
    body: "Schedule, confirm, and re-plan viewings inside a glass dashboard with live agent availability.",
  },
];

const roadmap = [
  {
    title: "Hyper-personal feed",
    detail: "Tenant preference graph + AI scoring pipeline",
  },
  {
    title: "Spatial trust score",
    detail: "Real-time badge for response speed, verified docs, scam flags",
  },
  {
    title: "3D listing tours",
    detail: "Spline scenes + p5.js particle auras for each property",
  },
];

export default async function Home() {
  const listings = await getListings();

  return (
    <main className="relative overflow-hidden pb-24">
      <section className="relative pt-32 pb-24 hero-gradient">
        <div className="noise-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs uppercase tracking-[0.2em] text-white/70">
              Ireland’s verification-first property OS
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
              <span className="text-white/80">Trustworthy homes,</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B11EE] to-[#2575FC]">curated by AI.</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Gaff.ie blends verification, matching, and spatial UI to make renting, buying, and managing property feel like a command
              center—not a classifieds maze.
            </p>
            <div className="glass-panel p-4">
              <SearchBar variant="hero" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/listing/new" className="neon-button text-base">
                List your property
              </Link>
              <Link href="/search" className="ghost-pill text-base">
                Explore live listings
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white/80">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel p-4 text-center">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-[#0CE6FF] via-[#6B11EE] to-[#FF4D6D] opacity-70 blur-3xl" />
            <div className="glass-panel relative p-8 rounded-[40px] h-full">
              <div className="floating">
                <p className="text-xs text-white/60 uppercase tracking-[0.3em] mb-6">Live platform telemetry</p>
                <div className="space-y-4">
                  {roadmap.map((item) => (
                    <div key={item.title} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-sm text-white/60">{item.detail}</p>
                      <p className="text-lg font-semibold text-white">{item.title}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <p className="text-xs text-white/60 mb-2">Realtime signals</p>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                    <p className="text-sm text-white/80">Scam net active · AI matches recalculating every 60s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="glass-panel p-6 lg:p-8 rounded-4xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">How it works</p>
              <h2 className="text-3xl font-semibold text-white">A spatial workflow for every role</h2>
              <p className="text-white/70 max-w-2xl">
                Tenants craft preference profiles, our AI matches real listings, landlords verify identity + listings, and agents orchestrate portfolios inside a glass dashboard with messaging, analytics, and viewing scheduler.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {[
                { title: 'Tenant', desc: 'AI preference graph + instant matches' },
                { title: 'Landlord', desc: 'Identity verification + listing analytics' },
                { title: 'Agent', desc: 'Command center with bulk messaging + viewings' },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 rounded-3xl border border-white/10 p-4 text-white/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">{item.title}</p>
                  <p className="text-base font-semibold text-white">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {listings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Live marketplace</p>
              <h2 className="text-3xl font-semibold text-white">Listings with built-in trust</h2>
              <p className="text-white/60">Every card is a verified landlord, AI match score, and scam detection summary.</p>
            </div>
            <Link href="/search" className="ghost-pill">
              Browse all listings
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                image={listing.images?.[0] || ""}
                price={listing.price}
                bedrooms={listing.bedrooms}
                bathrooms={listing.bathrooms}
                sqft={listing.area || undefined}
                address={listing.title || listing.address}
                area={`${listing.city}, ${listing.county}`}
                verified={listing.verified}
                hapWelcome={listing.hapWelcome}
                timeAgo="Live"
                propertyType={listing.propertyType}
                createdAt={listing.createdAt}
              />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 grid lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Verification layer</p>
          <h3 className="text-3xl text-white font-semibold">AI + humans double-check every moment</h3>
          <ul className="space-y-4 text-white/70">
            <li>• Real-time ID + property ownership verification</li>
            <li>• Scam detection scanning imagery, pricing anomalies, IP reputation</li>
            <li>• Viewing scheduler with attendance logging + trust score impact</li>
          </ul>
          <div className="flex gap-4">
            <div>
              <p className="text-4xl font-semibold text-[#00F0FF]">78</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">signals per landlord</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-white">0</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">live scam reports</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {trustSignals.map((signal) => (
            <div key={signal.title} className="bg-white/5 rounded-3xl border border-white/10 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">{signal.title}</p>
              <p className="text-lg text-white font-semibold">{signal.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="glass-panel p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Future signal</p>
          <h3 className="text-4xl text-white font-semibold mb-4">Feels like a spatial OS for property intelligence.</h3>
          <p className="text-white/70 max-w-3xl mx-auto mb-8">
            From aurora gradients to Spline heroes and p5.js signal noise, Gaff.ie brings immersive calm to housing. Join the operators who want speed, trust, and beauty in the same window.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/register" className="neon-button">
              Activate your workspace
            </Link>
            <Link href="/contact" className="ghost-pill">
              Talk to the team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
