import { useNavigate } from 'react-router-dom';
import { Package, Users, TrendingUp, Plus } from 'lucide-react';

export function WebOfficerDashboard() {
  const navigate = useNavigate();

  const totalItems = 25;
  const activeBorrows = 8;
  const studentsRegistered = 42;

  const recentTransactions = [
    { id: 1, item: 'Laptop', student: 'Juan Dela Cruz', status: 'BORROWED', date: '2026-03-15' },
    { id: 2, item: 'Projector', student: 'Maria Santos', status: 'RETURNED', date: '2026-03-14' },
    { id: 3, item: 'Tool Kit', student: 'Carlo Reyes', status: 'BORROWED', date: '2026-03-13' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">Overview of campus borrowing system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-[#2563EB]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Active Borrows</p>
              <p className="text-3xl font-bold text-gray-900">{activeBorrows}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#10B981]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Students Registered</p>
              <p className="text-3xl font-bold text-gray-900">{studentsRegistered}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => navigate('/web/officer/dashboard')}
          className="bg-[#2563EB] text-white p-6 rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-between"
        >
          <div className="text-left">
            <p className="font-semibold text-lg mb-1">Add New Item</p>
            <p className="text-sm text-blue-100">Add items to inventory</p>
          </div>
          <Plus className="w-8 h-8" />
        </button>

        <button
          onClick={() => navigate('/web/officer/dashboard')}
          className="bg-[#10B981] text-white p-6 rounded-xl shadow-sm hover:bg-green-700 transition-colors flex items-center justify-between"
        >
          <div className="text-left">
            <p className="font-semibold text-lg mb-1">View All Transactions</p>
            <p className="text-sm text-green-100">Monitor borrowing activity</p>
          </div>
          <TrendingUp className="w-8 h-8" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>

        <div className="p-6">
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">{txn.item}</p>
                    <p className="text-sm text-gray-500">
                      {txn.student} • {txn.status}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{txn.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}