import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Calendar, Award, MessageSquare, Shield, Package, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ItemCard } from '../components/Items/ItemCard';

export function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { userProfiles, items } = useApp();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('items');

  const userProfile = userProfiles.find(p => p.id === userId);
  const userItems = items.filter(item => item.uploaderId === userId && item.approved);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <Link to="/browse" className="text-emerald-600 hover:text-emerald-700">
            ← Back to browse
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/browse" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to browse</span>
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt={userProfile.name} className="h-24 w-24 rounded-full" />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {userProfile.name.charAt(0)}
                  </span>
                </div>
              )}
              {userProfile.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-1">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userProfile.name}
                    {userProfile.isVerified && (
                      <span className="ml-2 text-emerald-600">✓</span>
                    )}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    {userProfile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{userProfile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(userProfile.joinedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{userProfile.rating}/5 ({userProfile.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {userProfile.bio && (
                    <p className="text-gray-700 mb-4 max-w-2xl">{userProfile.bio}</p>
                  )}

                  {/* Badges */}
                  {userProfile.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {userProfile.badges.map(badge => (
                        <span key={badge} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>{badge}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {!isOwnProfile && currentUser && (
                  <div className="flex space-x-3">
                    <Link
                      to={`/messages?user=${userId}`}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Message</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                <p className="text-2xl font-bold text-emerald-600">{userProfile.totalSwaps}</p>
              </div>
              <div className="bg-emerald-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Listed</p>
                <p className="text-2xl font-bold text-blue-600">{userItems.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{userProfile.rating}/5</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points</p>
                <p className="text-2xl font-bold text-purple-600">{userProfile.points}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Categories */}
        {userProfile.favoriteCategories.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Categories</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.favoriteCategories.map(category => (
                <span key={category} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('items')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'items'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Items ({userItems.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({userProfile.reviewCount})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'items' && (
              <div>
                {userItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userItems.map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items listed</h3>
                    <p className="text-gray-600">
                      {isOwnProfile 
                        ? "You haven't listed any items yet."
                        : `${userProfile.name} hasn't listed any items yet.`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews coming soon</h3>
                <p className="text-gray-600">User reviews and ratings will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}