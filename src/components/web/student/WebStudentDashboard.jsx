import { useState, useEffect } from 'react';
import { Search, ArrowLeft, MapPin, Package } from 'lucide-react';
import { getAvailableItems, borrowItem } from '../../../api/borrowbox';

const sampleCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'tools', name: 'Tools' },
  { id: 'books', name: 'Books' },
  { id: 'laboratory', name: 'Laboratory' },
  { id: 'sports', name: 'Sports' },
];

export function WebStudentDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await getAvailableItems();
      if (res.success) setItems(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    try {
      await borrowItem(selectedItem.id, 7);
      alert('Item borrowed!');
      setSelectedItem(null);
      loadItems();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to borrow item');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedItem) {
    return (
      <div className="p-8">
        <button
          onClick={() => setSelectedItem(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="p-8">
            <img
              src={selectedItem.image || 'https://via.placeholder.com/600x400'}
              alt={selectedItem.name}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>

          <div className="p-8">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {selectedItem.category}
            </span>

            <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">
              {selectedItem.name}
            </h1>

            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-gray-700 mb-6">{selectedItem.description}</p>

            <p className="text-sm text-gray-500 mb-2">Details</p>

            <div className="space-y-2 text-gray-700 mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {selectedItem.location || 'Campus'}
              </div>

              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                Available: {selectedItem.availableQuantity} of {selectedItem.totalQuantity}
              </div>
            </div>

            <button
              onClick={handleBorrow}
              className="w-full bg-[#10B981] text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              BORROW THIS ITEM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Available Items for Borrowing
        </h1>
        <p className="text-gray-500">Browse and borrow campus items</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          >
            {sampleCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading items...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={item.image || 'https://via.placeholder.com/400x250'}
                alt={item.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {item.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  Available:{' '}
                  <span className="font-semibold text-gray-900">
                    {item.availableQuantity}/{item.totalQuantity}
                  </span>
                </p>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full bg-[#10B981] text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}