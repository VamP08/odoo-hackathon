// src/pages/BrowsePage.tsx
import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { Item } from '../types';
import { ItemCard } from '../components/Items/ItemCard';

export function BrowsePage() {
  const [items, setItems]       = useState<Item[]>([]);
  const [loading, setLoading]   = useState<boolean>(true);
  const [error, setError]       = useState<string | null>(null);

  const [searchTerm, setSearchTerm]   = useState<string>('');
  const [categoryId, setCategoryId]   = useState<string>('');
  const [condition, setCondition]     = useState<string>('');

  // Whenever filters change, re-fetch
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryId) params.append('category_id', categoryId);
      if (condition)  params.append('condition', condition);
      // Only show approved items
      params.append('is_approved', 'true');

      try {
        const res = await apiFetch(`/api/items?${params.toString()}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data: Item[] = await res.json();
        setItems(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unknown error fetching items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchTerm, categoryId, condition]);

  // Hardcoded categories/conditions for dropdown
  const categories = [
    { id: 1, name: 'Outerwear' },
    { id: 2, name: 'Dresses' },
    { id: 3, name: 'Tops' },
    { id: 4, name: 'Bottoms' },
    { id: 5, name: 'Shoes' },
    { id: 6, name: 'Accessories' },
  ];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  // Reset all filters
  const handleReset = () => {
    setSearchTerm('');
    setCategoryId('');
    setCondition('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Heading */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
          <p className="text-gray-600">Discover amazing pieces from our community</p>
        </header>

        {/* Filters */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Category */}
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Condition */}
            <select
              value={condition}
              onChange={e => setCondition(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">All Conditions</option>
              {conditions.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex items-center justify-center space-x-2 bg-emerald-600 text-white rounded-lg py-2 hover:bg-emerald-700 transition"
            >
              <Filter className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </section>

        {/* Results */}
        <section>
          {loading ? (
            <p className="text-center text-gray-500">Loading items…</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : items.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Search className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-lg font-medium text-gray-900">No items found</p>
              <p className="text-gray-600">Try changing your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
