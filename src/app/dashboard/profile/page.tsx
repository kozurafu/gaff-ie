'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/Toast';

interface ProfileData {
  id: string;
  name: string;
  phone?: string;
  role: string;
  avatar?: string;
  emailVerified?: boolean;
  profile?: { bio?: string; rtbNumber?: string | null; companyName?: string | null };
}

export default function ProfileEditPage() {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [rtbNumber, setRtbNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.user) { window.location.href = '/auth/login'; return; }
        const u = d.user;
        fetch(`/api/users/${u.id}/profile`)
          .then((r) => (r.ok ? r.json() : null))
          .then((pd) => {
            if (pd?.user) {
              setUser(pd.user);
              setName(pd.user.name || '');
              setPhone(pd.user.phone || '');
              setBio(pd.user.profile?.bio || '');
              setAvatar(pd.user.avatar || '');
              setRtbNumber(pd.user.profile?.rtbNumber || '');
              setCompanyName(pd.user.profile?.companyName || '');
            }
          })
          .finally(() => setLoading(false));
      })
      .catch(() => { window.location.href = '/auth/login'; });
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setAvatar(data.url);
      } else {
        addToast('Upload failed', 'error');
      }
    } catch {
      addToast('Upload failed', 'error');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) { addToast('Name is required', 'error'); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
          avatar: avatar.trim(),
          rtbNumber: rtbNumber.trim(),
          companyName: companyName.trim(),
        }),
      });
      if (res.ok) {
        addToast('Profile updated successfully', 'success');
      } else {
        const data = await res.json();
        addToast(data.error || 'Failed to update profile', 'error');
      }
    } catch {
      addToast('Failed to update profile', 'error');
    }
    setSaving(false);
  };

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gaff-teal/30 focus:border-gaff-teal transition-colors';

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isLandlord = user.role === 'LANDLORD';
  const isAgent = user.role === 'AGENT';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gaff-slate">Edit Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Update your public profile information</p>
        </div>
        <a href={`/user/${user.id}`} className="text-sm font-medium text-gaff-teal hover:underline">
          View public profile →
        </a>
      </div>

      {/* Verification status banner */}
      {!user.emailVerified && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">Email not verified</p>
            <p className="text-xs text-amber-700">Verify your email to unlock all features.</p>
          </div>
          <a href="/dashboard/verification" className="text-xs font-semibold text-amber-800 hover:underline shrink-0">Verify →</a>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gaff-slate mb-4">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gaff-teal/10 flex items-center justify-center text-gaff-teal text-3xl font-bold shrink-0 overflow-hidden relative">
              {avatar ? (
                <img src={avatar} alt="" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <span>{name.charAt(0).toUpperCase() || '?'}</span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gaff-slate hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload photo'}
              </button>
              <p className="text-xs text-gray-400">JPG, PNG or WebP — max 5 MB</p>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-bold text-gaff-slate">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gaff-slate mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gaff-slate mb-1.5">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+353 1 234 5678" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gaff-slate mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Tell people a bit about yourself..."
              className={`${inputClass} resize-none`}
            />
            <p className="text-xs text-gray-400 mt-1">{bio.length}/500</p>
          </div>
        </div>

        {/* Landlord-specific */}
        {isLandlord && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-gaff-slate">Landlord Details</h2>
              <p className="text-sm text-gray-500 mt-0.5">Required for verified landlord badge.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gaff-slate mb-1.5">RTB Registration Number</label>
              <input
                type="text"
                value={rtbNumber}
                onChange={(e) => setRtbNumber(e.target.value)}
                placeholder="RTB-123456"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">Find your RTB number at rtb.ie</p>
            </div>
          </div>
        )}

        {/* Agent-specific */}
        {isAgent && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-gaff-slate">Agency Details</h2>
              <p className="text-sm text-gray-500 mt-0.5">Required for verified agent badge.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gaff-slate mb-1.5">Agency / Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Dublin Lettings Ltd"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gaff-slate mb-1.5">PSRA Licence Number</label>
              <input
                type="text"
                value={rtbNumber}
                onChange={(e) => setRtbNumber(e.target.value)}
                placeholder="PSRA-001234"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">Property Services Regulatory Authority licence number</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pb-12">
          <button
            type="submit"
            disabled={saving}
            className="bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gaff-teal-dark transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gaff-slate">Cancel</a>
          <a href="/dashboard/verification" className="ml-auto text-sm font-medium text-gaff-teal hover:underline">
            Verification status →
          </a>
        </div>
      </form>
    </div>
  );
}
