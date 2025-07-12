// src/pages/HistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpDown,
  Calendar,
  Package,
  Star,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import { Swap, Item, PointsTransaction } from '../types';

export function HistoryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'swaps' | 'points'>('swaps');
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [points, setPoints] = useState<PointsTransaction[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [rs, rp, ri] = await Promise.all([
          apiFetch('/api/swaps'),
          apiFetch('/api/points'),
          apiFetch(`/api/items?owner_id=${user.id}`)
        ]);
        const [swapsData, pointsData, itemsData] = await Promise.all([
          rs.json() as Promise<Swap[]>,
          rp.json() as Promise<PointsTransaction[]>,
          ri.json() as Promise<Item[]>
        ]);
        setSwaps(swapsData);
        setPoints(pointsData);
        setItems(itemsData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 border-b-2 border-emerald-600 rounded-full" />
      </div>
    );
  }

  // filter & sort
  const userSwaps = swaps
    .filter(s =>
      s.requester_id === user.id ||
      items.some(i => i.id === s.requested_item_id && i.owner_id === user.id)
    )
    .sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const userPoints = points
    .filter(p => p.user_id === user.id)
    .sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  // summary
  const completedCount = userSwaps.filter(s => s.status === 'completed').length;
  const earned = userPoints
    .filter(p => ['earn_listing','redeem_item','bonus','refund'].includes(p.transaction_type))
    .reduce((sum, p) => sum + p.change_amount, 0);
  const spent = userPoints
    .filter(p => p.change_amount < 0)
    .reduce((sum, p) => sum + Math.abs(p.change_amount), 0);

  const statusColor = (st: Swap['status']) => ({
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  }[st] || 'bg-gray-100 text-gray-800');

  const iconFor = (tx: PointsTransaction) => {
    if (tx.change_amount > 0) return <TrendingUp className="text-green-600 h-4 w-4" />;
    if (tx.change_amount < 0) return <TrendingDown className="text-red-600 h-4 w-4" />;
    return <Star className="text-gray-600 h-4 w-4" />;
  };

  const colorFor = (tx: PointsTransaction) =>
    tx.change_amount > 0 ? 'text-green-600' : 'text-red-600';

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto space-y-6 px-4">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">History</h1>
          <p className="text-gray-600">Your swaps & point transactions</p>
        </header>

        {/* summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { label: 'Total Swaps', value: userSwaps.length, icon: ArrowUpDown, color: 'emerald' },
            { label: 'Completed', value: completedCount, icon: Package, color: 'blue' },
            { label: 'Points Earned', value: earned, icon: TrendingUp, color: 'green' },
            { label: 'Points Spent', value: spent, icon: TrendingDown, color: 'red' }
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                </div>
                <div className={`bg-${color}-100 p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="bg-white rounded-xl shadow">
          <nav className="flex border-b border-gray-200 px-6">
            {(['swaps','points'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 mr-6 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-emerald-500 text-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'swaps' ? `Swap History (${userSwaps.length})`
                  : `Points History (${userPoints.length})`}
              </button>
            ))}
          </nav>

          <div className="p-6 space-y-6">
            {activeTab === 'swaps'
              ? (userSwaps.length
                  ? userSwaps.map(swap => {
                      const item = items.find(i => i.id === swap.requested_item_id);
                      if (!item) return null;
                      const isRequester = swap.requester_id === user.id;
                      return (
                        <div
                          key={swap.id}
                          className="border p-4 rounded-lg flex space-x-4 hover:shadow-sm"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-semibold">{item.title}</h3>
                              <span className={`px-2 py-1 rounded-full ${statusColor(swap.status)}`}>
                                {swap.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {isRequester
                                ? `You requested from ${item.ownerName}`
                                : `${swap.requesterName} requested yours`}
                            </p>
                            <div className="mt-2 text-sm text-gray-500 flex space-x-4">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{fmt(swap.created_at)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : <Empty label="No swap history" linkText="Browse Items" linkTo="/browse" />
                )
              : (userPoints.length
                  ? userPoints.map(tx => (
                      <div
                        key={tx.id}
                        className="border p-4 rounded-lg flex justify-between hover:shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-full">
                            {iconFor(tx)}
                          </div>
                          <div>
                            <h3 className="font-medium">{tx.transaction_type}</h3>
                            <p className="text-sm text-gray-500">{fmt(tx.created_at)}</p>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${colorFor(tx)}`}>
                          {tx.change_amount > 0 ? '+' : '-'}
                          {Math.abs(tx.change_amount)} pts
                        </div>
                      </div>
                    ))
                  : <Empty label="No point transactions" linkText="List an Item" linkTo="/add-item" />
                )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable empty state
function Empty({ label, linkText, linkTo }: { label: string; linkText: string; linkTo: string }) {
  return (
    <div className="text-center py-12 space-y-4">
      <ArrowUpDown className="h-16 w-16 text-gray-400 mx-auto" />
      <p className="text-lg font-medium">{label}</p>
      <Link to={linkTo} className="bg-emerald-600 text-white px-6 py-2 rounded">
        {linkText}
      </Link>
    </div>
  );
}
