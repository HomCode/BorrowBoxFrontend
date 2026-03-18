import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const sampleCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'tools', name: 'Tools' },
  { id: 'books', name: 'Books' },
];

const sampleItems = [
  {
    id: '1',
    name: 'Laptop',
    description: 'Portable device for academic work and presentations.',
    category: 'electronics',
    available: 3,
    total: 5,
    image: 'https://via.placeholder.com/400x250?text=Laptop',
  },
  {
    id: '2',
    name: 'Projector',
    description: 'Used for group reporting, seminars, and organization meetings.',
    category: 'electronics',
    available: 1,
    total: 2,
    image: 'https://via.placeholder.com/400x250?text=Projector',
  },
  {
    id: '3',
    name: 'Tool Kit',
    description: 'Contains essential hand tools for laboratory and maintenance use.',
    category: 'tools',
    available: 4,
    total: 6,
    image: 'https://via.placeholder.com/400x250?text=Tool+Kit',
  },
];

export function WebStudentDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = sampleItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Items for Borrowing</h1>
        <p className="text-gray-500">Browse and borrow campus items</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              />
            </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <img
              src={item.image}
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

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  Available: <span className="font-semibold text-gray-900">{item.available}/{item.total}</span>
                </span>
              </div>

              <button
                onClick={() => {}}
                className="w-full bg-[#10B981] text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found matching your criteria</p>
        </div>
      )}
    </div>
  );
}