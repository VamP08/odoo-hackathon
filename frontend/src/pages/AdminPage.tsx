import React, { useState, useEffect } from 'react';
import {
  Shield,
  Check,
  X,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import { Item } from '../types';

export function AdminPage() {
  const { user } = useAuth();
  const [pending, setPending] = useState<Item[]>([]);
  const [approved, setApproved] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending'|'approved'>('pending');

  // load both lists in parallel
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pRes, aRes] = await Promise.all([
          apiFetch('/api/items?is_approved=false'),
          apiFetch('/api/items?is_approved=true'),
        ]);
        if (!pRes.ok || !aRes.ok) throw new Error('Fetch failed');
        setPending(await pRes.json());
        setApproved(await aRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const moderate = async (id: string, approve: boolean) => {
    try {
      const res = await apiFetch(`/api/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_approved: approve }),
      });
      if (!res.ok) throw new Error('Update failed');
      // move item between lists
      setPending(p =>
        p.filter(x => x.id !== id)
      );
      if (approve) {
        const moved = pending.find(x => x.id === id)!;
        setApproved(a => [ { ...moved, is_approved: true }, ...a ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-xl font-bold">Access Denied</p>
      </div>
    );
  }

  const stats = {
    pending: pending.length,
    approved: approved.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">Moderate user‑submitted items</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          <AlertTriangle className="h-6 w-6 text-orange-600 mt-2" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <Check className="h-6 w-6 text-green-600 mt-2" />
        </div>
      </section>

      <nav className="flex space-x-8 mb-4 border-b border-gray-200">
        {(['pending','approved'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 ${
              tab === t
                ? 'border-b-2 border-emerald-500 text-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} ({tab==='pending'?stats.pending:stats.approved})
          </button>
        ))}
      </nav>

      {loading ? (
        <p>Loading…</p>
      ) : tab === 'pending' ? (
        pending.length ? (
          <div className="space-y-6">
            {pending.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-lg flex items-start space-x-4">
                <img
                  src={item.images[0] || '/placeholder.jpg'}
                  alt={item.title}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => moderate(item.id, true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
                    >
                      <Check className="h-4 w-4" /><span>Approve</span>
                    </button>
                    <button
                      onClick={() => moderate(item.id, false)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
                    >
                      <X className="h-4 w-4" /><span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending items.</p>
        )
      ) : (
        approved.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approved.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  src={item.images[0] || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.category_id}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No approved items yet.</p>
        )
      )}
    </div>
  );
}
