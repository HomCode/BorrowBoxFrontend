import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Package, CheckCircle, XCircle } from 'lucide-react';
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
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [borrowDays, setBorrowDays] = useState(7);
  const [agreed, setAgreed] = useState(false);

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
      await borrowItem(selectedItem.id, borrowDays);

      setShowBorrowModal(false);
      setShowSuccessModal(true);
      setAgreed(false);
      setBorrowDays(7);
      loadItems();
    } catch (err) {
      setShowBorrowModal(false);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          'Item is not available for borrowing.'
      );
      setShowUnavailableModal(true);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedItem) {
    const isUnavailable = selectedItem.availableQuantity <= 0;

    return (
      <div className="p-8">
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

            {isUnavailable ? (
              <button
                onClick={() => {
                  setErrorMessage('This item is currently unavailable for borrowing.');
                  setShowUnavailableModal(true);
                }}
                className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold"
              >
                CURRENTLY UNAVAILABLE
              </button>
            ) : (
              <button
                onClick={() => setShowBorrowModal(true)}
                className="w-full bg-[#10B981] text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                BORROW THIS ITEM
              </button>
            )}
          </div>
        </div>

        {showBorrowModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Borrow Request
              </h2>

              <div className="flex gap-3 bg-gray-50 rounded-lg p-3 mb-5">
                <img
                  src={selectedItem.image || 'https://via.placeholder.com/100'}
                  alt={selectedItem.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold text-gray-900">{selectedItem.name}</p>
                  <p className="text-sm text-gray-500">{selectedItem.category}</p>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-700 mb-2">
                Select Borrow Period
              </p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[3, 7, 14].map((day) => (
                  <button
                    key={day}
                    onClick={() => setBorrowDays(day)}
                    className={`py-3 rounded-lg font-medium ${
                      borrowDays === day
                        ? 'bg-[#10B981] text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {day} days
                  </button>
                ))}
              </div>

              <label className="flex gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>I agree to return this item on time and in good condition.</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowBorrowModal(false)}
                  className="py-3 border border-gray-300 rounded-lg font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={handleBorrow}
                  disabled={!agreed}
                  className="py-3 rounded-lg font-medium bg-[#10B981] text-white disabled:bg-gray-200 disabled:text-gray-500"
                >
                  Confirm Borrow
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-xl text-center">
              <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-14 h-14 text-[#10B981]" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Item Borrowed Successfully!
              </h2>

              <p className="text-gray-600 text-lg mb-8">
                Check 'My Borrows' to view your borrowed items and due dates.
              </p>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSelectedItem(null);
                  navigate('/web/student/borrows');
                }}
                className="w-full bg-[#10B981] text-white py-4 rounded-xl font-bold text-lg"
              >
                Go to My Borrows
              </button>
            </div>
          </div>
        )}

        {showUnavailableModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-xl text-center">
              <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-14 h-14 text-red-500" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Item Unavailable
              </h2>

              <p className="text-gray-600 text-lg mb-8">
                {errorMessage}
              </p>

              <button
                onClick={() => setShowUnavailableModal(false)}
                className="w-full bg-[#10B981] text-white py-4 rounded-xl font-bold text-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
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
            <div key={item.id} className="bg-white rounded-xl border overflow-hidden">
              <img
                src={item.image || 'https://via.placeholder.com/400x250'}
                alt={item.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <p className="text-sm mb-4">
                  Available: {item.availableQuantity}/{item.totalQuantity}
                </p>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full bg-[#10B981] text-white py-2 rounded-lg font-medium"
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