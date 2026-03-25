'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';

interface ProfileData {
  id: string;
  name: string;
  phone?: string;
  role: string;
  avatar?: string;
  profile?: { bio?: string };
}

export default function ProfileEditPage() {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.user) {
          window.location.href = '/auth/login';
          return;
        }
        const u = d.user;
        // Fetch full profile
        fetch(`/api/users/${u.id}/profile`)
          .then((r) => (r.ok ? r.json() : null))
          .then((pd) => {
            if (pd?.user) {
              setUser(pd.user);
              setName(pd.user.name || '');
              setPhone(pd.user.phone || '');
              setBio(pd.user.profile?.bio || '');
              setAvatar(pd.user.avatar || '');
            }
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {
        window.location.href = '/auth/login';
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      addToast('Name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), bio: bio.trim(), avatar: avatar.trim() }),
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Edit Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Update your public profile information</p>
        </div>
        <a href={`/user/${user.id}`} className="text-sm font-medium text-[#0C9B8A] hover:underline">
          View public profile →
        </a>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0C9B8A]/10 flex items-center justify-center text-[#0C9B8A] text-2xl font-bold shrink-0 overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase() || '?'
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#1E293B] mb-1">Avatar URL</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+353 1 234 5678"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell people a bit about yourself..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A] resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{bio.length}/500 characters</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0C9B8A] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0a8a7a] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-[#1E293B]">Cancel</a>
        </div>
      </form>
    </div>
  );
}
