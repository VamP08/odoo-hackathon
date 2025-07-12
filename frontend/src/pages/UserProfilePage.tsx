// src/pages/UserProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Calendar,
  Award,
  Package,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import { User, Item } from '../types';
import { ItemCard } from '../components/Items/ItemCard';

export function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'reviews'>('items');

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user
        const uRes = await apiFetch(`/api/users/${userId}`);
        if (!uRes.ok) throw new Error('Failed to load user');
        const uData: User = await uRes.json();
        setProfile(uData);

        // Fetch items by owner_id and approved
        const iRes = await apiFetch(`/api/items?owner_id=${userId}&is_approved=true`);
        if (!iRes.ok) throw new Error('Failed to load items');
        const iData: Item[] = await iRes.json();
        setItems(iData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? 'Error' : 'Not Found'}
          </h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <Link to="/browse" className="text-emerald-600 hover:underline">
            ← Back to browse
          </Link>
        </div>
      </div>
    );
  }

  const isOwn = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Back */}
        <Link to="/browse" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-1" /> Back to browse
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || profile.email}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-3xl text-gray-600">
                { (profile.full_name ?? profile.email)[0].toUpperCase() }
              </span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.full_name ?? profile.email}
                  {profile.role === 'admin' && (
                    <span className="ml-2 text-emerald-600">✓</span>
                  )}
                </h1>
                <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>5/5 (0 reviews)</span>
                  </div>
                </div>
              </div>

              {!isOwn && (
                <Link
                  to={`/messages?to=${profile.id}`}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  Send Message
                </Link>
              )}
            </div>

            {profile.role === 'admin' && (
              <div className="mt-4">
                <span className="inline-flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                  <Award className="h-4 w-4 mr-1" /> Administrator
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Swaps" value="0" icon={TrendingUp} color="emerald" />
          <StatCard label="Items Listed" value={String(items.length)} icon={Package} color="blue" />
          <StatCard label="Rating" value="5/5" icon={Star} color="yellow" />
          <StatCard label="Points" value={String(profile.points_balance)} icon={Award} color="purple" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow">
          <TabNav active={activeTab} setActive={setActiveTab} counts={{ items: items.length, reviews: 0 }} />

          <div className="p-6">
            {activeTab === 'items' ? (
              items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map(it => <ItemCard key={it.id} item={it} />)}
                </div>
              ) : (
                <EmptyState message={
                  isOwn
                    ? "You haven't listed any items yet."
                    : `${profile.full_name ?? profile.email} hasn't listed any items yet.`
                } icon={Package} />
              )
            ) : (
              <EmptyState message="Reviews coming soon." icon={Star} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components:

function StatCard({ label, value, icon: Icon, color }:
  { label: string; value: string; icon: React.FC<any>; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      </div>
      <div className={`bg-${color}-100 p-3 rounded-full`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  );
}

function TabNav({ active, setActive, counts }:
  { active: string; setActive: (t: 'items'|'reviews') => void; counts: { items: number; reviews: number } }) {
  return (
    <nav className="border-b border-gray-200">
      <div className="flex space-x-8 px-6">
        {(['items','reviews'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              active === tab
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
          </button>
        ))}
      </div>
    </nav>
  );
}

function EmptyState({ message, icon: Icon }:
  { message: string; icon: React.FC<any> }) {
  return (
    <div className="text-center py-12">
      <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600">Check back later.</p>
    </div>
  );
}
