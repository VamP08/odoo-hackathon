import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, Clock, Check, X, MessageSquare, Package, User, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

export function SwapRequestsPage() {
  const { user } = useAuth();
  const { swapRequests, updateSwapRequest, items, addPointTransaction } = useApp();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

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
    const item = items.find(i => i.id === request.itemId);
    return item?.uploaderId === user.id;
  });

  const outgoingRequests = swapRequests.filter(request => 
    request.requesterId === user.id
  );

  const handleAcceptRequest = (requestId: string) => {
    const request = swapRequests.find(r => r.id === requestId);
    if (!request) return;

    updateSwapRequest(requestId, { 
      status: 'accepted',
      response: responseMessage || 'Request accepted!'
    });

    // Add points to requester
    if (request.pointsOffered) {
      addPointTransaction({
        userId: request.requesterId,
        type: 'spent',
        amount: -request.pointsOffered,
        description: `Points spent on ${request.itemTitle}`,
        relatedItemId: request.itemId,
        relatedItemTitle: request.itemTitle,
        relatedSwapId: requestId
      });
    }

    setSelectedRequest(null);
    setResponseMessage('');
  };

  const handleRejectRequest = (requestId: string) => {
    updateSwapRequest(requestId, { 
      status: 'rejected',
      response: responseMessage || 'Request declined.'
    });
    setSelectedRequest(null);
    setResponseMessage('');
  };

  const handleCompleteSwap = (requestId: string) => {
    const request = swapRequests.find(r => r.id === requestId);
    if (!request) return;

    updateSwapRequest(requestId, { 
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0]
    });

    // Award points to item owner
    const item = items.find(i => i.id === request.itemId);
    if (item) {
      addPointTransaction({
        userId: user.id,
        type: 'earned',
        amount: item.pointValue,
        description: `Points earned from swapping ${item.title}`,
        relatedItemId: item.id,
        relatedItemTitle: item.title,
        relatedSwapId: requestId
      });
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
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'incoming'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Incoming Requests ({incomingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('outgoing')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'outgoing'
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
                  const item = items.find(i => i.id === request.itemId);
                  if (!item) return null;

                  return (
                    <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                              <p className="text-gray-600">
                                {activeTab === 'incoming' 
                                  ? `Request from ${request.requesterName}`
                                  : `Your request to ${item.uploaderName}`
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
                              <span>Requested: {request.createdDate}</span>
                            </div>
                            {request.pointsOffered && (
                              <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4" />
                                <span>Points offered: {request.pointsOffered}</span>
                              </div>
                            )}
                            {request.completedDate && (
                              <div className="flex items-center space-x-2">
                                <Check className="h-4 w-4" />
                                <span>Completed: {request.completedDate}</span>
                              </div>
                            )}
                          </div>

                          {request.message && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                              <p className="text-sm text-gray-700">
                                <strong>Message:</strong> {request.message}
                              </p>
                            </div>
                          )}

                          {request.response && (
                            <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                              <p className="text-sm text-emerald-700">
                                <strong>Response:</strong> {request.response}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {activeTab === 'incoming' && request.status === 'pending' && (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setSelectedRequest(request.id)}
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
                                to={`/messages?user=${request.requesterId}`}
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

        {/* Accept Request Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Accept Swap Request</h3>
              <p className="text-gray-600 mb-4">
                You're about to accept this swap request. You can add a personal message.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message (optional)
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Great choice! Let's arrange the swap..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setResponseMessage('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAcceptRequest(selectedRequest)}
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  Accept Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}