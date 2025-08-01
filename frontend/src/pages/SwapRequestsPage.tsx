// src/pages/SwapRequestsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpDown,
  Clock,
  Check,
  X,
  Package,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import { SwapStatus, Item } from '../types';

export function SwapRequestsPage() {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState<SwapStatus[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) fetch swaps for this user
        const resSwaps = await apiFetch('/api/swaps', { method: 'GET' });
        if (!resSwaps.ok) throw new Error('Unable to load swaps');
        const swapsData: Swap[] = await resSwaps.json();

        // 2) fetch this user's items
        const resItems = await apiFetch(`/api/items?owner_id=${user.id}`);
        if (!resItems.ok) throw new Error('Unable to load your items');
        const itemsData: Item[] = await resItems.json();

        setSwaps(swapsData);
        setItems(itemsData);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <Link to="/login" className="text-emerald-600 hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  // Separate incoming vs outgoing
  const incoming = swaps.filter(swap => {
    const item = items.find(i => i.id === swap.requested_item_id);
    return item?.owner_id === user.id;
  });
  const outgoing = swaps.filter(swap => swap.requester_id === user.id);

  // Update swap status by PUT /api/swaps/:id
  const updateStatus = async (swapId: string, status: SwapStatus['status']) => {
    try {
      const res = await apiFetch(`/api/swaps/${swapId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update swap');
      const updated: SwapStatus = await res.json();
      setSwaps(prev => prev.map(s => s.id === swapId ? updated : s));
    } catch (err) {
      console.error(err);
      setError('Could not update swap. Try again.');
    }
  };

  // Complete swap: mark accepted → completed + create points
  const completeSwap = async (swapId: string) => {
    const swap = swaps.find(s => s.id === swapId);
    if (!swap) return;

    // 1) update status
    await updateStatus(swapId, 'completed');

    // 2) award points: requested_item_id's point_cost
    const item = items.find(i => i.id === swap.requested_item_id);
    if (item?.point_cost) {
      await apiFetch('/api/points', {
        method: 'POST',
        body: JSON.stringify({
          change_amount: item.point_cost,
          transaction_type: 'earn_swap',
          reference_id: swapId,
        }),
      });
    }
  };

  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const list = activeTab === 'incoming' ? incoming : outgoing;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading swap requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
          <p className="text-gray-600">Manage incoming & outgoing swaps</p>
        </header>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow">
          <nav className="flex border-b border-gray-200">
            {(['incoming','outgoing'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-emerald-500 text-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab==='incoming'?incoming.length:outgoing.length})
              </button>
            ))}
          </nav>

          <div className="p-6 space-y-6">
            {list.length > 0 ? (
              list.map(request => {
                const item = items.find(i => i.id === request.requested_item_id);
                if (!item) return null;
                return (
                  <div
                    key={request.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 flex space-x-4 hover:shadow"
                  >
                    <img
                      src={item.images[0] || '/placeholder.jpg'}
                      alt={item.title}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                          <p className="text-gray-600 text-sm">
                            {activeTab==='incoming'
                              ? `From: ${request.requesterName ?? 'User'}`
                              : `To: ${item.ownerName ?? 'Owner'}`}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[request.status]}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap text-sm text-gray-600 gap-4 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                        {item.point_cost != null && (
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4" />
                            <span>{item.point_cost} pts</span>
                          </div>
                        )}
                        {request.status === 'completed' && (
                          <div className="flex items-center space-x-1">
                            <Check className="h-4 w-4" />
                            <span>{new Date(request.updated_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {activeTab==='incoming' && request.status==='pending' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => updateStatus(request.id, 'accepted')}
                            className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                          >
                            <Check className="h-4 w-4" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => updateStatus(request.id, 'rejected')}
                            className="bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                          >
                            <X className="h-4 w-4" />
                            <span>Decline</span>
                          </button>
                          {request.status==='accepted' && (
                            <button
                              onClick={() => completeSwap(request.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                            >
                              <Package className="h-4 w-4" />
                              <span>Complete</span>
                            </button>
                          )}
                        </div>
                      )}

                      {activeTab==='outgoing' && request.status==='pending' && (
                        <div className="flex items-center text-sm text-gray-500 space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Awaiting response</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 space-y-4">
                <ArrowUpDown className="h-16 w-16 text-gray-400 mx-auto" />
                <p className="text-lg text-gray-900">
                  No {activeTab === 'incoming' ? 'incoming' : 'outgoing'} swaps
                </p>
                <Link
                  to="/browse"
                  className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
                >
                  Browse Items
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
