import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogOut } from 'lucide-react';
import { getCurrentUser, logout } from '../../../api/auth';

export function WebStudentLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/web/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="w-full bg-white border-b border-gray-200 px-10 py-5 flex items-center justify-between">
        <div className="text-3xl font-extrabold text-[#10B981]">
          BorrowBox
        </div>

        <nav className="flex items-center gap-12 text-[16px] font-medium text-[#334155]">
          <Link
            to="/web/student/dashboard"
            className={`flex items-center gap-3 hover:text-[#10B981] ${
              isActive('/web/student/dashboard') ? 'text-[#10B981]' : ''
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Available Items</span>
          </Link>

          <Link
            to="/web/student/borrows"
            className={`flex items-center gap-3 hover:text-[#10B981] ${
              isActive('/web/student/borrows') ? 'text-[#10B981]' : ''
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>My Borrows</span>
          </Link>
        </nav>

        <div className="flex items-center gap-8">
          <Link
            to="/web/student/profile"
            className="flex items-center gap-3 text-[#334155] hover:text-[#10B981]"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">{user?.username || 'User'}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-600 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}