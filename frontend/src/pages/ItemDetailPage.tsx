// src/pages/ItemDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  User as UserIcon,
  Calendar,
  Tag,
  Package,
  Shirt
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import { Item, User } from '../types';

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem]       = useState<Item | null>(null);
  const [owner, setOwner]     = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [swapMsg, setSwapMsg] = useState('');
  const [showSwap, setShowSwap]     = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Fetch item
        const resI = await apiFetch(`/api/items/${id}`);
        if (!resI.ok) throw new Error('Item not found');
        const itemData: Item = await resI.json();
        setItem(itemData);

        // 2) Fetch uploader
        const resU = await apiFetch(`/api/users/${itemData.owner_id}`);
        if (resU.ok) {
          const userData: User = await resU.json();
          setOwner(userData);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full" />
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl text-red-600">{error || 'Item not found'}</h2>
        <Link to="/browse" className="text-emerald-600 hover:underline">← Back</Link>
      </div>
    </div>
  );

  const canRedeem = user && item.point_cost && user.points_balance >= item.point_cost;

  // POST swap request
  const requestSwap = async () => {
    if (!user) return navigate('/login');
    await apiFetch('/api/swaps', {
      method: 'POST',
      body: JSON.stringify({ requested_item_id: item.id })
    });
    alert('Swap requested!');
    setShowSwap(false);
  };

  // POST point redemption
  const redeem = async () => {
    if (!user) return navigate('/login');
    await apiFetch('/api/points', {
      method: 'POST',
      body: JSON.stringify({
        change_amount: -item.point_cost!,
        transaction_type: 'redeem_item',
        reference_id: item.id
      })
    });
    alert('Redeemed successfully!');
    setShowRedeem(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <Link to="/browse" className="inline-flex items-center text-gray-600">
          <ArrowLeft className="mr-1" /> Back
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-4 shadow">
              <img
                src={item.images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((src,i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square overflow-hidden rounded ${selectedImage===i?'ring-2 ring-emerald-600':''}`}
                  >
                    <img src={src} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white p-8 rounded-2xl shadow">
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-2 py-1 rounded-full text-sm ${
                item.condition==='New'      ? 'bg-green-100 text-green-800' :
                item.condition==='Like New'? 'bg-blue-100 text-blue-800' :
                item.condition==='Good'    ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>{item.condition}</span>
              {item.point_cost && (
                <span className="bg-yellow-50 px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star className="text-yellow-500 h-4 w-4"/>
                  <span>{item.point_cost} pts</span>
                </span>
              )}
            </div>

            <p className="mb-6 text-gray-700">{item.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5"/>
                <span>Category:</span><span>{item.category_id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shirt className="h-5 w-5"/>
                <span>Size:</span><span>{item.size}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5"/>
                <span>Condition:</span><span>{item.condition}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5"/>
                <span>Listed:</span><span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Owner */}
            {owner && (
              <div className="bg-gray-50 p-4 rounded-lg flex items-center mb-6">
                {owner.avatar_url
                  ? <img src={owner.avatar_url} className="h-12 w-12 rounded-full mr-3"/>
                  : <UserIcon className="h-12 w-12 text-gray-400 mr-3"/>
                }
                <div>
                  <Link to={`/profile/${owner.id}`} className="font-medium hover:underline">
                    {owner.full_name || owner.email}
                  </Link>
                  <p className="text-sm text-gray-600">
                    Joined {new Date(owner.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              {user?.id !== item.owner_id ? (
                <>
                  <button
                    onClick={() => setShowSwap(true)}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg"
                  >
                    Request Swap
                  </button>
                  <button
                    disabled={!canRedeem}
                    onClick={() => setShowRedeem(true)}
                    className="w-full border border-emerald-600 text-emerald-600 py-3 rounded-lg disabled:opacity-50"
                  >
                    Redeem ({item.point_cost} pts)
                  </button>
                </>
              ) : (
                <p className="text-center text-gray-500">This is your item</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeem && (
        <Modal onClose={() => setShowRedeem(false)}>
          <h3 className="text-lg font-bold mb-4">Confirm Redemption</h3>
          <p className="mb-6">Redeem "{item.title}" for {item.point_cost} points?</p>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowRedeem(false)} className="px-4 py-2">Cancel</button>
            <button onClick={redeem} className="px-4 py-2 bg-emerald-600 text-white rounded">Confirm</button>
          </div>
        </Modal>
      )}

      {/* Swap Modal */}
      {showSwap && (
        <Modal onClose={() => setShowSwap(false)}>
          <h3 className="text-lg font-bold mb-4">Request Swap</h3>
          <textarea
            value={swapMsg}
            onChange={e => setSwapMsg(e.target.value)}
            placeholder="Optional message…"
            className="w-full border p-2 rounded mb-4"
            rows={3}
          />
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowSwap(false)} className="px-4 py-2">Cancel</button>
            <button onClick={requestSwap} className="px-4 py-2 bg-emerald-600 text-white rounded">
              Send Request
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Generic modal wrapper
function Modal({ children, onClose }: { children: React.ReactNode; onClose: ()=>void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        {children}
      </div>
      <button onClick={onClose} className="fixed inset-0 w-full h-full" aria-label="Close"></button>
    </div>
  );
}
