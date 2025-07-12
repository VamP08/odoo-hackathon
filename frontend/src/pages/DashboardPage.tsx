// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Package,
  ArrowUpDown,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import { Item, Swap, PointsTransaction } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [points, setPoints] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        // 1) Fetch your items
        const resI = await apiFetch(`/api/items?owner_id=${user.id}`);
        const myItems: Item[] = await resI.json();

        // 2) Fetch all swaps (we'll filter locally)
        const resS = await apiFetch(`/api/swaps`);
        const allSwaps: Swap[] = await resS.json();

        // 3) Fetch your points transactions
        const resP = await apiFetch(`/api/points`);
        const allPoints: PointsTransaction[] = await resP.json();

        setItems(myItems);
        setSwaps(allSwaps);
        setPoints(allPoints);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Please log in</h2>
          <Link to="/login" className="text-emerald-600 hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full" />
      </div>
    );
  }

  // Filter your swaps:
  const mySwaps = swaps.filter(s =>
    s.requester_id === user.id ||
    items.some(i => i.id === s.requested_item_id)
  );

  // Stats
  const totalItems    = items.length;
  const activeSwaps   = mySwaps.filter(s => s.status === 'pending').length;
  const completedSwaps= mySwaps.filter(s => s.status === 'accepted').length; // no 'completed' in swap_status
  const pointsEarned  = points
    .filter(p => p.user_id === user.id && p.change_amount > 0)
    .reduce((sum, p) => sum + p.change_amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Greeting */}
        <header>
          <h1 className="text-3xl font-bold">Welcome back, {user.full_name || user.email}!</h1>
          <p className="text-gray-600">Manage your items and swaps</p>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Current Points */}
          <StatCard
            label="Current Points"
            value={user.points_balance}
            icon={<Star className="h-6 w-6 text-emerald-600" />}
            bg="emerald"
          />
          {/* Listed Items */}
          <StatCard
            label="Listed Items"
            value={totalItems}
            icon={<Package className="h-6 w-6 text-blue-600" />}
            bg="blue"
          />
          {/* Active Swaps */}
          <StatCard
            label="Active Swaps"
            value={activeSwaps}
            icon={<ArrowUpDown className="h-6 w-6 text-orange-600" />}
            bg="orange"
          />
          {/* Points Earned */}
          <StatCard
            label="Points Earned"
            value={pointsEarned}
            icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
            bg="purple"
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* My Items */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Items</h2>
              <Link
                to="/add-item"
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </Link>
            </div>
            {items.length ? (
              items.slice(0, 3).map(it => (
                <ItemRow key={it.id} item={it} />
              ))
            ) : (
              <EmptyState
                icon={<Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />}
                title="No items yet"
                subtitle="Start by listing your first item."
                actionText="Add Item"
                actionTo="/add-item"
              />
            )}
          </div>

          {/* Recent Swaps */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {mySwaps.length ? (
              mySwaps.slice(0, 3).map(s => {
                const it = items.find(i => i.id === s.requested_item_id);
                return it ? <SwapRow key={s.id} swap={s} item={it} userId={user.id}/> : null;
              })
            ) : (
              <EmptyState
                icon={<ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-2" />}
                title="No swaps yet"
                subtitle="Browse items to start swapping."
                actionText="Browse"
                actionTo="/browse"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ——— Helper components ———

function StatCard({
  label,
  value,
  icon,
  bg
}:{
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: 'emerald'|'blue'|'orange'|'purple'
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-2xl font-bold text-${bg}-600`}>{value}</p>
      </div>
      <div className={`bg-${bg}-100 p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  );
}

function ItemRow({ item }: { item: Item }) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <img
        src={item.images[0]}
        alt={item.title}
        className="h-16 w-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-gray-600">
          {item.point_cost} pts • {item.status}
        </p>
      </div>
      <Link
        to={`/item/${item.id}`}
        className="text-emerald-600 hover:underline text-sm"
      >
        View
      </Link>
    </div>
  );
}

function SwapRow({
  swap,
  item,
  userId
}:{
  swap: Swap;
  item: Item;
  userId: string;
}) {
  const isRequester = swap.requester_id === userId;
  return (
    <div className="flex items-center space-x-4 mb-4 border rounded p-4 hover:shadow-sm">
      <img
        src={item.images[0]}
        alt={item.title}
        className="h-16 w-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-gray-600">
          {isRequester
            ? `You requested from ${item.ownerName}`
            : `${swap.requesterName} requested yours`}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(swap.created_at).toLocaleDateString()}
        </p>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        swap.status === 'accepted'? 'bg-green-100 text-green-800' :
        swap.status === 'rejected'? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {swap.status}
      </span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
  actionText,
  actionTo
}:{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actionText: string;
  actionTo: string;
}) {
  return (
    <div className="text-center py-8 space-y-2">
      {icon}
      <p className="text-lg font-medium">{title}</p>
      <p className="text-gray-600">{subtitle}</p>
      <Link
        to={actionTo}
        className="mt-4 inline-block bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        {actionText}
      </Link>
    </div>
  );
}
