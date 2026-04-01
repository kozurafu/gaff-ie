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

const heroStats = [
  { value: "Verified", label: "Every landlord + agent before listing" },
  { value: "€0", label: "To publish rentals, rooms, or sales" },
  { value: "Inbox", label: "That shows every enquiry + response" },
  { value: "Auto", label: "Listings expire unless marked as let" },
];

const heroFeatures = [
  {
    title: "Search real Irish homes",
    detail: "City, county, BER, pets, HAP, parking — filters that match how we actually rent here.",
  },
  {
    title: "List for free in minutes",
    detail: "Upload photos, add BER + availability, and publish without Daft’s €135 fee or ad spam.",
  },
  {
    title: "Message without email chaos",
    detail: "Enquiries, replies, and viewing invites stay in one shared thread so nobody wonders if it sent.",
  },
];

const workflowSteps = [
  {
    title: "Browse live stock",
    desc: "Auto-expiring ads mean every card you click is still on the market, not a ghost from months ago.",
  },
  {
    title: "Talk inside Gaff.ie",
    desc: "Renters, landlords, and agents reply in one secure inbox with read receipts and tenant profiles.",
  },
  {
    title: "Close the loop",
    desc: "Schedule viewings, mark Let Agreed, and archive the thread so the whole process stays documented.",
  },
];

const trustSignals = [
  {
    title: "Identity + ownership checks",
    body: "Owners upload ID and proof of ownership. No anonymous Gmail ads, no surprise middlemen.",
  },
  {
    title: "Listings with expiry dates",
    body: "If an advert isn’t refreshed or marked Let, it disappears. You never chase an already-gone place again.",
  },
  {
    title: "Moderators who act",
    body: "Report a listing or chat and it freezes until a person reviews the docs. Deposits never move blindly.",
  },
];

const personaStories = [
  {
    role: "Renters",
    headline: "See what’s real, message who’s real.",
    points: [
      "Filter Ireland-specific fields: HAP, BER, pets, parking, broadband, availability.",
      "Send enquiries and keep every reply inside one thread with timestamps.",
      "Know when a home is Let Agreed so you stop chasing stale ads.",
      "Report scams and the platform steps in before deposits change hands.",
    ],
  },
  {
    role: "Landlords",
    headline: "List for €0 and keep a clean pipeline.",
    points: [
      "Create one listing and refresh it each tenancy instead of paying Daft every time.",
      "All enquiries arrive with tenant profiles so you can shortlist quickly.",
      "Mark Let Agreed, schedule viewings, and close threads without leaving the site.",
      "Verified badge shows renters you’re a legitimate owner with RTB details on file.",
    ],
  },
  {
    role: "Estate agents",
    headline: "Portfolio control without spreadsheets.",
    points: [
      "Manage rentals + sales from a single dashboard with status columns.",
      "Assign enquiries to teammates and give landlords visibility in real time.",
      "Export your data or pipe it into your CRM whenever you need.",
      "One flat subscription instead of dozens of per-ad charges.",
    ],
  },
];

export default async function Home() {
  const listings = await getListings();

  return (
    <main className="relative overflow-hidden pb-24">
      <section className="relative overflow-hidden pt-36 sm:pt-40 pb-16 sm:pb-24">
        <div className="absolute left-0 right-0 -top-24 bottom-0 -z-10">
          <div className="absolute inset-0 bg-[url('/hero-landing.jpg')] bg-cover bg-center brightness-110 contrast-[1.05]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/45 to-white/15" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/85 via-white/55 to-transparent" />
        </div>
        <div className="noise-overlay z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-white text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              Ireland’s verified property marketplace
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight leading-tight">
              <span className="text-slate-700 block">Find or list a home without Daft-era chaos.</span>
            </h1>
            <div className="max-w-2xl rounded-3xl bg-white/85 backdrop-blur border border-white/70 shadow-[0_35px_80px_rgba(15,23,42,0.12)] p-4 sm:p-5 text-base sm:text-lg text-slate-700">
              Gaff.ie is the Irish letting + sales site where every landlord is verified, listings auto-expire, and all enquiries live in one shared inbox.
              Renters, landlords, and agents finally use the same source of truth.
            </div>
            <div className="glass-panel p-4">
              <SearchBar variant="hero" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <Link href="/listing/new" className="neon-button text-base text-center">
                List your property
              </Link>
              <Link href="/search" className="ghost-pill text-base text-center">
                Explore live listings
              </Link>
              <Link href="/auth/register" className="ghost-pill text-base text-center border-dashed">
                Create account
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-slate-700">
              {heroStats.map((stat) => (
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
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-[0.3em]">Everything in one product</p>
                <div className="space-y-4">
                  {heroFeatures.map((item) => (
                    <div key={item.title} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                      <p className="text-sm text-slate-500">{item.title}</p>
                      <p className="text-lg font-semibold text-slate-900">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white/80 p-4 text-sm text-slate-600">
                  It looks like a property platform because it is one — search, list, message, verify, and close deals right here.
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
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">How a listing actually flows</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Search, enquire, confirm keys — without leaving Gaff.ie.</h2>
              <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
                The same place that shows the ad lets you message the owner, see when it’s marked Let Agreed, and keep the whole paper trail. No extra
                inboxes, no mystery gaps.
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
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Live on the marketplace</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Actual homes renters can move into.</h2>
              <p className="text-slate-600 text-sm sm:text-base">These are sample listings from the waitlist cohort. Click through — every one uses the same verified workflow.</p>
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
          <h3 className="text-2xl sm:text-3xl text-slate-900 font-semibold">Why the listings here feel different.</h3>
          <ul className="space-y-4 text-slate-600 text-sm sm:text-base">
            <li>• Government ID + ownership proof is required before an ad is visible.</li>
            <li>• Listings automatically expire unless the owner refreshes or marks them Let.</li>
            <li>• Moderators pause anything suspicious before deposits move.</li>
          </ul>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-4xl font-semibold text-[#0CE6FF]">1</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Shared inbox for both sides</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-slate-900">0</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Anonymous ads allowed</p>
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
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Who it’s built for</p>
          <h2 className="text-3xl sm:text-4xl text-slate-900 font-semibold mt-2">Renters, landlords, and agents all live in the same product.</h2>
          <p className="text-slate-600 mt-4 text-sm sm:text-base">
            And each role gets the tooling they were missing on Daft — tenant profiles, landlord verification, and agent pipelines happen here by default.
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
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Ready to list or rent?</p>
          <h3 className="text-3xl sm:text-4xl text-slate-900 font-semibold mb-4">Show (or find) your next gaff on the Irish platform that actually works.</h3>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto mb-8">
            Sign up, import your existing Daft listing if you have one, and keep the entire letting flow inside Gaff.ie. Your future tenants already expect
            verified ads — give them that on day one.
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
