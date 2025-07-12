import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function FeaturedItems() {
  const { items } = useApp();
  const featuredItems = items.filter(item => item.approved).slice(0, 3);

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Items
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing pieces shared by our community members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.condition === 'New' ? 'bg-green-100 text-green-800' :
                    item.condition === 'Like New' ? 'bg-blue-100 text-blue-800' :
                    item.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.condition}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{item.pointValue} pts</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.uploaderAvatar ? (
                      <img src={item.uploaderAvatar} alt={item.uploaderName} className="h-8 w-8 rounded-full" />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">{item.uploaderName}</span>
                  </div>

                  <Link
                    to={`/item/${item.id}`}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/browse"
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Browse All Items</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}