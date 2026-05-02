import React, { useState, useEffect } from 'react';
import { Search, Eye, X, Download } from 'lucide-react';
import { getAllTransactions } from '../../../api/borrowbox';

export function WebOfficerTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAllTransactions();
      if (res.success) setTransactions(res.transactions);
      else setError(res.message || 'Failed to load transactions');
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.studentId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;

    let matchesDateRange = true;
    if (dateRange.start) matchesDateRange = matchesDateRange && new Date(t.borrowDate) >= new Date(dateRange.start);
    if (dateRange.end) matchesDateRange = matchesDateRange && new Date(t.borrowDate) <= new Date(dateRange.end);

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const getStatusBadge = (status) => {
    const config = {
      ACTIVE: 'bg-blue-100 text-blue-700',
      RETURNED: 'bg-green-100 text-green-700',
      OVERDUE: 'bg-red-100 text-red-700',
      DAMAGED: 'bg-orange-100 text-orange-700',
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config[status] || config.ACTIVE}`}>
        {status || 'ACTIVE'}
      </span>
    );
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'Student Name', 'Student ID', 'Item', 'Serial #', 'Borrow Date', 'Due Date', 'Return Date', 'Status'],
      ...filteredTransactions.map((t) => [
        t.id,
        t.studentName,
        t.studentId,
        t.itemName,
        t.serialNumber,
        t.borrowDate,
        t.dueDate,
        t.returnDate || 'N/A',
        t.status,
      ]),
    ];

    const csvContent = csv.map((row) => row.map((cell) => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: transactions.length,
    active: transactions.filter((t) => t.status === 'ACTIVE').length,
    returned: transactions.filter((t) => t.status === 'RETURNED').length,
    overdue: transactions.filter((t) => t.status === 'OVERDUE').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
          <p className="text-gray-500">Track all borrowing and return transactions</p>
        </div>

        <button
          onClick={handleExport}
          disabled={filteredTransactions.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-gray-500 text-sm mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-gray-500 text-sm mb-1">Active Borrows</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-gray-500 text-sm mb-1">Returned</p>
          <p className="text-2xl font-bold text-green-600">{stats.returned}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-gray-500 text-sm mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, item, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="RETURNED">Returned</option>
            <option value="OVERDUE">Overdue</option>
            <option value="DAMAGED">Damaged</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading transactions...</p>
      ) : filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No transactions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Borrow Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{t.studentName || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{t.studentId || 'N/A'}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{t.itemName || 'N/A'}</div>
                    <div className="text-xs font-mono text-gray-500">{t.serialNumber || 'N/A'}</div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.borrowDate ? new Date(t.borrowDate).toLocaleDateString() : 'N/A'}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}
                  </td>

                  <td className="px-6 py-4 text-sm">{getStatusBadge(t.status)}</td>

                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => {
                        setViewingTransaction(t);
                        setShowViewModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showViewModal && viewingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {getStatusBadge(viewingTransaction.status)}
              <p><strong>Student:</strong> {viewingTransaction.studentName || 'N/A'}</p>
              <p><strong>Student ID:</strong> {viewingTransaction.studentId || 'N/A'}</p>
              <p><strong>Item:</strong> {viewingTransaction.itemName || 'N/A'}</p>
              <p><strong>Serial #:</strong> {viewingTransaction.serialNumber || 'N/A'}</p>
              <p><strong>Borrow Date:</strong> {viewingTransaction.borrowDate || 'N/A'}</p>
              <p><strong>Due Date:</strong> {viewingTransaction.dueDate || 'N/A'}</p>
              <p><strong>Return Date:</strong> {viewingTransaction.returnDate || 'N/A'}</p>
              <p><strong>Notes:</strong> {viewingTransaction.notes || 'N/A'}</p>

              <button
                onClick={() => setShowViewModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}