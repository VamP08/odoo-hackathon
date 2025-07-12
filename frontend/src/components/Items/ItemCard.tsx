import React from 'react';
import { Link } from 'react-router-dom';
import { Star, User } from 'lucide-react';
import { Item } from '../../types';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative overflow-hidden">
        <img
          src={item.images?.[0] || '/placeholder.jpg'}
          alt={item.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.condition === 'New' ? 'bg-green-100 text-green-800' :
            item.condition === 'Like New' ? 'bg-blue-100 text-blue-800' :
            item.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {item.condition}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white rounded-full px-2 py-1 flex items-center space-x-1 shadow-sm">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs font-medium">{item.point_cost ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{item.category_id ? `Category #${item.category_id}` : 'Uncategorized'} • {item.size}</span>
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {item.ownerAvatar ? (
              <img src={item.ownerAvatar} alt={item.ownerName} className="h-6 w-6 rounded-full" />
            ) : (
              <User className="h-6 w-6 text-gray-400" />
            )}
            <span className="text-sm text-gray-600">{item.ownerName ?? 'Anonymous'}</span>
          </div>

          <Link
            to={`/item/${item.id}`}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
