import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, ArrowUpDown, Star, Calendar, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { itemService } from '../services/itemService';
import { swapService } from '../services/swapService';
import { Item, Swap } from '../types';

export function DashboardPage() {
    const { user } = useAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [swaps, setSwaps] = useState<Swap[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch all items and swaps, then filter on client side
                const [allItems, allSwaps] = await Promise.all([
                    itemService.getAllItems(),
                    swapService.getAllSwaps()
                ]);

                setItems(allItems);
                setSwaps(allSwaps);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
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
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-700">
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const userItems = items.filter(item => item.owner_id === user.id);
    const userSwapRequests = swaps.filter(swap =>
        swap.requester_id === user.id ||
        items.some(item => item.id === swap.requested_item_id && item.owner_id === user.id)
    );

    const stats = {
        totalItems: userItems.length,
        activeSwaps: userSwapRequests.filter(swap => swap.status === 'pending').length,
        completedSwaps: userSwapRequests.filter(swap => swap.status === 'accepted').length,
        pointsEarned: userItems.reduce((sum, item) => sum + (item.status === 'swapped' ? (item.point_cost || 0) : 0), 0)
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.full_name || user.email}!</h1>
                    <p className="text-gray-600">Manage your items and track your swapping activity</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Current Points</p>
                                <p className="text-2xl font-bold text-emerald-600">{user.points_balance}</p>
                            </div>
                            <div className="bg-emerald-100 rounded-full p-3">
                                <Star className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Listed Items</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-3">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Swaps</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeSwaps}</p>
                            </div>
                            <div className="bg-orange-100 rounded-full p-3">
                                <ArrowUpDown className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Points Earned</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pointsEarned}</p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-3">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* My Items */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
                                <Link
                                    to="/add-item"
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Item</span>
                                </Link>
                            </div>
                        </div>

                        <div className="p-6">
                            {userItems.length > 0 ? (
                                <div className="space-y-4">
                                    {userItems.slice(0, 3).map(item => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                            {item.images && item.images.length > 0 ? (
                                                <img src={item.images[0]} alt={item.title} className="h-16 w-16 rounded-lg object-cover" />
                                            ) : (
                                                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-gray-500" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                                <p className="text-sm text-gray-600">{item.category_id ? `Category ${item.category_id}` : 'No category'} • {item.size || 'No size'}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'available' ? 'bg-green-100 text-green-800' :
                                                            item.status === 'pending_swap' ? 'bg-yellow-100 text-yellow-800' :
                                                                item.status === 'swapped' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {item.status.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{item.point_cost || 0} pts</span>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/item/${item.id}`}
                                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    ))}
                                    {userItems.length > 3 && (
                                        <div className="text-center pt-4">
                                            <Link to="/my-items" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                                View all {userItems.length} items →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                                    <p className="text-gray-600 mb-4">Start by adding your first item to the community</p>
                                    <Link
                                        to="/add-item"
                                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add Your First Item</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Swaps */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                        </div>

                        <div className="p-6">
                            {userSwapRequests.length > 0 ? (
                                <div className="space-y-4">
                                    {userSwapRequests.slice(0, 3).map(swap => (
                                        <div key={swap.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{swap.requestedItemTitle || `Item ${swap.requested_item_id}`}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {swap.requester_id === user.id ? 'You requested' : `${swap.requesterName || 'Someone'} requested`}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                                swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                    'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {swap.status}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{new Date(swap.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {userSwapRequests.length > 3 && (
                                        <div className="text-center pt-4">
                                            <Link to="/swaps" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                                View all activity →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps yet</h3>
                                    <p className="text-gray-600 mb-4">Browse items to start your first swap</p>
                                    <Link
                                        to="/browse"
                                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        Browse Items
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-gradient-to-r from-emerald-50 to-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            to="/add-item"
                            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                        >
                            <Plus className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                            <p className="font-medium text-gray-900">Add New Item</p>
                            <p className="text-sm text-gray-600">List clothing for swap</p>
                        </Link>

                        <Link
                            to="/browse"
                            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                        >
                            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <p className="font-medium text-gray-900">Browse Items</p>
                            <p className="text-sm text-gray-600">Find new pieces</p>
                        </Link>

                        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                            <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <p className="font-medium text-gray-900">Earn Points</p>
                            <p className="text-sm text-gray-600">Complete swaps</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}