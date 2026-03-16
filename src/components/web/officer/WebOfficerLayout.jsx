import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, FileText, User } from 'lucide-react';
import { getCurrentUser, logout } from '../../../api/auth';

export function WebOfficerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/web/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <aside className="w-[320px] bg-white border-r border-gray-200 min-h-screen">
        <div className="px-8 py-8 border-b border-gray-200">
          <h1 className="text-[28px] font-extrabold text-[#2563EB]">BorrowBox</h1>
          <p className="text-[18px] text-[#64748b] mt-2">Officer Dashboard</p>
        </div>

        <nav className="p-5 flex flex-col gap-4">
          <Link
            to="/web/officer/dashboard"
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-[18px] font-medium ${
              isActive('/web/officer/dashboard')
                ? 'bg-[#eff6ff] text-[#2563EB]'
                : 'text-[#334155] hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/web/officer/items"
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-[18px] font-medium ${
              isActive('/web/officer/items')
                ? 'bg-[#eff6ff] text-[#2563EB]'
                : 'text-[#334155] hover:bg-gray-100'
            }`}
          >
            <Box className="w-6 h-6" />
            <span>Manage Items</span>
          </Link>

          <Link
            to="/web/officer/transactions"
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-[18px] font-medium ${
              isActive('/web/officer/transactions')
                ? 'bg-[#eff6ff] text-[#2563EB]'
                : 'text-[#334155] hover:bg-gray-100'
            }`}
          >
            <FileText className="w-6 h-6" />
            <span>Transactions</span>
          </Link>

          <Link
            to="/web/officer/profile"
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-[18px] font-medium ${
              isActive('/web/officer/profile')
                ? 'bg-[#eff6ff] text-[#2563EB]'
                : 'text-[#334155] hover:bg-gray-100'
            }`}
          >
            <User className="w-6 h-6" />
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-10 py-6 flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-[#0f172a]">Officer Portal</h2>

          <div className="flex items-center gap-4">
            <Link
              to="/web/officer/profile"
              className="flex items-center gap-3 text-[#0f172a] hover:text-[#2563EB]"
            >
              <div className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <span className="font-medium">{user?.username || 'Officer'}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="ml-4 text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}