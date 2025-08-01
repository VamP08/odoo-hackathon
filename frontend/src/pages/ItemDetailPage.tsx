// src/pages/ItemDetailPage.tsx

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  User as UserIcon,
  Shirt,
  Calendar,
  Package,
  Tag,
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import { Item, User } from '../types';

export function ItemDetailPage() {
  const { id }      = useParams<{ id: string }>();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [item, setItem]             = useState<Item | null>(null);
  const [owner, setOwner]           = useState<User | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSwap, setShowSwap]     = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);

  // Load item and its owner on mount
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) Fetch the item
        const resItem = await apiFetch(`/api/items/${id}`);
        if (!resItem.ok) throw new Error('Failed to fetch item');
        const itemData: Item = await resItem.json();
        setItem(itemData);

        // 2) Fetch the owner
        const resOwner = await apiFetch(`/api/users/${itemData.owner_id}`);
        if (resOwner.ok) {
          const ownerData: User = await resOwner.json();
          setOwner(ownerData);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Show loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full" />
      </div>
    );
  }

  // Show error or “not found”
  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Item not found'}</p>
          <Link to="/browse" className="text-emerald-600 hover:underline">
            ← Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  // Can the user redeem by points?
  const canRedeem =
    user != null &&
    item.point_cost != null &&
    user.points_balance >= item.point_cost;

  // POST swap request
  const requestSwap = async () => {
    if (!user) return navigate('/login');
    await apiFetch('/api/swaps', {
      method: 'POST',
      body: JSON.stringify({
        requester_id: user.id,
        requested_item_id: item.id,
      }),
    });
    alert('Swap requested successfully');
    setShowSwap(false);
  };

  // POST redeem request
  const requestRedeem = async () => {
    if (!user || item.point_cost == null) return navigate('/login');
    await apiFetch('/api/points_transactions', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user.id,
        change_amount: -item.point_cost,
        transaction_type: 'redeem_item',
        reference_id: item.id,
      }),
    });
    alert('Item redeemed successfully');
    setShowRedeem(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Back link */}
        <Link to="/browse" className="inline-flex items-center text-gray-600">
          <ArrowLeft className="mr-1" /> Back to Browse
        </Link>

        {/* Gallery & Details */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
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
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square overflow-hidden rounded ${
                      idx === selectedImage
                        ? 'ring-2 ring-emerald-600'
                        : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${item.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow space-y-4">
              {/* Title & Condition */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {item.title}
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.condition === 'New'
                        ? 'bg-green-100 text-green-800'
                        : item.condition === 'Like New'
                        ? 'bg-blue-100 text-blue-800'
                        : item.condition === 'Good'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.condition}
                  </span>
                  {item.point_cost != null && (
                    <span className="bg-yellow-50 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Star className="text-yellow-500 h-4 w-4" />
                      <span>{item.point_cost} pts</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700">{item.description}</p>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Category:</span>
                  <span>
                    {item.category_id != null
                      ? `#${item.category_id}`
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shirt className="h-5 w-5" />
                  <span>Size:</span>
                  <span>{item.size || '—'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Condition:</span>
                  <span>{item.condition || '—'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Listed:</span>
                  <span>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Uploader Info */}
              {owner && (
                <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                  {owner.avatar_url ? (
                    <img
                      src={owner.avatar_url}
                      alt={owner.full_name || owner.email}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  )}
                  <div>
                    <Link
                      to={`/profile/${owner.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {owner.full_name || owner.email}
                    </Link>
                    <p className="text-sm text-gray-600">
                      Joined{' '}
                      {new Date(owner.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {user && user.id !== item.owner_id ? (
                  <>
                    <button
                      onClick={() => setShowSwap(true)}
                      className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
                    >
                      Request Swap
                    </button>
                    <button
                      onClick={() => setShowRedeem(true)}
                      disabled={!canRedeem}
                      className="w-full border border-emerald-600 text-emerald-600 py-3 rounded-lg hover:bg-emerald-50 transition disabled:opacity-50"
                    >
                      Redeem with Points
                    </button>
                  </>
                ) : !user ? (
                  <Link
                    to="/login"
                    className="block w-full text-center bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
                  >
                    Log in to Swap / Redeem
                  </Link>
                ) : (
                  <p className="text-center text-gray-500">
                    You are the owner
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwap && (
        <Modal onClose={() => setShowSwap(false)}>
          <h3 className="text-xl font-bold mb-4">Request Swap</h3>
          <p className="mb-6">
            Are you sure you want to send a swap request for “{item.title}”?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowSwap(false)}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              onClick={requestSwap}
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}

      {/* Redeem Modal */}
      {showRedeem && (
        <Modal onClose={() => setShowRedeem(false)}>
          <h3 className="text-xl font-bold mb-4">Redeem Item</h3>
          <p className="mb-6">
            Redeem “{item.title}” for {item.point_cost} points?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowRedeem(false)}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              onClick={requestRedeem}
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Basic Modal wrapper
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 mx-4 max-w-md w-full">
        {children}
      </div>
      <div
        onClick={onClose}
        className="fixed inset-0"
        aria-label="Close modal"
      />
    </div>
  );
}
