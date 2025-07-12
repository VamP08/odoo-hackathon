import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


export function AddItemPage() {
  const { user } = useAuth();
  const { addItem } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: '',
    pointValue: 50
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Outerwear', 'Dresses', 'Tops', 'Bottoms', 'Shoes', 'Accessories', 'Activewear', 'Formal'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  // Mock image URLs for demo purposes
  const mockImages = [
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMockImage = () => {
    if (images.length < 5) {
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      setImages(prev => [...prev, randomImage]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (images.length === 0) {
      alert('Please add at least one image');
      return;
    }

    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      addItem({
        title: formData.title,
        description: formData.description,
        images: images,
        category: formData.category,
        type: formData.type,
        size: formData.size,
        condition: formData.condition as 'New' | 'Like New' | 'Good' | 'Fair',
        tags: tagsArray,
        pointValue: formData.pointValue,
        uploaderId: user.id,
        uploaderName: user.name,
        uploaderAvatar: user.avatar,
        status: 'available',
        approved: false
      });

      alert('Item submitted successfully! It will be reviewed by our team before being listed.');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to submit item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to add items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Item</h1>
          <p className="text-gray-600">Share your unused clothing with the ReWear community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
            <p className="text-gray-600 mb-4">Add up to 5 photos of your item. The first photo will be the main image.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={image} alt={`Item ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Main
                    </div>
                  )}
                </div>
              ))}
              
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddMockImage}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Add Photo</span>
                </button>
              )}
            </div>
            
            {images.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Demo Mode:</strong> Click "Add Photo" to add sample images for testing.
                </p>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Vintage Denim Jacket"
                />
              </div>

              <div>
                <label htmlFor="pointValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Point Value *
                </label>
                <input
                  type="number"
                  id="pointValue"
                  name="pointValue"
                  required
                  min="10"
                  max="200"
                  value={formData.pointValue}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Points others need to redeem this item (10-200)</p>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe the item's condition, style, fit, and any other relevant details..."
              />
            </div>
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Jacket, Blouse, Jeans"
                />
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <select
                  id="size"
                  name="size"
                  required
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., vintage, casual, summer (separate with commas)"
              />
              <p className="text-sm text-gray-500 mt-1">Add tags to help others find your item</p>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-3">Listing Guidelines</h3>
            <ul className="space-y-2 text-emerald-700 text-sm">
              <li>• Ensure items are clean and in good condition</li>
              <li>• Provide accurate descriptions and measurements</li>
              <li>• Use clear, well-lit photos from multiple angles</li>
              <li>• Be honest about any flaws or wear</li>
              <li>• Items will be reviewed before being published</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>List Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}