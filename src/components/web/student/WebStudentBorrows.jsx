import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

export function WebStudentBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const sampleBorrows = [
    {
      id: '1',
      itemId: '1',
      itemName: 'Laptop',
      category: 'electronics',
      borrowDate: '2026-02-15',
      dueDate: '2026-03-15',
      status: 'ACTIVE',
      condition: 'Good',
      serialNumber: 'LAP-001'
    },
    {
      id: '2',
      itemId: '3',
      itemName: 'Tool Kit',
      category: 'tools',
      borrowDate: '2026-03-01',
      dueDate: '2026-03-10',
      status: 'ACTIVE',
      condition: 'Good',
      serialNumber: 'TOOL-001'
    },
    {
      id: '3',
      itemId: '2',
      itemName: 'Projector',
      category: 'electronics',
      borrowDate: '2026-02-20',
      dueDate: '2026-02-28',
      status: 'RETURNED',
      condition: 'Good',
      serialNumber: 'PROJ-001'
    },
  ];

  useEffect(() => {
    loadBorrows();
  }, []);

  const loadBorrows = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call - replace with actual API endpoint
      setTimeout(() => {
        setBorrows(sampleBorrows);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load borrows');
      setLoading(false);
    }
  };

  const handleReturnClick = (borrow) => {
    setSelectedBorrow(borrow);
    setShowReturnModal(true);
  };

  const handleReturnItem = async (condition) => {
    if (!selectedBorrow) return;

    setLoading(true);
    try {
      // Simulate API call - replace with actual API endpoint
      const updatedBorrows = borrows.map(b =>
        b.id === selectedBorrow.id
          ? { ...b, status: 'RETURNED', condition }
          : b
      );
      setBorrows(updatedBorrows);
      setSuccess(`${selectedBorrow.itemName} returned successfully`);
      setShowReturnModal(false);
      setSelectedBorrow(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to return item');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'ACTIVE')
      return <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Active</span>;
    return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Returned</span>;
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const isOverdue = (dueDate) => getDaysRemaining(dueDate) < 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Borrows</h1>
        <p className="text-gray-500">Manage your borrowed items and track return dates</p>
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

      {loading && !borrows.length ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-blue-300 border-t-[#2563EB] rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 mt-4">Loading your borrows...</p>
        </div>
      ) : borrows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You haven't borrowed any items yet</p>
          <p className="text-gray-400 text-sm mt-2">Browse available items in the dashboard</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {borrows.map((borrow) => (
            <div key={borrow.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{borrow.itemName}</h3>
                    {getStatusBadge(borrow.status)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Serial Number</p>
                      <p className="font-mono text-gray-900">{borrow.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Borrow Date</p>
                      <p className="text-gray-900">{new Date(borrow.borrowDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Due Date</p>
                      <p className="text-gray-900">{new Date(borrow.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Status</p>
                      {borrow.status === 'ACTIVE' && (
                        <p className={`font-semibold ${isOverdue(borrow.dueDate) ? 'text-red-600' : 'text-blue-600'}`}>
                          {isOverdue(borrow.dueDate) ? 'Overdue' : `${getDaysRemaining(borrow.dueDate)} days left`}
                        </p>
                      )}
                      {borrow.status === 'RETURNED' && (
                        <p className="font-semibold text-green-600">Completed</p>
                      )}
                    </div>
                  </div>
                </div>
                {borrow.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleReturnClick(borrow)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4 inline mr-2" />
                    Return Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showReturnModal && selectedBorrow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Return Item</h2>
            <p className="text-gray-600 mb-6">
              Are you returning <strong>{selectedBorrow.itemName}</strong> in good condition?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleReturnItem('Good')}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Yes, in Good Condition
              </button>
              <button
                onClick={() => handleReturnItem('Damaged')}
                disabled={loading}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                Return as Damaged
              </button>
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedBorrow(null);
                }}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}