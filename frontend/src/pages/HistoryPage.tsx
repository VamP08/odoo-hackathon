import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Package, ArrowUpDown, Star, Calendar, User, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { swapService } from '../services/swapService';
import { pointService } from '../services/pointService';
import { itemService } from '../services/itemService';

export function HistoryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'swaps' | 'points'>('swaps');
  const [swapRequests, setSwapRequests] = useState<any[]>([]);
  const [pointTransactions, setPointTransactions] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [swapsData, pointsData, itemsData] = await Promise.all([
          swapService.getAllSwaps(),
          pointService.getAllPointTransactions(),
          itemService.getAllItems()
        ]);
        
        setSwapRequests(swapsData);
        setPointTransactions(pointsData);
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching history data:', error);
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  // Get user's swap history
  const userSwaps = swapRequests.filter(request => 
    request.requesterId === user.id || 
    items.some(item => item.id === request.itemId && item.uploaderId === user.id)
  ).sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  // Get user's point transactions
  const userPointTransactions = pointTransactions
    .filter(transaction => transaction.userId === user.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
      case 'bonus':
      case 'refund':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'spent':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Star className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-600';
      case 'spent': return 'text-red-600';
      case 'bonus': return 'text-blue-600';
      case 'refund': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPointsEarned = userPointTransactions
    .filter(t => ['earned', 'bonus', 'refund'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPointsSpent = userPointTransactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const completedSwaps = userSwaps.filter(s => s.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">History</h1>
          <p className="text-gray-600">Track your swaps and point transactions</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                <p className="text-2xl font-bold text-emerald-600">{userSwaps.length}</p>
              </div>
              <div className="bg-emerald-100 rounded-full p-3">
                <ArrowUpDown className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{completedSwaps}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-green-600">+{totalPointsEarned}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points Spent</p>
                <p className="text-2xl font-bold text-red-600">-{totalPointsSpent}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('swaps')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'swaps'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Swap History ({userSwaps.length})
              </button>
              <button
                onClick={() => setActiveTab('points')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'points'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Points History ({userPointTransactions.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'swaps' && (
              <div>
                {userSwaps.length > 0 ? (
                  <div className="space-y-4">
                    {userSwaps.map(swap => {
                      const item = items.find(i => i.id === swap.itemId);
                      const isRequester = swap.requesterId === user.id;
                      
                      if (!item) return null;

                      return (
                        <div key={swap.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                  <p className="text-gray-600">
                                    {isRequester 
                                      ? `You requested this item from ${item.uploaderName}`
                                      : `${swap.requesterName} requested your item`
                                    }
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(swap.status)}`}>
                                  {swap.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Created: {formatDate(swap.createdDate)}</span>
                                </div>
                                {swap.pointsOffered && (
                                  <div className="flex items-center space-x-2">
                                    <Star className="h-4 w-4" />
                                    <span>Points: {swap.pointsOffered}</span>
                                  </div>
                                )}
                                {swap.completedDate && (
                                  <div className="flex items-center space-x-2">
                                    <Package className="h-4 w-4" />
                                    <span>Completed: {formatDate(swap.completedDate)}</span>
                                  </div>
                                )}
                              </div>

                              {swap.message && (
                                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                  <p className="text-sm text-gray-700">
                                    <strong>Message:</strong> {swap.message}
                                  </p>
                                </div>
                              )}

                              {swap.response && (
                                <div className="mt-2 bg-emerald-50 rounded-lg p-3">
                                  <p className="text-sm text-emerald-700">
                                    <strong>Response:</strong> {swap.response}
                                  </p>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No swap history</h3>
                    <p className="text-gray-600 mb-4">You haven't made any swaps yet.</p>
                    <Link
                      to="/browse"
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Browse Items
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'points' && (
              <div>
                {userPointTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {userPointTransactions.map(transaction => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gray-100 rounded-full p-2">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            
                            <div>
                              <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(transaction.timestamp)}</span>
                                </div>
                                {transaction.relatedItemTitle && (
                                  <div className="flex items-center space-x-1">
                                    <Package className="h-3 w-3" />
                                    <span>{transaction.relatedItemTitle}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                              {transaction.type === 'spent' ? '-' : '+'}
                              {Math.abs(transaction.amount)} pts
                            </p>
                            <p className="text-sm text-gray-500 capitalize">{transaction.type}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No point transactions</h3>
                    <p className="text-gray-600 mb-4">Your point earning and spending history will appear here.</p>
                    <Link
                      to="/add-item"
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      List an Item
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}