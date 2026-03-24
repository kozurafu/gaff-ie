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
    icon: "🛡️",
    title: "Every Landlord Verified",
    description: "Government ID + property ownership checked. No fake listings, no scams.",
  },
  {
    icon: "🆓",
    title: "Free to List",
    description: "Basic listings are free forever. No €135+ fees like other platforms.",
  },
  {
    icon: "💬",
    title: "Messages That Actually Work",
    description: "Real-time messaging with read receipts. Every enquiry gets seen.",
  },
  {
    icon: "🤖",
    title: "AI Scam Detection",
    description: "Fake listings caught automatically. Stock photos, pricing anomalies, known patterns — flagged instantly.",
  },
  {
    icon: "🎯",
    title: "Smart Matching",
    description: "AI matches you to properties based on budget, commute, and lifestyle. Like a dating app for housing.",
  },
  {
    icon: "📞",
    title: "Real Customer Support",
    description: "Live chat, 4-hour email SLA, phone callbacks. Actual humans who help.",
  },
];

const steps = [
  { num: "1", title: "Search", desc: "Browse verified listings or let our AI match you to your perfect gaff." },
  { num: "2", title: "Verify", desc: "Get your verified badge — prove you're real, stand out from the crowd." },
  { num: "3", title: "Connect", desc: "Message landlords directly. Read receipts mean no more ghosting." },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gaff-slate to-gaff-slate-light text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find your next <span className="text-gaff-teal-light">gaff</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Ireland&apos;s first verified property platform. Every landlord checked, every listing real, every message delivered.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gaff-teal text-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium">
          <span className="flex items-center gap-2">🛡️ Every landlord verified</span>
          <span className="flex items-center gap-2">🆓 Free to list</span>
          <span className="flex items-center gap-2">🚫 Zero scam tolerance</span>
          <span className="flex items-center gap-2">💬 Messages that work</span>
        </div>
      </section>

      {/* Why Gaff */}
      <section className="py-16 px-4 bg-gaff-warm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gaff-slate mb-2">
            Why Gaff?
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            We built the property platform Ireland actually deserves.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((d, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-3xl mb-3">{d.icon}</div>
                <h3 className="text-lg font-semibold text-gaff-slate mb-2">{d.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gaff-slate mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 bg-gaff-teal text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="text-xl font-semibold text-gaff-slate mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4 bg-gaff-warm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gaff-slate mb-2">
            Latest verified listings
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Real properties from verified landlords in Dublin
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/search" className="inline-block bg-gaff-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors">
              Browse all listings →
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-gaff-slate text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "2,000+", label: "Verified listings" },
            { num: "500+", label: "Verified landlords" },
            { num: "< 4hr", label: "Support response" },
            { num: "0", label: "Scam reports" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-bold text-gaff-teal-light">{s.num}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gaff-slate mb-4">
            Ready to find your gaff?
          </h2>
          <p className="text-gray-500 mb-8">
            Whether you&apos;re searching for a home or listing a property — it&apos;s free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/search" className="bg-gaff-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors">
              Start searching
            </a>
            <a href="/list" className="border-2 border-gaff-teal text-gaff-teal px-8 py-3 rounded-lg font-semibold hover:bg-gaff-teal hover:text-white transition-colors">
              List your property — free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gaff-slate text-gray-400 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-3">Gaff.ie</h4>
            <p className="text-sm">Making housing in Ireland fair, transparent, and trustworthy.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Tenants</h4>
            <ul className="text-sm space-y-2">
              <li><a href="/search" className="hover:text-white">Search properties</a></li>
              <li><a href="/verify" className="hover:text-white">Get verified</a></li>
              <li><a href="/rights" className="hover:text-white">Know your rights</a></li>
              <li><a href="/hap" className="hover:text-white">HAP guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Landlords</h4>
            <ul className="text-sm space-y-2">
              <li><a href="/list" className="hover:text-white">List for free</a></li>
              <li><a href="/verify" className="hover:text-white">Verify your property</a></li>
              <li><a href="/tools" className="hover:text-white">Landlord tools</a></li>
              <li><a href="/pricing" className="hover:text-white">Premium plans</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="text-sm space-y-2">
              <li><a href="/about" className="hover:text-white">About us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy policy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms of service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-gray-700 text-sm text-center">
          © 2026 Gaff.ie. All rights reserved. Made in Ireland 🇮🇪
        </div>
      </footer>
    </main>
  );
}
