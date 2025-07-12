// src/pages/AddItemPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import { Category, Condition } from '../types';

export function AddItemPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    category_id: string;
    size: string;
    condition: Condition;
    tags: string;
    point_cost: number;
  }>({
    title: '',
    description: '',
    category_id: '',
    size: '',
    condition: 'New',
    tags: '',
    point_cost: 50,
  });

  // 1️⃣ Load categories
  useEffect(() => {
    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  // 2️⃣ Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'point_cost' ? Number(value) : value,
    }));
  };

  // 3️⃣ Add an image (demo: object URL → in prod upload to S3 or similar)
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages(prev => [...prev, url]);
  };

  // 4️⃣ Remove an image
  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
  };

  // 5️⃣ Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }

    setLoading(true);
    try {
      // turn comma‑list into string[]
      const tagsArray = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      // payload matches your fn_list_item + item_images + item_tags logic
      const payload = {
        owner_id: user.id,
        category_id: Number(form.category_id),
        title: form.title,
        description: form.description,
        size: form.size,
        condition: form.condition,
        point_cost: form.point_cost,
        is_approved: false,
        images,    // e.g. ["blob:…", …]
        tags: tagsArray,
      };

      const res = await apiFetch('/api/items', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to list item');
      const data: { id: string } = await res.json();
      navigate(`/item/${data.id}`);
    } catch (err) {
      console.error(err);
      alert('Error listing item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg">You must be logged in to list an item.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Add New Item</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Photos */}
          <div>
            <label className="block mb-2 font-medium">Photos *</label>
            <div className="flex gap-4">
              {images.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} className="h-24 w-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-red-500 p-1 rounded-full text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed rounded cursor-pointer">
                  <Camera className="h-6 w-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddImage}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title & Points */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block font-medium mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. Vintage Denim Jacket"
              />
            </div>
            <div>
              <label htmlFor="point_cost" className="block font-medium mb-1">
                Point Cost *
              </label>
              <input
                id="point_cost"
                name="point_cost"
                type="number"
                min={10}
                max={500}
                value={form.point_cost}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Category / Size / Condition / Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="category_id" className="block font-medium mb-1">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select…</option>
                {categories.map(c => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="size" className="block font-medium mb-1">
                Size *
              </label>
              <input
                id="size"
                name="size"
                value={form.size}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="M, L, One Size…"
              />
            </div>
            <div>
              <label htmlFor="condition" className="block font-medium mb-1">
                Condition *
              </label>
              <select
                id="condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select…</option>
                {(['New','Like New','Good','Fair'] as Condition[]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tags" className="block font-medium mb-1">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="comma separated"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Submitting…' : (
                <span className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>List Item</span>
                </span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
