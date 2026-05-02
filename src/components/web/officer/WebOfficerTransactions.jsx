import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, Download } from 'lucide-react';

export function WebOfficerTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const sampleTransactions = [
    {
      id: '1',
      studentName: 'Juan Dela Cruz',
      studentId: 'STU-001',
      itemName: 'Laptop',
      itemId: '1',
      serialNumber: 'LAP-001',
      borrowDate: '2026-02-15',
      dueDate: '2026-03-15',
      returnDate: null,
      status: 'ACTIVE',
      notes: 'For academic project'
    },
    {
      id: '2',
      studentName: 'Maria Santos',
      studentId: 'STU-002',
      itemName: 'Projector',
      itemId: '2',
      serialNumber: 'PROJ-001',
      borrowDate: '2026-02-20',
      dueDate: '2026-02-28',
      returnDate: '2026-02-28',
      status: 'RETURNED',
      notes: 'Returned in good condition'
    },
    {
      id: '3',
      studentName: 'Carlo Reyes',
      studentId: 'STU-003',
      itemName: 'Tool Kit',
      itemId: '3',
      serialNumber: 'TOOL-001',
      borrowDate: '2026-03-01',
      dueDate: '2026-03-10',
      returnDate: null,
      status: 'OVERDUE',
      notes: 'For laboratory work'
    },
    {
      id: '4',
      studentName: 'Anna Wilson',
      studentId: 'STU-004',
      itemName: 'Laptop',
      itemId: '1',
      serialNumber: 'LAP-002',
      borrowDate: '2026-01-20',
      dueDate: '2026-02-20',
      returnDate: '2026-02-18',
      status: 'RETURNED',
      notes: 'Returned early, good condition'
    },
    {
      id: '5',
      studentName: 'Robert Kim',
      studentId: 'STU-005',
      itemName: 'Projector',
      itemId: '2',
      serialNumber: 'PROJ-002',
      borrowDate: '2026-03-05',
      dueDate: '2026-03-12',
      returnDate: null,
      status: 'ACTIVE',
      notes: 'For seminar presentation'
    },
  ];

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      setTimeout(() => {
        setTransactions(sampleTransactions);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load transactions');
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    
    let matchesDateRange = true;
    if (dateRange.start) {
      matchesDateRange = matchesDateRange && new Date(transaction.borrowDate) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDateRange = matchesDateRange && new Date(transaction.borrowDate) <= new Date(dateRange.end);
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleViewClick = (transaction) => {
    setViewingTransaction(transaction);
    setShowViewModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ACTIVE': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Active' },
      'RETURNED': { bg: 'bg-green-100', text: 'text-green-700', label: 'Returned' },
      'OVERDUE': { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' },
      'DAMAGED': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Damaged' },
    };
    const config = statusConfig[status] || statusConfig['ACTIVE'];
    return <span className={`px-3 py-1 text-xs font-semibold ${config.bg} ${config.text} rounded-full`}>{config.label}</span>;
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'Student Name', 'Student ID', 'Item', 'Serial #', 'Borrow Date', 'Due Date', 'Return Date', 'Status'],
      ...filteredTransactions.map(t => [
        t.id,
        t.studentName,
        t.studentId,
        t.itemName,
        t.serialNumber,
        t.borrowDate,
        t.dueDate,
        t.returnDate || 'N/A',
        t.status
      ])
    ];
    
    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: transactions.length,
    active: transactions.filter(t => t.status === 'ACTIVE').length,
    returned: transactions.filter(t => t.status === 'RETURNED').length,
    overdue: transactions.filter(t => t.status === 'OVERDUE').length,
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {loading && !transactions.length ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-blue-300 border-t-[#2563EB] rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 mt-4">Loading transactions...</p>
        </div>
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
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{transaction.studentName}</div>
                    <div className="text-xs text-gray-500">{transaction.studentId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{transaction.itemName}</div>
                    <div className="text-xs font-mono text-gray-500">{transaction.serialNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => handleViewClick(transaction)}
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
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 uppercase mb-1">Status</p>
                {getStatusBadge(viewingTransaction.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase">Student</p>
                <p className="font-semibold text-gray-900">{viewingTransaction.studentName}</p>
                <p className="text-sm text-gray-600">{viewingTransaction.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase">Item</p>
                <p className="font-semibold text-gray-900">{viewingTransaction.itemName}</p>
                <p className="text-sm font-mono text-gray-600">{viewingTransaction.serialNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase">Borrow Date</p>
                  <p className="font-semibold text-gray-900">{new Date(viewingTransaction.borrowDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase">Due Date</p>
                  <p className="font-semibold text-gray-900">{new Date(viewingTransaction.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              {viewingTransaction.returnDate && (
                <div>
                  <p className="text-sm text-gray-500 uppercase">Return Date</p>
                  <p className="font-semibold text-gray-900">{new Date(viewingTransaction.returnDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 uppercase">Notes</p>
                <p className="text-gray-700">{viewingTransaction.notes}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6"
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