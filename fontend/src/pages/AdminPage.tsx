import React, { useState } from 'react';
import { Shield, Check, X, Eye, Trash2, Users, Package, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

export function AdminPage() {
  const { user } = useAuth();
  const { items, updateItem } = useApp();
  const [activeTab, setActiveTab] = useState('pending');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const pendingItems = items.filter(item => !item.approved);
  const approvedItems = items.filter(item => item.approved);
  const totalUsers = 5; // Mock data

  const handleApproveItem = (itemId: string) => {
    updateItem(itemId, { approved: true });
  };

  const handleRejectItem = (itemId: string) => {
    // In a real app, you might want to soft delete or move to rejected status
    updateItem(itemId, { approved: false, status: 'rejected' as any });
  };

  const stats = {
    pendingItems: pendingItems.length,
    approvedItems: approvedItems.length,
    totalUsers: totalUsers,
    totalItems: items.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage items and moderate the ReWear community</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Items</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingItems}</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Items</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedItems}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalItems}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Items ({pendingItems.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approved'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved Items ({approvedItems.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <div>
                {pendingItems.length > 0 ? (
                  <div className="space-y-6">
                    {pendingItems.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="h-24 w-24 rounded-lg object-cover"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                <p className="text-gray-600 mt-1">{item.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                  <span>{item.category} • {item.size}</span>
                                  <span>{item.condition}</span>
                                  <span>{item.pointValue} points</span>
                                  <span>by {item.uploaderName}</span>
                                </div>
                                {item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {item.tags.map(tag => (
                                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveItem(item.id)}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                >
                                  <Check className="h-4 w-4" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleRejectItem(item.id)}
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                                >
                                  <X className="h-4 w-4" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No items pending approval at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'approved' && (
              <div>
                {approvedItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedItems.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.category} • {item.size}</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'available' ? 'bg-green-100 text-green-800' :
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-sm text-gray-500">{item.pointValue} pts</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No approved items</h3>
                    <p className="text-gray-600">Approved items will appear here.</p>
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