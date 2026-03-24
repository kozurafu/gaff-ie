'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import ListingCard from '@/components/ui/ListingCard';
import Footer from '@/components/ui/Footer';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  address: string;
  area: string;
  eircode?: string;
  berRating?: string;
  features?: string[];
  images?: string[];
  furnished?: boolean;
  hapAccepted?: boolean;
  petsAllowed?: boolean;
  parking?: boolean;
  availableFrom?: string;
  verified?: boolean;
  landlord?: { id: string; name: string; verified: boolean; joinedDate?: string; listingsCount?: number };
  createdAt?: string;
}

interface SimilarListing {
  id: string;
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
  createdAt?: string;
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<SimilarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => {
        setListing(data.listing ?? data);
        setSimilar(data.similar ?? []);
      })
      .catch(() => setError('Listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="aspect-[16/9] bg-gray-200 rounded-2xl" />
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🏚️</div>
        <h1 className="text-2xl font-bold text-gaff-slate mb-2">Listing not found</h1>
        <p className="text-gray-500 mb-6">This property may have been removed or doesn&apos;t exist.</p>
        <a href="/search" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors">
          Back to search
        </a>
      </div>
    );
  }

  const images = listing.images?.length ? listing.images : ['/placeholder-1.jpg'];

  return (
    <>
      {/* Gallery */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setGalleryOpen(true)}>
          <img src={images[activeImage]} alt={listing.title} className="w-full aspect-[16/9] object-cover" />
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm">
              📷 {activeImage + 1}/{images.length} — Click to view all
            </div>
          )}
          {listing.verified && (
            <div className="absolute top-4 left-4">
              <VerifiedBadge type="landlord" size="md" />
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === activeImage ? 'border-gaff-teal' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen gallery modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setGalleryOpen(false)}>
          <button className="absolute top-4 right-4 text-white text-3xl z-10" onClick={() => setGalleryOpen(false)}>✕</button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 rounded-full w-12 h-12 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage - 1 + images.length) % images.length); }}
          >←</button>
          <img src={images[activeImage]} alt="" className="max-h-[90vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 rounded-full w-12 h-12 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage + 1) % images.length); }}
          >→</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-xs font-semibold uppercase text-gaff-teal">{listing.listingType} • {listing.propertyType}</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gaff-slate mt-1">{listing.title}</h1>
                <p className="text-gray-500 mt-1">{listing.address}{listing.area ? `, ${listing.area}` : ''}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl md:text-3xl font-bold text-gaff-slate">€{listing.price.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{listing.listingType === 'sale' ? 'asking price' : '/month'}</div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100 my-4">
              {[
                { label: 'Bedrooms', value: listing.bedrooms, icon: '🛏️' },
                { label: 'Bathrooms', value: listing.bathrooms, icon: '🚿' },
                ...(listing.sqft ? [{ label: 'Sq Ft', value: listing.sqft.toLocaleString(), icon: '📐' }] : []),
                ...(listing.berRating ? [{ label: 'BER', value: listing.berRating, icon: '⚡' }] : []),
                ...(listing.eircode ? [{ label: 'Eircode', value: listing.eircode, icon: '📍' }] : []),
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span>{s.icon}</span>
                  <div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                    <div className="text-sm font-semibold text-gaff-slate">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gaff-slate mb-2">About this property</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gaff-slate mb-3">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {listing.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property details grid */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gaff-slate mb-3">Property Details</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Furnished', value: listing.furnished ? 'Yes' : 'No' },
                  { label: 'HAP Accepted', value: listing.hapAccepted ? '✅ Yes' : 'No' },
                  { label: 'Pets Allowed', value: listing.petsAllowed ? '✅ Yes' : 'No' },
                  { label: 'Parking', value: listing.parking ? '✅ Yes' : 'No' },
                  ...(listing.availableFrom ? [{ label: 'Available From', value: new Date(listing.availableFrom).toLocaleDateString('en-IE') }] : []),
                ].map((d) => (
                  <div key={d.label} className="bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="text-xs text-gray-500">{d.label}</div>
                    <div className="text-sm font-medium text-gaff-slate">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Landlord card */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Listed by</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gaff-teal/10 flex items-center justify-center text-gaff-teal font-bold text-lg">
                    {listing.landlord?.name?.charAt(0) ?? 'L'}
                  </div>
                  <div>
                    <div className="font-semibold text-gaff-slate">{listing.landlord?.name ?? 'Landlord'}</div>
                    {listing.landlord?.verified && <VerifiedBadge type="landlord" size="sm" />}
                  </div>
                </div>
                {listing.landlord?.joinedDate && (
                  <p className="text-xs text-gray-500 mb-1">Member since {listing.landlord.joinedDate}</p>
                )}
                {listing.landlord?.listingsCount && (
                  <p className="text-xs text-gray-500">{listing.landlord.listingsCount} active listings</p>
                )}

                <button
                  onClick={() => setMessageOpen(!messageOpen)}
                  className="w-full mt-4 bg-gaff-teal text-white py-2.5 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors"
                >
                  💬 Message Landlord
                </button>

                {messageOpen && (
                  <div className="mt-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi, I'm interested in this property..."
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gaff-teal/40"
                    />
                    <button
                      onClick={() => { alert('Message sent! (Demo)'); setMessageOpen(false); setMessage(''); }}
                      className="w-full mt-2 bg-gaff-slate text-white py-2 rounded-lg text-sm font-medium hover:bg-gaff-slate-light transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                )}
              </div>

              {/* Trust signal */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-800">Gaff.ie Protection</h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      This listing has been reviewed. Report any issues and we&apos;ll investigate within 4 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar listings */}
        {similar.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-xl font-bold text-gaff-slate mb-5">Similar properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.slice(0, 3).map((s) => (
                <a key={s.id} href={`/listing/${s.id}`}>
                  <ListingCard
                    image={s.images?.[0] ?? '/placeholder-1.jpg'}
                    price={s.price}
                    bedrooms={s.bedrooms}
                    bathrooms={s.bathrooms}
                    sqft={s.sqft}
                    address={s.address}
                    area={s.area}
                    verified={s.verified}
                    hapWelcome={s.hapWelcome}
                    timeAgo="Recently"
                    propertyType={s.propertyType}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
