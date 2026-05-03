import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Users,
  TrendingUp,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import {
  getAllItems,
  getAllBorrows,
  getStudentCount
} from '../../../api/borrowbox';

export function WebOfficerDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [studentCount, setStudentCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [itemsRes, borrowsRes, studentCountRes] = await Promise.all([
        getAllItems(),
        getAllBorrows(),
        getStudentCount()
      ]);

      if (itemsRes?.success) {
        setItems(itemsRes.items || []);
      } else {
        setItems([]);
      }

      if (borrowsRes?.success) {
        setBorrows(borrowsRes.borrows || []);
      } else {
        setBorrows([]);
      }

      if (studentCountRes?.success) {
        setStudentCount(studentCountRes.count || 0);
      } else {
        setStudentCount(0);
      }
    } catch (err) {
      console.error('Failed to load officer dashboard:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status) => {
    const value = String(status || '').trim().toUpperCase();

    if (value === 'BORROWED') return 'ACTIVE';
    if (value === 'BORROW') return 'ACTIVE';
    if (value === 'RETURN') return 'RETURNED';

    return value;
  };

  const getActivityDate = (record) => {
    const status = normalizeStatus(record.status);

    if (status === 'RETURNED' && record.returnDate) return record.returnDate;
    if (record.borrowDate) return record.borrowDate;
    if (record.createdAt) return record.createdAt;

    return null;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'N/A';

    return date.toISOString().slice(0, 10);
  };

  const getStatusBadgeClass = (status) => {
    const normalized = normalizeStatus(status);

    switch (normalized) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-700';
      case 'RETURNED':
        return 'bg-green-100 text-green-700';
      case 'OVERDUE':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'APPROVED':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    const normalized = normalizeStatus(status);

    switch (normalized) {
      case 'ACTIVE':
        return 'Borrowed';
      case 'RETURNED':
        return 'Returned';
      case 'OVERDUE':
        return 'Overdue';
      case 'PENDING':
        return 'Pending';
      case 'APPROVED':
        return 'Approved';
      default:
        return normalized || 'Unknown';
    }
  };

  const totalItems = items.length;

  const activeBorrows = borrows.filter((borrow) => {
    const status = normalizeStatus(borrow.status);
    return status === 'ACTIVE' || status === 'PENDING' || status === 'APPROVED';
  }).length;

  const studentsRegistered = studentCount;

  const recentActivity = useMemo(() => {
    return [...borrows]
      .sort((a, b) => {
        const dateA = new Date(getActivityDate(a) || 0).getTime();
        const dateB = new Date(getActivityDate(b) || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [borrows]);

  return (
    <div className="px-6 md:px-10 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-[#0f172a] mb-3">
          Dashboard
        </h1>
        <p className="text-lg text-[#64748b]">
          Overview of campus borrowing system
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-10">
        <DashboardStatCard
          label="Total Items"
          value={loading ? '--' : totalItems}
          icon={
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-7 h-7 text-[#2563EB]" />
            </div>
          }
        />

        <DashboardStatCard
          label="Active Borrows"
          value={loading ? '--' : activeBorrows}
          icon={
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-[#10B981]" />
            </div>
          }
        />

        <DashboardStatCard
          label="Students Registered"
          value={loading ? '--' : studentsRegistered}
          icon={
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-10">
        <button
          onClick={() => navigate('/web/officer/items')}
          className="bg-[#2563EB] text-white p-8 rounded-2xl shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-between min-h-[120px]"
        >
          <div className="text-left">
            <p className="font-bold text-2xl mb-2">Add New Item</p>
            <p className="text-base text-blue-100">Add items to inventory</p>
          </div>
          <Plus className="w-10 h-10" />
        </button>

        <button
          onClick={() => navigate('/web/officer/transactions')}
          className="bg-[#10B981] text-white p-8 rounded-2xl shadow-sm hover:bg-green-700 transition-colors flex items-center justify-between min-h-[120px]"
        >
          <div className="text-left">
            <p className="font-bold text-2xl mb-2">View All Transactions</p>
            <p className="text-base text-green-100">Monitor borrowing activity</p>
          </div>
          <ArrowUpRight className="w-10 h-10" />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
        </div>

        <div className="p-8">
          {loading ? (
            <p className="text-gray-500">Loading recent activity...</p>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-8">
              {recentActivity.map((activity) => {
                const status = normalizeStatus(activity.status);

                const studentText =
                  activity.studentName ||
                  activity.studentEmail ||
                  activity.studentId ||
                  'Unknown Student';

                const itemText =
                  activity.itemName ||
                  activity.item ||
                  activity.itemId ||
                  'Unknown Item';

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between gap-6"
                  >
                    <div>
                      <p className="text-xl font-semibold text-gray-900">
                        {itemText}
                      </p>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-base text-gray-500">
                          {studentText}
                        </span>

                        <span className="text-gray-300">•</span>

                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(
                            status
                          )}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    </div>

                    <span className="text-base text-gray-500 whitespace-nowrap">
                      {formatDate(getActivityDate(activity))}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No recent activity
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardStatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[145px]">
      <div className="flex items-center justify-between h-full">
        <div>
          <p className="text-[#64748b] text-base mb-3">{label}</p>
          <p className="text-4xl font-extrabold text-gray-900">{value}</p>
        </div>

        {icon}
      </div>
    </div>
  );
}