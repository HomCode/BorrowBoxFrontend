import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
} from 'lucide-react';
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  uploadItemPhoto,
  getItemPhotoBlobUrl,
} from '../../../api/borrowbox';

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

  const [deletingItem, setDeletingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    serialNumber: '',
    location: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (showModal || showViewModal || showDeleteModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showModal, showViewModal, showDeleteModal]);

  const normalizeCategory = (value) => {
    if (!value) return '';
    return String(value).trim().toLowerCase();
  };

  const formatCategory = (value) => {
    if (!value) return '';
    return String(value)
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const categoryOptions = useMemo(() => {
    const defaults = ['Electronics', 'Tools', 'Books', 'Laboratory', 'Sports', 'Other'];

    const fromItems = items
      .map((item) => formatCategory(item.category))
      .filter(Boolean);

    return [...new Set([...defaults, ...fromItems])];
  }, [items]);

  const loadItems = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAllItems();

      if (res.success) {
        setItems(res.items || []);
      } else {
        setError(res.message || 'Failed to load items');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      String(item.name || '').toLowerCase().includes(search) ||
      String(item.description || '').toLowerCase().includes(search) ||
      String(item.serialNumber || '').toLowerCase().includes(search) ||
      String(item.location || '').toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === 'all' ||
      normalizeCategory(item.category) === normalizeCategory(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const showSuccessMessage = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      quantity: '',
      serialNumber: '',
      location: '',
    });

    setSelectedImageFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddClick = () => {
    setEditingItem(null);
    resetForm();
    setError('');
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setError('');

    setFormData({
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      quantity: String(item.totalQuantity ?? item.quantity ?? ''),
      serialNumber: item.serialNumber || '',
      location: item.location || '',
    });

    setSelectedImageFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setShowModal(true);
  };

  const handleImageClick = (item) => {
    setViewingItem(item);
    setShowViewModal(true);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setError('Please select a JPG or PNG image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const removeSelectedImage = () => {
    setSelectedImageFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        quantity: parseInt(formData.quantity, 10),
        serialNumber: formData.serialNumber.trim(),
        location: formData.location.trim(),
      };

      let savedItemId = editingItem?.id;

      if (editingItem) {
        const updateRes = await updateItem(editingItem.id, payload);

        if (!updateRes.success) {
          throw new Error(updateRes.message || 'Failed to update item');
        }

        savedItemId = editingItem.id;
        showSuccessMessage('Item updated successfully');
      } else {
        const createRes = await createItem(payload);

        if (!createRes.success) {
          throw new Error(createRes.message || 'Failed to add item');
        }

        savedItemId = createRes.item?.id;
        showSuccessMessage('Item added successfully');
      }

      if (selectedImageFile && savedItemId) {
        const photoRes = await uploadItemPhoto(savedItemId, selectedImageFile);

        if (!photoRes.success) {
          throw new Error(photoRes.message || 'Item saved, but photo upload failed');
        }
      }

      closeModal();
      await loadItems();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (item) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeletingItem(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    setLoading(true);
    setError('');

    try {
      const res = await deleteItem(deletingItem.id);

      if (!res.success) {
        throw new Error(res.message || 'Failed to delete item');
      }

      showSuccessMessage('Item deleted successfully');
      closeDeleteModal();
      await loadItems();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const getTotalQuantity = (item) => item.totalQuantity ?? item.quantity ?? 0;
  const getAvailableQuantity = (item) => item.availableQuantity ?? item.available ?? 0;

  return (
    <div className="px-6 md:px-10 py-10">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Manage Campus Items
          </h1>
          <p className="text-lg text-gray-500">
            Add, edit, and organize borrowable items
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-5 flex flex-col md:flex-row gap-5">
        <button
          onClick={handleAddClick}
          className="px-7 py-3 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>

        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-w-[220px]"
        >
          <option value="all">All Categories</option>

          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading && !items.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mt-4">Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No items found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                  Image
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                  Available Qty
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                  Location
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                  Serial #
                </th>
                <th className="px-6 py-5 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const total = getTotalQuantity(item);
                const available = getAvailableQuantity(item);

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <button
                        type="button"
                        onClick={() => handleImageClick(item)}
                        className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="View item details"
                      >
                        <ItemImage item={item} />
                      </button>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-base font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {item.description || 'No description'}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {formatCategory(item.category) || 'Uncategorized'}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {available}/{total}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {item.location || 'N/A'}
                    </td>

                    <td className="px-6 py-5 text-sm font-mono text-gray-600">
                      {item.serialNumber || 'N/A'}
                    </td>

                    <td className="px-6 py-5 text-sm text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => openDeleteModal(item)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center px-7 py-5 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>

              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-88px)]">
              <div className="px-7 py-6 overflow-y-auto space-y-5">
                <input
                  required
                  placeholder="Item name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  required
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none"
                />

                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>

                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    required
                    placeholder="Serial #"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Image
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  <div className="border border-gray-300 rounded-2xl p-4 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {selectedImageFile ? 'Change Image' : 'Upload Image'}
                      </button>

                      <div className="text-sm text-gray-500 truncate">
                        {selectedImageFile ? selectedImageFile.name : 'No image selected'}
                      </div>
                    </div>

                    {imagePreview && (
                      <div className="mt-4 flex items-start gap-4">
                        <div className="w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 bg-white shrink-0">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col justify-between min-h-[112px]">
                          <p className="text-sm text-gray-600">
                            Preview of the selected image.
                          </p>

                          <button
                            type="button"
                            onClick={removeSelectedImage}
                            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Image
                          </button>
                        </div>
                      </div>
                    )}

                    {!imagePreview && editingItem?.hasImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">
                          Current image
                        </p>
                        <ItemImage item={editingItem} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-7 py-5 border-t border-gray-200 bg-white flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-[#2563EB] text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && viewingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="flex justify-between items-center px-7 py-5 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Item Details
              </h2>

              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="p-7 grid md:grid-cols-[180px_1fr] gap-6">
              <div>
                <ItemImage item={viewingItem} large />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {viewingItem.name}
                </h3>

                <p className="text-gray-500 mb-5">
                  {viewingItem.description || 'No description provided.'}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Detail label="Category" value={formatCategory(viewingItem.category) || 'N/A'} />
                  <Detail label="Location" value={viewingItem.location || 'N/A'} />
                  <Detail label="Serial #" value={viewingItem.serialNumber || 'N/A'} />
                  <Detail label="Status" value={viewingItem.status || 'N/A'} />
                  <Detail label="Total Quantity" value={getTotalQuantity(viewingItem)} />
                  <Detail label="Available" value={getAvailableQuantity(viewingItem)} />
                </div>
              </div>
            </div>

            <div className="px-7 py-5 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-3 bg-[#2563EB] text-white rounded-2xl font-semibold hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && deletingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Delete Item?
            </h2>

            <p className="text-gray-500 mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-900">
                {deletingItem.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ItemImage({ item, large = false }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let active = true;
    let currentUrl = null;

    const loadImage = async () => {
      setUrl(null);

      if (!item?.id || !item?.hasImage) {
        return;
      }

      const blobUrl = await getItemPhotoBlobUrl(item.id);

      if (active && blobUrl) {
        currentUrl = blobUrl;
        setUrl(blobUrl);
      }
    };

    loadImage();

    return () => {
      active = false;

      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [item?.id, item?.hasImage, item?.imageUpdatedAt]);

  const sizeClass = large ? 'w-44 h-44' : 'w-20 h-20';

  if (url) {
    return (
      <img
        src={url}
        alt={item?.name || 'Item'}
        className={`${sizeClass} rounded-2xl object-cover border border-gray-200 bg-white`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400`}
    >
      <ImageIcon className={large ? 'w-12 h-12' : 'w-7 h-7'} />
    </div>
  );
}