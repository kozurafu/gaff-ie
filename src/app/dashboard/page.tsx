'use client';

import { useState, useEffect } from 'react';

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
  listingType: string;
  status: string;
  viewCount: number;
  createdAt: string;
  images?: { url: string }[];
}

type FilterTab = 'ALL' | 'ACTIVE' | 'LET_AGREED' | 'DRAFT';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  DRAFT: 'bg-amber-50 text-amber-700',
  LET_AGREED: 'bg-blue-50 text-blue-700',
  SALE_AGREED: 'bg-blue-50 text-blue-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
  REMOVED: 'bg-red-50 text-red-700',
  WITHDRAWN: 'bg-orange-50 text-orange-700',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  LET_AGREED: 'Let Agreed',
  SALE_AGREED: 'Sale Agreed',
  EXPIRED: 'Expired',
  REMOVED: 'Removed',
  WITHDRAWN: 'Withdrawn',
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    const res = await fetch('/api/listings?mine=true');
    if (res.ok) {
      const data = await res.json();
      setListings(data.listings ?? []);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/listings?mine=true').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([userData, listingsData]) => {
        if (!userData?.user) { window.location.href = '/auth/login'; return; }
        setUser(userData.user);
        setListings(listingsData?.listings ?? []);
      })
      .catch(() => { window.location.href = '/auth/login'; })
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
          <>
            <LandlordDashboard listings={listings} activeCount={activeListings.length} totalViews={totalViews} onRefresh={fetchListings} />
            <RecentEnquiries userId={user.id} />
          </>
        )}
        {user.role === 'AGENT' && (
          <>
            <AgentDashboard listings={listings} activeCount={activeListings.length} totalViews={totalViews} onRefresh={fetchListings} />
            <RecentEnquiries userId={user.id} />
          </>
        )}
      </div>
    </>
  );
}

/* ─── Confirmation Modal ───────────────────────────────────────── */

function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel, loading: isLoading }: {
  open: boolean; title: string; message: string; confirmLabel: string;
  onConfirm: () => void; onCancel: () => void; loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gaff-slate mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={isLoading} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-2.5 rounded-lg bg-gaff-teal text-white text-sm font-medium hover:bg-gaff-teal-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Tabs ──────────────────────────────────────────────── */

function FilterTabs({ active, onChange, counts }: { active: FilterTab; onChange: (t: FilterTab) => void; counts: Record<FilterTab, number> }) {
  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'LET_AGREED', label: 'Let Agreed' },
    { key: 'DRAFT', label: 'Draft' },
  ];
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${active === t.key ? 'bg-white text-gaff-slate shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          {t.label} <span className="text-xs ml-1 opacity-60">({counts[t.key]})</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Stat Card ────────────────────────────────────────────────── */

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

/* ─── Listing Row with Actions ─────────────────────────────────── */

function ListingRow({ listing, onStatusChange }: { listing: Listing; onStatusChange: (id: string, status: string) => void }) {
  const img = listing.images?.[0]?.url ?? '/placeholder-1.jpg';
  const [modal, setModal] = useState<{ status: string; label: string } | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleConfirm = async () => {
    if (!modal) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: modal.status }),
      });
      if (res.ok) {
        onStatusChange(listing.id, modal.status);
        setModal(null);
      }
    } catch { /* ignore */ }
    setUpdating(false);
  };

  const isRent = listing.listingType === 'RENT' || listing.listingType === 'SHARE';
  const agreedStatus = isRent ? 'LET_AGREED' : 'SALE_AGREED';
  const agreedLabel = isRent ? 'Mark Let Agreed' : 'Mark Sale Agreed';

  return (
    <>
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
              {STATUS_LABELS[listing.status] || listing.status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="font-semibold text-gaff-slate">€{listing.price.toLocaleString()}{isRent ? '/mo' : ''}</span>
            <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
            <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
            <span className="text-gray-400">👁 {listing.viewCount}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <a href={`/listing/${listing.id}`} className="text-xs font-medium text-gaff-teal hover:underline">View</a>
            <span className="text-gray-300">•</span>
            <a href={`/listing/${listing.id}/edit`} className="text-xs font-medium text-gaff-teal hover:underline">Edit</a>
            {listing.status === 'ACTIVE' && (
              <>
                <span className="text-gray-300">•</span>
                <button onClick={() => setModal({ status: agreedStatus, label: agreedLabel })} className="text-xs font-medium text-blue-600 hover:underline">
                  {agreedLabel}
                </button>
                <span className="text-gray-300">•</span>
                <button onClick={() => setModal({ status: 'WITHDRAWN', label: 'Withdraw' })} className="text-xs font-medium text-orange-600 hover:underline">
                  Withdraw
                </button>
              </>
            )}
            {(listing.status === 'WITHDRAWN' || listing.status === 'DRAFT') && (
              <>
                <span className="text-gray-300">•</span>
                <button onClick={() => setModal({ status: 'ACTIVE', label: 'Reactivate' })} className="text-xs font-medium text-emerald-600 hover:underline">
                  Reactivate
                </button>
              </>
            )}
            {listing.status === 'EXPIRED' && (
              <>
                <span className="text-gray-300">•</span>
                <button onClick={() => setModal({ status: 'ACTIVE', label: 'Renew Listing' })} className="text-xs font-medium text-gaff-teal hover:underline">
                  🔄 Renew
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!modal}
        title={`${modal?.label}?`}
        message={`Are you sure you want to ${modal?.label?.toLowerCase()} this listing? This can be changed later.`}
        confirmLabel={modal?.label || ''}
        onConfirm={handleConfirm}
        onCancel={() => setModal(null)}
        loading={updating}
      />
    </>
  );
}

/* ─── Tenant Dashboard ─────────────────────────────────────────── */

interface RecommendedListing {
  id: string;
  title: string;
  price: number;
  city: string;
  county: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  listingType: string;
  matchScore: number;
  images?: { url: string }[];
}

function TenantDashboard({ listings }: { listings: Listing[] }) {
  const [recommended, setRecommended] = useState<RecommendedListing[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings/recommended')
      .then(r => r.ok ? r.json() : { listings: [] })
      .then(data => setRecommended((data.listings ?? []).slice(0, 5)))
      .catch(() => {})
      .finally(() => setRecLoading(false));
  }, []);

  return (
    <>
      <a href="/dashboard/preferences" className="block bg-gradient-to-r from-[#0C9B8A]/10 to-[#0C9B8A]/5 rounded-2xl border border-[#0C9B8A]/20 p-5 mb-8 hover:border-[#0C9B8A]/40 transition-colors group">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🏡</span>
          <div className="flex-1">
            <h3 className="font-bold text-[#1a1a2e] group-hover:text-[#0C9B8A]">My Ideal Gaff</h3>
            <p className="text-sm text-gray-500">Set your preferences and we&apos;ll match you with the perfect property.</p>
          </div>
          <span className="text-[#0C9B8A] text-xl">→</span>
        </div>
      </a>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="❤️" label="Saved Properties" value={listings.length} />
        <StatCard icon="🔍" label="Saved Searches" value={0} />
        <StatCard icon="🎯" label="AI Matches" value={recommended.length} />
      </div>

      {/* AI Matches Section */}
      <h2 className="text-xl font-bold text-gaff-slate mb-4">🎯 AI Matches</h2>
      {recLoading ? (
        <div className="space-y-3 mb-8">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : recommended.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 mb-8">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="text-base font-semibold text-gaff-slate mb-1">No matches yet</h3>
          <p className="text-gray-500 text-sm mb-4">Set your preferences to get personalised property recommendations.</p>
          <a href="/dashboard/preferences" className="inline-block bg-gaff-teal text-white px-5 py-2 rounded-lg font-semibold text-sm">Set Preferences</a>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {recommended.map(r => {
            const img = r.images?.[0]?.url ?? '/placeholder-1.jpg';
            const isRent = r.listingType === 'RENT' || r.listingType === 'SHARE';
            return (
              <a key={r.id} href={`/listing/${r.id}`} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:border-gaff-teal/30 transition-colors">
                <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={img} alt={r.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.matchScore >= 70 ? 'bg-emerald-50 text-emerald-700' : r.matchScore >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                      {r.matchScore}% match
                    </span>
                  </div>
                  <h3 className="font-semibold text-gaff-slate text-sm truncate">{r.title}</h3>
                  <p className="text-xs text-gray-500">{r.city}, {r.county}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="font-semibold text-gaff-slate">€{r.price.toLocaleString()}{isRent ? '/mo' : ''}</span>
                    <span>{r.bedrooms} bed{r.bedrooms !== 1 ? 's' : ''}</span>
                    <span>{r.bathrooms} bath</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

      <UpcomingViewings role="TENANT" />

      <h2 className="text-xl font-bold text-gaff-slate mb-4">Saved Properties</h2>
      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">❤️</div>
          <h3 className="text-lg font-semibold text-gaff-slate mb-1">No saved properties</h3>
          <p className="text-gray-500 text-sm mb-4">Start browsing and save the ones you love.</p>
          <a href="/search" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold text-sm">Browse properties</a>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((l) => <ListingRow key={l.id} listing={l} onStatusChange={() => {}} />)}
        </div>
      )}
    </>
  );
}

/* ─── Landlord Dashboard ───────────────────────────────────────── */

function LandlordDashboard({ listings, activeCount, totalViews, onRefresh }: { listings: Listing[]; activeCount: number; totalViews: number; onRefresh: () => void }) {
  const [filter, setFilter] = useState<FilterTab>('ALL');

  const counts: Record<FilterTab, number> = {
    ALL: listings.length,
    ACTIVE: listings.filter(l => l.status === 'ACTIVE').length,
    LET_AGREED: listings.filter(l => l.status === 'LET_AGREED' || l.status === 'SALE_AGREED').length,
    DRAFT: listings.filter(l => l.status === 'DRAFT').length,
  };

  const filtered = filter === 'ALL' ? listings
    : filter === 'LET_AGREED' ? listings.filter(l => l.status === 'LET_AGREED' || l.status === 'SALE_AGREED')
    : listings.filter(l => l.status === filter);

  const handleStatusChange = () => { onRefresh(); };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🏠" label="Active Listings" value={activeCount} />
        <StatCard icon="👁" label="Total Views" value={totalViews} />
        <StatCard icon="💬" label="Messages" value={0} />
      </div>

      <UpcomingViewings role="LANDLORD" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gaff-slate">My Listings</h2>
        <a href="/listing/new" className="bg-gaff-teal text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gaff-teal-dark transition-colors">+ Add Listing</a>
      </div>

      <FilterTabs active={filter} onChange={setFilter} counts={counts} />

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">🏠</div>
          <h3 className="text-lg font-semibold text-gaff-slate mb-1">{filter === 'ALL' ? 'No listings yet' : `No ${filter.toLowerCase().replace('_', ' ')} listings`}</h3>
          <p className="text-gray-500 text-sm mb-4">{filter === 'ALL' ? "List your first property for free — it takes 5 minutes." : 'Try a different filter.'}</p>
          {filter === 'ALL' && (
            <a href="/listing/new" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold text-sm">Create your first listing</a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((l) => <ListingRow key={l.id} listing={l} onStatusChange={handleStatusChange} />)}
        </div>
      )}
    </>
  );
}

/* ─── Agent Dashboard ──────────────────────────────────────────── */

function AgentDashboard({ listings, activeCount, totalViews, onRefresh }: { listings: Listing[]; activeCount: number; totalViews: number; onRefresh: () => void }) {
  const [filter, setFilter] = useState<FilterTab>('ALL');

  const counts: Record<FilterTab, number> = {
    ALL: listings.length,
    ACTIVE: listings.filter(l => l.status === 'ACTIVE').length,
    LET_AGREED: listings.filter(l => l.status === 'LET_AGREED' || l.status === 'SALE_AGREED').length,
    DRAFT: listings.filter(l => l.status === 'DRAFT').length,
  };

  const filtered = filter === 'ALL' ? listings
    : filter === 'LET_AGREED' ? listings.filter(l => l.status === 'LET_AGREED' || l.status === 'SALE_AGREED')
    : listings.filter(l => l.status === filter);

  const handleStatusChange = () => { onRefresh(); };

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

      <UpcomingViewings role="AGENT" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gaff-slate">Portfolio</h2>
        <a href="/listing/new" className="bg-gaff-teal text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gaff-teal-dark transition-colors">+ Add Listing</a>
      </div>

      <FilterTabs active={filter} onChange={setFilter} counts={counts} />

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">🏢</div>
          <h3 className="text-lg font-semibold text-gaff-slate mb-1">{filter === 'ALL' ? 'No properties in portfolio' : `No ${filter.toLowerCase().replace('_', ' ')} listings`}</h3>
          <p className="text-gray-500 text-sm mb-4">{filter === 'ALL' ? 'Add your first property to get started.' : 'Try a different filter.'}</p>
          {filter === 'ALL' && (
            <a href="/listing/new" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold text-sm">Add first property</a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((l) => <ListingRow key={l.id} listing={l} onStatusChange={handleStatusChange} />)}
        </div>
      )}
    </>
  );
}

/* ─── Recent Enquiries ─────────────────────────────────────────── */

interface ConvMessage {
  id: string; text: string; senderId: string; sender: { id: string; name: string }; createdAt: string; readAt?: string;
}
interface ConvParticipant {
  userId: string; user: { id: string; name: string; avatar?: string };
}
interface DashConversation {
  id: string; listing?: { id: string; title: string } | null;
  participants: ConvParticipant[]; messages: ConvMessage[]; updatedAt: string;
}

function RecentEnquiries({ userId }: { userId: string }) {
  const [convs, setConvs] = useState<DashConversation[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<string | null>(null);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/messages')
      .then(r => r.ok ? r.json() : { conversations: [] })
      .then(d => setConvs((d.conversations ?? []).slice(0, 5)))
      .catch(() => {});
  }, []);

  const handleReply = async (convId: string) => {
    const text = replyText[convId]?.trim();
    if (!text) return;
    setReplying(convId);
    try {
      const r = await fetch(`/api/messages/${convId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }),
      });
      if (r.ok) {
        setReplyText(prev => ({ ...prev, [convId]: '' }));
        setReplyOpen(null);
        const cr = await fetch('/api/messages');
        if (cr.ok) { const d = await cr.json(); setConvs((d.conversations ?? []).slice(0, 5)); }
      }
    } catch { /* ignore */ }
    setReplying(null);
  };

  if (convs.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gaff-slate">Recent Enquiries</h2>
        <a href="/messages" className="text-sm font-medium text-gaff-teal hover:underline">View all →</a>
      </div>
      <div className="space-y-3">
        {convs.map(conv => {
          const other = conv.participants.find(p => p.userId !== userId)?.user;
          const last = conv.messages[0];
          const unread = last && last.senderId !== userId && !last.readAt;
          return (
            <div key={conv.id} className={`bg-white rounded-xl border p-4 shadow-sm ${unread ? 'border-gaff-teal/30' : 'border-gray-100'}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gaff-teal to-gaff-teal-dark text-white font-semibold text-sm flex items-center justify-center shrink-0">
                  {other?.name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${unread ? 'font-bold' : 'font-medium'} text-gaff-slate`}>{other?.name ?? 'Unknown'}</span>
                      {unread && <span className="w-2 h-2 bg-gaff-teal rounded-full" />}
                    </div>
                    <span className="text-xs text-gray-400">{last ? new Date(last.createdAt).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' }) : ''}</span>
                  </div>
                  {conv.listing && <p className="text-xs text-gaff-teal">{conv.listing.title}</p>}
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{last?.text ?? ''}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setReplyOpen(replyOpen === conv.id ? null : conv.id)} className="text-xs font-medium text-gaff-teal hover:underline">Quick Reply</button>
                    <a href="/messages" className="text-xs font-medium text-gray-400 hover:text-gaff-slate">Open Chat</a>
                  </div>
                  {replyOpen === conv.id && (
                    <div className="mt-2 flex gap-2">
                      <input value={replyText[conv.id] ?? ''} onChange={e => setReplyText(prev => ({ ...prev, [conv.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') handleReply(conv.id); }}
                        placeholder="Type a reply..." className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gaff-teal/30" />
                      <button onClick={() => handleReply(conv.id)} disabled={replying === conv.id}
                        className="bg-gaff-teal text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gaff-teal-dark disabled:opacity-50">
                        {replying === conv.id ? '...' : 'Send'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Upcoming Viewings ────────────────────────────────────────── */

interface ViewingData {
  slotId?: string;
  bookingId?: string;
  dateTime: string;
  durationMins: number;
  listing: { id: string; title: string; addressLine1: string; city: string; images?: { url: string }[] };
  attendees?: { id: string; name: string; email: string }[];
  maxAttendees?: number;
}

function UpcomingViewings({ role }: { role: string }) {
  const [viewings, setViewings] = useState<ViewingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/viewings/my')
      .then(r => r.ok ? r.json() : { viewings: [] })
      .then(data => setViewings(data.viewings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (viewings.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gaff-slate mb-4">📅 Upcoming Viewings</h2>
      <div className="space-y-3">
        {viewings.map((v, i) => {
          const dt = new Date(v.dateTime);
          const dateStr = dt.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' });
          const timeStr = dt.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' });
          const img = v.listing.images?.[0]?.url;
          return (
            <a key={v.slotId || v.bookingId || i} href={`/listing/${v.listing.id}`}
              className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gaff-teal/30 transition-colors">
              {img && (
                <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gaff-teal bg-gaff-teal/10 px-2 py-0.5 rounded-full">{dateStr} · {timeStr}</span>
                  <span className="text-xs text-gray-400">{v.durationMins} mins</span>
                </div>
                <h3 className="font-semibold text-gaff-slate text-sm truncate">{v.listing.title}</h3>
                <p className="text-xs text-gray-500">{v.listing.addressLine1}, {v.listing.city}</p>
                {(role === 'LANDLORD' || role === 'AGENT') && v.attendees && (
                  <p className="text-xs text-gray-400 mt-1">
                    {v.attendees.length === 0 ? 'No bookings yet' : `${v.attendees.length} attendee${v.attendees.length !== 1 ? 's' : ''}: ${v.attendees.map(a => a.name).join(', ')}`}
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
