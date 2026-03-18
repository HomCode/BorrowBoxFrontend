import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogOut, ChevronDown } from 'lucide-react';
import { getCurrentUser, getPhotoBlobUrl, logout } from '../../../api/auth';

export function WebStudentLayout({ children }) {
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
    'Student';

  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-6 md:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/web/student/dashboard" className="text-2xl font-bold text-[#10B981]">
              BorrowBox
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#334155]">
              <Link
                to="/web/student/dashboard"
                className={`flex items-center gap-2 hover:text-[#10B981] transition-colors ${
                  isActive('/web/student/dashboard') ? 'text-[#10B981]' : ''
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Available Items</span>
              </Link>

              <Link
                to="/web/student/borrows"
                className={`flex items-center gap-2 hover:text-[#10B981] transition-colors ${
                  isActive('/web/student/borrows') ? 'text-[#10B981]' : ''
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>My Borrows</span>
              </Link>
            </nav>
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
                <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-semibold text-sm">
                  {initials}
                </div>
              )}

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-[#0f172a] leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-[#64748b]">Student</p>
              </div>

              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg py-2">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/web/student/profile');
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
  );
}