import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  FileText,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { getCurrentUser, getPhotoBlobUrl, logout } from '../../../api/auth';

export function WebOfficerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    let active = true;
    let currentPhotoUrl = null;

    const loadUserData = async () => {
      const currentUser = getCurrentUser();
      if (!active) return;

      setUser(currentUser);

      if (currentPhotoUrl) {
        URL.revokeObjectURL(currentPhotoUrl);
        currentPhotoUrl = null;
      }

      setPhotoUrl(null);

      if (currentUser?.hasPhoto) {
        const blobUrl = await getPhotoBlobUrl();
        if (active && blobUrl) {
          currentPhotoUrl = blobUrl;
          setPhotoUrl(blobUrl);
        }
      }
    };

    loadUserData();

    const handleUserChanged = () => {
      loadUserData();
    };

    window.addEventListener('user-changed', handleUserChanged);

    return () => {
      active = false;
      window.removeEventListener('user-changed', handleUserChanged);
      if (currentPhotoUrl) {
        URL.revokeObjectURL(currentPhotoUrl);
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/web/login');
  };

  const isActive = (path) => location.pathname === path;

  const displayName =
    user?.fullName?.trim() ||
    user?.email?.split('@')[0] ||
    'Officer';

  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <aside className="w-[280px] bg-white border-r border-gray-200 min-h-screen hidden lg:block">
        <div className="px-8 py-8 border-b border-gray-200">
          <h1 className="text-[28px] font-extrabold text-[#2563EB]">BorrowBox</h1>
          <p className="text-sm text-[#64748b] mt-1">Officer Portal</p>
        </div>

        <nav className="p-5 flex flex-col gap-3">
          <Link
            to="/web/officer/dashboard"
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[15px] font-medium transition-colors ${
              isActive('/web/officer/dashboard')
                ? 'bg-[#eff6ff] text-[#2563EB]'
                : 'text-[#334155] hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/web/officer/items"
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[15px] font-medium transition-colors ${
              isActive('/web/officer/items')
                ? 'bg-[#eff6ff] text-[#2563EB]'
                : 'text-[#334155] hover:bg-gray-100'
            }`}
          >
            <Box className="w-5 h-5" />
            <span>Manage Items</span>
          </Link>

          <Link
            to="/web/officer/transactions"
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[15px] font-medium transition-colors ${
              isActive('/web/officer/transactions')
                ? 'bg-[#eff6ff] text-[#2563EB]'
                : 'text-[#334155] hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Transactions</span>
          </Link>

          <Link
            to="/web/officer/profile"
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[15px] font-medium transition-colors ${
              isActive('/web/officer/profile')
                ? 'bg-[#eff6ff] text-[#2563EB]'
                : 'text-[#334155] hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 min-h-screen">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="px-6 md:px-10 h-20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Officer Dashboard</h2>
              <p className="text-sm text-[#64748b]">Manage inventory and transactions</p>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl px-4 py-2.5 transition-colors"
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm">
                    {initials}
                  </div>
                )}

                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-[#0f172a] leading-tight">
                    {displayName}
                  </p>
                  <p className="text-xs text-[#64748b]">Officer</p>
                </div>

                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/web/officer/profile');
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-sm text-[#334155] hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}