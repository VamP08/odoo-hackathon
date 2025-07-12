import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, Clock, Check, X, MessageSquare, Package, User, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { swapService } from '../services/swapService';
import { itemService } from '../services/itemService';
import { pointService } from '../services/pointService';
import { Swap, Item } from '../types';

export function SwapRequestsPage() {
    const { user } = useAuth();
    const [swapRequests, setSwapRequests] = useState<Swap[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                const [swapsData, itemsData] = await Promise.all([
                    swapService.getAllSwaps(),
                    itemService.getAllItems()
                ]);

                setSwapRequests(swapsData);
                setItems(itemsData);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load swap requests. Please try again.');
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

    const incomingRequests = swapRequests.filter(request => {
        const item = items.find(i => i.id === request.requested_item_id);
        return item?.owner_id === user.id;
    });

    const outgoingRequests = swapRequests.filter(request =>
        request.requester_id === user.id
    );

    const handleAcceptRequest = async (requestId: string) => {
        const request = swapRequests.find(r => r.id === requestId);
        if (!request) return;

        try {
            await swapService.updateSwap(requestId, {
                status: 'accepted'
            });

            // Update local state
            setSwapRequests(prev => prev.map(r =>
                r.id === requestId
                    ? { ...r, status: 'accepted' as const }
                    : r
            ));
        } catch (err) {
            console.error('Failed to accept request:', err);
            setError('Failed to accept request. Please try again.');
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            await swapService.updateSwap(requestId, {
                status: 'rejected'
            });

            // Update local state
            setSwapRequests(prev => prev.map(r =>
                r.id === requestId
                    ? { ...r, status: 'rejected' as const }
                    : r
            ));
        } catch (err) {
            console.error('Failed to reject request:', err);
            setError('Failed to reject request. Please try again.');
        }
    };

    const handleCompleteSwap = async (requestId: string) => {
        const request = swapRequests.find(r => r.id === requestId);
        if (!request) return;

        try {
            await swapService.updateSwap(requestId, {
                status: 'completed'
            });

            // Award points to item owner
            const item = items.find(i => i.id === request.requested_item_id);
            if (item && item.point_cost) {
                await pointService.createPointTransaction({
                    change_amount: item.point_cost,
                    transaction_type: 'earn_swap',
                    reference_id: requestId
                });
            }

            // Update local state
            setSwapRequests(prev => prev.map(r =>
                r.id === requestId
                    ? { ...r, status: 'completed' as const }
                    : r
            ));
        } catch (err) {
            console.error('Failed to complete swap:', err);
            setError('Failed to complete swap. Please try again.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const currentRequests = activeTab === 'incoming' ? incomingRequests : outgoingRequests;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading swap requests...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
                    <p className="text-gray-600">Manage your incoming and outgoing swap requests</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('incoming')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'incoming'
                                        ? 'border-emerald-500 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Incoming Requests ({incomingRequests.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('outgoing')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'outgoing'
                                        ? 'border-emerald-500 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Outgoing Requests ({outgoingRequests.length})
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {currentRequests.length > 0 ? (
                            <div className="space-y-6">
                                {currentRequests.map(request => {
                                    const item = items.find(i => i.id === request.requested_item_id);
                                    if (!item) return null;

                                    return (
                                        <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start space-x-4">
                                                <img
                                                    src={item.images?.[0] || '/placeholder-image.jpg'}
                                                    alt={item.title}
                                                    className="h-20 w-20 rounded-lg object-cover"
                                                />

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                                            <p className="text-gray-600">
                                                                {activeTab === 'incoming'
                                                                    ? `Request from ${request.requesterName || 'User'}`
                                                                    : `Your request to ${item.ownerName || 'Owner'}`
                                                                }
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                                            {request.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        {item.point_cost && (
                                                            <div className="flex items-center space-x-2">
                                                                <Package className="h-4 w-4" />
                                                                <span>Points: {item.point_cost}</span>
                                                            </div>
                                                        )}
                                                        {request.status === 'completed' && (
                                                            <div className="flex items-center space-x-2">
                                                                <Check className="h-4 w-4" />
                                                                <span>Completed: {new Date(request.updated_at).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    {activeTab === 'incoming' && request.status === 'pending' && (
                                                        <div className="flex space-x-3">
                                                            <button
                                                                onClick={() => handleAcceptRequest(request.id)}
                                                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                                <span>Accept</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectRequest(request.id)}
                                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                <span>Decline</span>
                                                            </button>
                                                            <Link
                                                                to={`/messages?user=${request.requester_id}`}
                                                                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                                            >
                                                                <MessageSquare className="h-4 w-4" />
                                                                <span>Message</span>
                                                            </Link>
                                                        </div>
                                                    )}

                                                    {activeTab === 'incoming' && request.status === 'accepted' && (
                                                        <button
                                                            onClick={() => handleCompleteSwap(request.id)}
                                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                                        >
                                                            <Package className="h-4 w-4" />
                                                            <span>Mark as Completed</span>
                                                        </button>
                                                    )}

                                                    {activeTab === 'outgoing' && request.status === 'pending' && (
                                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Waiting for response...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <ArrowUpDown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No {activeTab} requests
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {activeTab === 'incoming'
                                        ? "You haven't received any swap requests yet."
                                        : "You haven't made any swap requests yet."
                                    }
                                </p>
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
        </div>
    );
}