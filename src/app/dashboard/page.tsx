'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/ui/Footer';

type UserRole = 'TENANT' | 'LANDLORD' | 'AGENT' | 'ADMIN';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  addressLine1: string;
  city: string;
  propertyType: string;
  status: string;
  viewCount: number;
  createdAt: string;
  images?: { url: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  DRAFT: 'bg-amber-50 text-amber-700',
  LET_AGREED: 'bg-blue-50 text-blue-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
  REMOVED: 'bg-red-50 text-red-700',
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
            {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-gray-200 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const roleLabels: Record<UserRole, string> = {
    TENANT: 'Your saved properties and searches',
    LANDLORD: 'Manage your properties and listings',
    AGENT: 'Manage your portfolio and tenants',
    ADMIN: 'Platform administration',
  };

  const activeListings = listings.filter((l) => l.status === 'ACTIVE');
  const totalViews = listings.reduce((sum, l) => sum + (l.viewCount || 0), 0);

  return (
    <>
      <div className="bg-gaff-slate text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">{roleLabels[user.role]}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {user.role === 'TENANT' && <TenantDashboard listings={listings} />}
        {user.role === 'LANDLORD' && (
          <LandlordDashboard listings={listings} activeCount={activeListings.length} totalViews={totalViews} />
        )}
        {user.role === 'AGENT' && (
          <AgentDashboard listings={listings} activeCount={activeListings.length} totalViews={totalViews} />
        )}
      </div>
      <Footer />
    </>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-2xl font-bold text-gaff-teal">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ListingRow({ listing }: { listing: Listing }) {
  const img = listing.images?.[0]?.url ?? '/placeholder-1.jpg';
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 shadow-sm">
      <div className="w-full sm:w-40 h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        <img src={img} alt={listing.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gaff-slate truncate">{listing.title}</h3>
            <p className="text-sm text-gray-500">{listing.addressLine1}, {listing.city}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[listing.status] || 'bg-gray-100 text-gray-500'}`}>
            {listing.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span className="font-semibold text-gaff-slate">€{listing.price.toLocaleString()}/mo</span>
          <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
          <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
          <span className="text-gray-400">👁 {listing.viewCount}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <a href={`/listing/${listing.id}`} className="text-xs font-medium text-gaff-teal hover:underline">View</a>
          <span className="text-gray-300">•</span>
          <button className="text-xs font-medium text-gray-500 hover:text-gaff-slate">Edit</button>
        </div>
      </div>
    </div>
  );
}

function TenantDashboard({ listings }: { listings: Listing[] }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="❤️" label="Saved Properties" value={listings.length} />
        <StatCard icon="🔍" label="Saved Searches" value={0} />
        <StatCard icon="🤖" label="AI Matches" value="Coming soon" />
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
        <div className="space-y-4">
          {listings.map((l) => <ListingRow key={l.id} listing={l} />)}
        </div>
      )}
    </>
  );
}

function LandlordDashboard({ listings, activeCount, totalViews }: { listings: Listing[]; activeCount: number; totalViews: number }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🏠" label="Active Listings" value={activeCount} />
        <StatCard icon="👁" label="Total Views" value={totalViews} />
        <StatCard icon="💬" label="Messages" value={0} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gaff-slate">My Listings</h2>
        <a href="/listing/new" className="bg-gaff-teal text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gaff-teal-dark transition-colors">
          + Add Listing
        </a>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">🏠</div>
          <h3 className="text-lg font-semibold text-gaff-slate mb-1">No listings yet</h3>
          <p className="text-gray-500 text-sm mb-4">List your first property for free — it takes 5 minutes.</p>
          <a href="/listing/new" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold text-sm">
            Create your first listing
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((l) => <ListingRow key={l.id} listing={l} />)}
        </div>
      )}
    </>
  );
}

function AgentDashboard({ listings, activeCount, totalViews }: { listings: Listing[]; activeCount: number; totalViews: number }) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📋" label="Portfolio" value={listings.length} />
        <StatCard icon="✅" label="Active" value={activeCount} />
        <StatCard icon="👁" label="Total Views" value={totalViews} />
        <StatCard icon="👥" label="Tenant Pipeline" value={0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <a href="/listing/new" className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:border-gaff-teal/30 transition-colors group">
          <div className="text-2xl mb-2">➕</div>
          <h3 className="font-semibold text-gaff-slate group-hover:text-gaff-teal">Add Property</h3>
          <p className="text-sm text-gray-500">List a new property to your portfolio</p>
        </a>
        <a href="/dashboard/tenants" className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:border-gaff-teal/30 transition-colors group">
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold text-gaff-slate group-hover:text-gaff-teal">Manage Tenants</h3>
          <p className="text-sm text-gray-500">View interested tenants and match to properties</p>
        </a>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gaff-slate">Portfolio</h2>
        <a href="/listing/new" className="bg-gaff-teal text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gaff-teal-dark transition-colors">
          + Add Listing
        </a>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">🏢</div>
          <h3 className="text-lg font-semibold text-gaff-slate mb-1">No properties in portfolio</h3>
          <p className="text-gray-500 text-sm mb-4">Add your first property to get started.</p>
          <a href="/listing/new" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold text-sm">
            Add first property
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((l) => <ListingRow key={l.id} listing={l} />)}
        </div>
      )}
    </>
  );
}
