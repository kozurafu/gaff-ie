'use client';

import { useState, useEffect } from 'react';
import ListingCard from '@/components/ui/ListingCard';
import Footer from '@/components/ui/Footer';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'landlord';
}

interface Listing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  address: string;
  area: string;
  images?: string[];
  verified?: boolean;
  hapWelcome?: boolean;
  propertyType: string;
  status?: string;
  createdAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  inactive: 'bg-gray-100 text-gray-500',
  rejected: 'bg-red-50 text-red-700',
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/listings?mine=true').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([userData, listingsData]) => {
        if (!userData?.user) {
          window.location.href = '/auth/login';
          return;
        }
        setUser(userData.user);
        setListings(listingsData?.listings ?? []);
      })
      .catch(() => {
        window.location.href = '/auth/login';
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isLandlord = user.role === 'landlord';

  return (
    <>
      <div className="bg-gaff-slate text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isLandlord ? 'Manage your properties and listings' : 'Your saved properties and searches'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {isLandlord ? (
          <>
            {/* Landlord dashboard */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gaff-slate">My Listings</h2>
              <a
                href="/listing/new"
                className="bg-gaff-teal text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gaff-teal-dark transition-colors"
              >
                + Add Listing
              </a>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="text-lg font-semibold text-gaff-slate mb-1">No listings yet</h3>
                <p className="text-gray-500 text-sm mb-4">List your first property for free — it takes 5 minutes.</p>
                <a href="/listing/new" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gaff-teal-dark transition-colors">
                  Create your first listing
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((l) => (
                  <div key={l.id} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="w-full sm:w-40 h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img src={l.images?.[0] ?? '/placeholder-1.jpg'} alt={l.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gaff-slate truncate">{l.title}</h3>
                          <p className="text-sm text-gray-500">{l.address}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${STATUS_COLORS[l.status ?? 'active']}`}>
                          {l.status ?? 'active'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="font-semibold text-gaff-slate">€{l.price.toLocaleString()}/mo</span>
                        <span>{l.bedrooms} bed{l.bedrooms !== 1 ? 's' : ''}</span>
                        <span>{l.bathrooms} bath{l.bathrooms !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <a href={`/listing/${l.id}`} className="text-xs font-medium text-gaff-teal hover:underline">View</a>
                        <span className="text-gray-300">•</span>
                        <button className="text-xs font-medium text-gray-500 hover:text-gaff-slate">Edit</button>
                        <span className="text-gray-300">•</span>
                        <button className="text-xs font-medium text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Tenant dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gaff-slate mb-1">Saved Properties</h3>
                <p className="text-3xl font-bold text-gaff-teal">{listings.length}</p>
                <p className="text-sm text-gray-500 mt-1">Properties you&apos;ve saved</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gaff-slate mb-1">Saved Searches</h3>
                <p className="text-3xl font-bold text-gaff-teal">0</p>
                <p className="text-sm text-gray-500 mt-1">Get notified when new matches appear</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gaff-slate mb-4">Saved Properties</h2>
            {listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-4xl mb-3">❤️</div>
                <h3 className="text-lg font-semibold text-gaff-slate mb-1">No saved properties</h3>
                <p className="text-gray-500 text-sm mb-4">Start browsing and save the ones you love.</p>
                <a href="/search" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold text-sm">
                  Browse properties
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((l) => (
                  <a key={l.id} href={`/listing/${l.id}`}>
                    <ListingCard
                      image={l.images?.[0] ?? '/placeholder-1.jpg'}
                      price={l.price}
                      bedrooms={l.bedrooms}
                      bathrooms={l.bathrooms}
                      sqft={l.sqft}
                      address={l.address}
                      area={l.area}
                      verified={l.verified}
                      hapWelcome={l.hapWelcome}
                      timeAgo="Recently"
                      propertyType={l.propertyType}
                    />
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
