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
  { value: "€0", label: "to list your property" },
  { value: "ID-first", label: "owner onboarding" },
  { value: "Inbox", label: "that tracks every reply" },
  { value: "Weekly", label: "waitlist releases" },
];

const heroHighlights = [
  {
    title: "Built for Ireland",
    detail: "County-level filters, euro pricing, HAP + BER context, and listings written for Irish renters." ,
  },
  {
    title: "Profiles you can trust",
    detail: "Landlords and agents onboard with legal ID and proof of ownership, so every ad is tied to a real person.",
  },
  {
    title: "One dashboard per role",
    detail: "Renters track enquiries, landlords mark ads as let, and agents manage portfolios without spreadsheets.",
  },
];

const workflowSteps = [
  {
    title: "Search & shortlist",
    desc: "Filter by location, price, beds, pets, parking, and availability. Keep the homes you care about in one view.",
  },
  {
    title: "Message inside Gaff",
    desc: "Send enquiries without leaving the site. Every reply sits in the same thread, so nobody wonders if it was delivered.",
  },
  {
    title: "See what happens next",
    desc: "Owners mark listings as let, invite you to viewings, and share updates. No more guessing if an ad is already gone.",
  },
];

const trustSignals = [
  {
    title: "Inbox that can’t disappear",
    body: "Conversations live inside Gaff.ie with timestamps, so tenants and owners see the same history and nothing gets lost in email.",
  },
  {
    title: "Listings that stay honest",
    body: "Every ad auto-expires if it isn’t refreshed and owners must mark properties as Let when they’re done.",
  },
  {
    title: "Moderation with names attached",
    body: "Report a listing or conversation and a human moderator freezes it until the docs check out. No burner accounts.",
  },
];

const personaStories = [
  {
    role: "Renters",
    headline: "Verified homes + a real inbox.",
    points: [
      "Browse only owner-backed listings instead of anonymous Gmail ads.",
      "Send enquiries in-app and keep the whole thread — you always know who read it and when.",
      "See when a property is marked Let so you stop chasing dead ads.",
      "Flag anything suspicious and a moderator steps in before deposits move.",
    ],
  },
  {
    role: "Landlords",
    headline: "List for free and respond faster.",
    points: [
      "Publish once, reuse it every time the tenancy renews — no €135 listing fees.",
      "All enquiries drop into a single inbox with tenant profiles attached.",
      "Shortlist applicants, schedule viewings, and close the ad in one click.",
      "Upload ID + RTB details once so renters see a verified badge beside your name.",
    ],
  },
  {
    role: "Estate agents",
    headline: "Portfolio management without spreadsheets.",
    points: [
      "Manage rentals and sales from one dashboard instead of juggling Daft, email, and CRM exports.",
      "Assign enquiries to teammates and keep landlords updated with a clear pipeline.",
      "Mark listings Let Agreed, watch response-time stats, and prove ROI to clients.",
      "Export your data anytime — you own your leads and history.",
    ],
  },
];

export default async function Home() {
  const listings = await getListings();

  return (
    <main className="relative overflow-hidden pb-24">
      <section className="relative pt-28 pb-16 sm:pb-24 hero-gradient">
        <div className="noise-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-white text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              Built in Ireland for renters, landlords & agents
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight leading-tight">
              <span className="text-slate-700 block">It’s a property app, not a classifieds board.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
              Search verified homes, message owners inside Gaff.ie, and see exactly when a listing is gone. Landlords list for free and keep every reply
              in one dashboard.
            </p>
            <div className="glass-panel p-4">
              <SearchBar variant="hero" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/listing/new" className="neon-button text-base text-center">
                List your property
              </Link>
              <Link href="/search" className="ghost-pill text-base text-center">
                Explore live listings
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-slate-700">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel p-4 text-center">
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-[#FFDEE9] via-[#B5FFFC] to-[#E4FBFF] opacity-80 blur-3xl" />
            <div className="glass-panel relative p-6 sm:p-8 rounded-[32px] h-full">
              <div className="space-y-5">
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-[0.3em]">What you get today</p>
                <div className="space-y-4">
                  {heroHighlights.map((item) => (
                    <div key={item.title} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                      <p className="text-sm text-slate-500">{item.title}</p>
                      <p className="text-lg font-semibold text-slate-900">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white/80 p-4 text-sm text-slate-600">
                  Gaff.ie replaces Daft.ie + email ping-pong. Search, messaging, viewings, and moderation happen in one place.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16">
        <div className="glass-panel p-5 sm:p-6 lg:p-8 rounded-4xl">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <div className="flex-1 space-y-4">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">How Gaff.ie works</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Everything from first search to keys happens here.</h2>
              <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
                No more hopping between Daft, email, WhatsApp, and spreadsheets. Gaff.ie handles discovery, messaging, status updates, and moderation in
                one shared workflow.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {workflowSteps.map((step) => (
                <div key={step.title} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 text-slate-600">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">{step.title}</p>
                  <p className="text-base font-semibold text-slate-900">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {listings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Live marketplace</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Listings that stay accurate.</h2>
              <p className="text-slate-600 text-sm sm:text-base">Landlords mark adverts as Let Agreed and the system auto-expires stale posts.</p>
            </div>
            <Link href="/search" className="ghost-pill w-full sm:w-auto text-center">
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 grid lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="glass-panel p-6 sm:p-8 space-y-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Trust layer</p>
          <h3 className="text-2xl sm:text-3xl text-slate-900 font-semibold">Moderation and verification are built in, not bolted on.</h3>
          <ul className="space-y-4 text-slate-600 text-sm sm:text-base">
            <li>• Landlords upload ID and proof of ownership before a listing goes live.</li>
            <li>• Listings auto-expire if they aren’t refreshed, so you’re never messaging ghosts.</li>
            <li>• Reports freeze the listing until a human moderator reviews the docs.</li>
          </ul>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-4xl font-semibold text-[#0CE6FF]">One</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">shared inbox for both sides</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-slate-900">Zero</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">tolerance for anonymous ads</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {trustSignals.map((signal) => (
            <div key={signal.title} className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">{signal.title}</p>
              <p className="text-lg text-slate-800 font-semibold">{signal.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Who it’s for</p>
          <h2 className="text-3xl sm:text-4xl text-slate-900 font-semibold mt-2">Three audiences, one shared workflow.</h2>
          <p className="text-slate-600 mt-4 text-sm sm:text-base">
            Gaff.ie mirrors the exact journey each role takes today — but everything happens inside one product instead of a patchwork of Daft, email
            threads, and spreadsheets.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {personaStories.map((persona) => (
            <div key={persona.role} className="glass-panel p-6 h-full flex flex-col">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{persona.role}</p>
              <h3 className="text-xl font-semibold text-slate-900 mt-2">{persona.headline}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 flex-1">
                {persona.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="text-gaff-teal mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 text-center">
        <div className="glass-panel p-8 sm:p-10">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Ready to switch?</p>
          <h3 className="text-3xl sm:text-4xl text-slate-900 font-semibold mb-4">Leave the guessing games to Daft. Run the whole process here.</h3>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto mb-8">
            Whether you’re renting, letting, or running an agency, Gaff.ie gives you verified profiles, an inbox that can’t fall over, and a moderation
            team that actually responds. That’s the baseline — not a premium feature.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/auth/register" className="neon-button">
              Create your account
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
