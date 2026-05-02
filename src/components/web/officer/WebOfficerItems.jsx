import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { getAllItems, createItem, updateItem, deleteItem } from '../../../api/borrowbox';

export function WebOfficerItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    serialNumber: '',
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'tools', name: 'Tools' },
    { id: 'books', name: 'Books' },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAllItems();
      if (res.success) setItems(res.items);
      else setError(res.message || 'Failed to load items');
    } catch (err) {
      setError(err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddClick = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', category: '', quantity: '', serialNumber: '' });
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      quantity: String(item.quantity || ''),
      serialNumber: item.serialNumber || '',
    });
    setShowModal(true);
  };

  const handleViewClick = (item) => {
    setViewingItem(item);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity),
      };

      if (editingItem) {
        await updateItem(editingItem.id, payload);
        setSuccess('Item updated successfully');
      } else {
        await createItem(payload);
        setSuccess('Item added successfully');
      }

      setShowModal(false);
      await loadItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    setError('');

    try {
      await deleteItem(id);
      setSuccess('Item deleted successfully');
      await loadItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Items</h1>
          <p className="text-gray-500">Add, edit, or remove items from your inventory</p>
        </div>

        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">{success}</div>}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading && !items.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mt-4">Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No items found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Serial #</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      item.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.available}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{item.serialNumber || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button onClick={() => handleViewClick(item)} className="text-blue-600 hover:text-blue-700 inline-flex">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-700 inline-flex">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 inline-flex">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Item name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" />

              <textarea required placeholder="Description" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg h-20 resize-none" />

              <select required value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select category</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input required type="number" min="1" placeholder="Quantity" value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg" />

                <input required placeholder="Serial #" value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Item Details</h2>
            <p><strong>Name:</strong> {viewingItem.name}</p>
            <p><strong>Description:</strong> {viewingItem.description}</p>
            <p><strong>Category:</strong> {viewingItem.category}</p>
            <p><strong>Serial #:</strong> {viewingItem.serialNumber || 'N/A'}</p>
            <p><strong>Total:</strong> {viewingItem.quantity}</p>
            <p><strong>Available:</strong> {viewingItem.available}</p>

            <button
              onClick={() => setShowViewModal(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}