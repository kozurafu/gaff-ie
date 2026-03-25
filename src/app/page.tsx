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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return "30+ days ago";
}

export default async function Home() {
  const listings = await getListings();

  return (
    <main>
      {/* Hero */}
      <section className="bg-gaff-slate">
        <div className="max-w-3xl mx-auto px-4 pt-14 pb-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
            Find your next{" "}
            <span className="text-gaff-teal-light">gaff</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-md mx-auto">
            Every landlord verified. Every listing real.
          </p>
          <SearchBar variant="hero" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gaff-slate text-center mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                step: "1",
                title: "Search",
                desc: "Browse verified properties across Ireland by location, price, and type.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Verify",
                desc: "Every landlord is ID-checked and every property confirmed before listing.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Connect",
                desc: "Message landlords directly with real-time chat. No ghosting, no scams.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-14 h-14 rounded-2xl bg-gaff-teal-50 text-gaff-teal flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-gaff-slate mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest listings */}
      {listings.length > 0 && (
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gaff-slate">
                  Latest verified listings
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Real properties from verified landlords
                </p>
              </div>
              <a
                href="/search"
                className="text-gaff-teal font-semibold text-sm hover:text-gaff-teal-dark flex items-center gap-1 shrink-0"
              >
                View all
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  timeAgo={timeAgo(listing.createdAt)}
                  propertyType={listing.propertyType}
                  createdAt={listing.createdAt}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Gaff */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gaff-slate text-center mb-10">
            Why Gaff.ie?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                ),
                title: "Every Landlord Verified",
                description: "Government ID + property ownership checked before any listing goes live.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                  </svg>
                ),
                title: "Free to List",
                description: "Basic listings are free forever. No €135+ fees like other platforms.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    <path d="M8 9h8M8 13h4" />
                  </svg>
                ),
                title: "Messages That Work",
                description: "Real-time messaging with read receipts. No more ghosting.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                ),
                title: "AI Scam Detection",
                description: "Fake listings caught automatically. Stock photos and pricing anomalies flagged.",
              },
            ].map((d, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gaff-teal-50 text-gaff-teal flex items-center justify-center mx-auto mb-4">
                  {d.icon}
                </div>
                <h3 className="text-sm font-semibold text-gaff-slate mb-1.5">
                  {d.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-gaff-teal">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            List your property for free
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Join Ireland&apos;s verification-first property platform. No fees, no scams, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/listing/new"
              className="bg-white text-gaff-teal font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              List your property
            </a>
            <a
              href="/search"
              className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Browse listings
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
