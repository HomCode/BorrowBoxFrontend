import React, { useEffect, useState } from 'react';
import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadPhoto,
  deletePhoto,
  getPhotoBlobUrl,
  getCurrentUser
} from '../api/auth';

import { getStudentBorrows } from '../api/borrowbox';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [borrows, setBorrows] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);

  const [photoUrl, setPhotoUrl] = useState(null);
  const [file, setFile] = useState(null);

  const [editForm, setEditForm] = useState({ fullName: '' });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('Your changes have been saved.');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setGeneralError('');

      const currentUser = getCurrentUser();
      setUser(currentUser);

      const res = await getProfile();

      if (res.success) {
        setProfile(res.user);
        setEditForm({ fullName: res.user.fullName || '' });

        if (res.user.hasPhoto) {
          const blob = await getPhotoBlobUrl();
          setPhotoUrl(blob);
        } else {
          setPhotoUrl(null);
        }

        const role = res.user.role || currentUser?.role;

        if (role?.toLowerCase() === 'student') {
          try {
            const b = await getStudentBorrows();
            if (b.success) {
              setBorrows(b.borrows || []);
            } else {
              setBorrows([]);
            }
          } catch (borrowErr) {
            console.log('Borrow stats not loaded:', borrowErr.message);
            setBorrows([]);
          }
        }
      }
    } catch (err) {
      setGeneralError(err.message || 'Failed to load profile.');
    }
  };

  const showSuccessPopup = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const getInitials = (nameOrEmail) => {
  if (!nameOrEmail) return 'U';

  const parts = nameOrEmail.trim().split(' ').filter(Boolean);

  // If full name has 2 or more words, use first letter of first and last word
  if (parts.length >= 2) {
    const firstInitial = parts[0][0];
    const lastInitial = parts[parts.length - 1][0];
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  // If only one name, use only first letter
  return parts[0][0].toUpperCase();
};

  const normalizeStatus = (status) => {
    return String(status || '').trim().toUpperCase();
  };

  const getBorrowQuantity = (borrow) => {
    return Number(
      borrow.quantity ||
      borrow.borrowQuantity ||
      borrow.qty ||
      borrow.itemQuantity ||
      1
    );
  };

  const countableTotalStatuses = [
    'ACTIVE',
    'BORROWED',
    'APPROVED',
    'PENDING',
    'RETURNED',
    'COMPLETED'
  ];

  const activeStatuses = [
    'ACTIVE',
    'BORROWED',
    'APPROVED',
    'PENDING'
  ];

  const total = borrows
    .filter((b) => countableTotalStatuses.includes(normalizeStatus(b.status)))
    .reduce((sum, b) => sum + getBorrowQuantity(b), 0);

  const active = borrows
    .filter((b) => activeStatuses.includes(normalizeStatus(b.status)))
    .reduce((sum, b) => sum + getBorrowQuantity(b), 0);

  // ================= PROFILE =================
  const saveProfile = async () => {
    try {
      setGeneralError('');

      const res = await updateProfile(editForm);

      if (res.success) {
        setProfile(res.user);
        setEditMode(false);
        await load();
        window.dispatchEvent(new Event('borrowbox-profile-updated'));
        showSuccessPopup('Profile updated successfully.');
      }
    } catch (err) {
      setGeneralError(err.message || 'Failed to update profile.');
    }
  };

  // ================= PASSWORD =================
  const changePassword = async () => {
    setPasswordError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await updatePassword(passwordForm);

      if (res.success) {
        setShowPasswordModal(false);
        setPasswordError('');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        showSuccessPopup('Password updated successfully.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    }
  };

  // ================= PHOTO =================
  const upload = async () => {
    if (!file) return;

    try {
      setGeneralError('');

      const res = await uploadPhoto(file);

      if (res.success) {
        await load();
        setFile(null);
        window.dispatchEvent(new Event('borrowbox-profile-updated'));
        showSuccessPopup('Profile photo updated successfully.');
      }
    } catch (err) {
      setGeneralError(err.message || 'Failed to upload photo.');
    }
  };

  const remove = async () => {
    try {
      setGeneralError('');

      const res = await deletePhoto();

      if (res.success) {
        setPhotoUrl(null);
        setFile(null);
        setShowDeletePhotoModal(false);
        await load();
        window.dispatchEvent(new Event('borrowbox-profile-updated'));
        showSuccessPopup('Profile photo deleted successfully.');
      }
    } catch (err) {
      setShowDeletePhotoModal(false);
      setGeneralError(err.message || 'Failed to delete photo.');
    }
  };

  if (!profile) return <div className="p-8">Loading...</div>;

  const emailValue = profile.email || profile.username || '';
  const roleValue = profile.role || user?.role || '';
  const isStudent = roleValue?.toLowerCase() === 'student';

  const idLabel = isStudent ? 'Student ID' : 'Organization ID';
  const idValue = isStudent ? profile.studentId : profile.orgId;

  const displayName = profile.fullName || emailValue || 'User';
  const initials = getInitials(displayName);

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10">
      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-xl w-[360px] p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Success</h2>
            <p className="text-gray-500 mb-6">{successMessage}</p>

            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* DELETE PHOTO CONFIRMATION MODAL */}
      {showDeletePhotoModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-xl w-[390px] p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-3xl">
              !
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Profile Photo?</h2>

            <p className="text-gray-500 mb-6">
              This will remove your current profile photo from your account. You can upload a new one anytime.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeletePhotoModal(false)}
                className="bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={remove}
                className="bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>

              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {passwordError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current password"
                value={passwordForm.currentPassword}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563EB]"
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="New password"
                value={passwordForm.newPassword}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563EB]"
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563EB]"
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={changePassword}
                className="bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Profile Settings</h1>
          <p className="text-lg text-gray-500">Manage your account information</p>
        </div>

        {generalError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 font-medium">
            {generalError}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-8">
          {/* LEFT PROFILE CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 h-fit">
            <div className="flex flex-col items-center text-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover mb-6"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-[#10B981] text-white flex items-center justify-center mb-6 text-4xl font-bold shadow-sm">
                  {initials}
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
              <p className="text-lg text-gray-500 mt-1">{emailValue}</p>
              <p className="text-gray-400 mt-1">
                {isStudent ? `ID: ${profile.studentId || 'N/A'}` : profile.orgId || 'N/A'}
              </p>

              {/* PHOTO CONTROLS */}
              <div className="w-full mt-6 space-y-3">
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />

                <label
                  htmlFor="profile-photo-upload"
                  className="block w-full border border-gray-300 rounded-xl py-3 text-gray-700 font-semibold cursor-pointer hover:bg-gray-50 transition"
                >
                  Choose Photo
                </label>

                {file && (
                  <p className="text-sm text-gray-500 truncate">
                    Selected: {file.name}
                  </p>
                )}

                {file && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={upload}
                      className="bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      Upload
                    </button>

                    <button
                      onClick={() => setFile(null)}
                      className="bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {photoUrl && !file && (
                  <button
                    onClick={() => setShowDeletePhotoModal(true)}
                    className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
                  >
                    Delete Photo
                  </button>
                )}
              </div>

              <div className="w-full border-t border-gray-200 mt-8 pt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{total}</p>
                  <p className="text-gray-400">Total Borrowed</p>
                </div>

                <div>
                  <p className="text-3xl font-bold text-[#10B981]">{active}</p>
                  <p className="text-gray-400">Active Now</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                Total Borrowed counts your borrow history. Active Now counts items not yet returned.
              </p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-8">
            {/* PERSONAL INFORMATION */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>

                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-[#2563EB] font-semibold hover:underline"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditForm({ fullName: profile.fullName || '' });
                      }}
                      className="px-5 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={saveProfile}
                      className="px-5 py-3 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {editMode ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ fullName: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      value={emailValue}
                      disabled
                      className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      {idLabel}
                    </label>
                    <input
                      value={idValue || ''}
                      disabled
                      className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-gray-500 mt-2">{idLabel} cannot be changed</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-y-8 gap-x-20">
                  <InfoBlock label="Full Name" value={displayName} />
                  <InfoBlock label="Email" value={emailValue} />
                  <InfoBlock label="Role" value={roleValue?.toUpperCase()} />
                  <InfoBlock label="ID" value={idValue || 'N/A'} />
                </div>
              )}
            </div>

            {/* SECURITY */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security</h2>

              <button
                onClick={() => {
                  setPasswordError('');
                  setShowPasswordModal(true);
                }}
                className="w-full border border-gray-200 rounded-xl p-5 flex items-center gap-5 hover:bg-gray-50 transition text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-2xl">
                  🔒
                </div>

                <div>
                  <p className="text-xl font-semibold text-gray-900">Change Password</p>
                  <p className="text-gray-500 mt-1">Update your password</p>
                </div>
              </button>
            </div>

            {/* NOTIFICATIONS */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>

              <div className="space-y-5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-lg text-gray-800">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-lg text-gray-800">Borrow Reminders</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-lg mb-1">{label}</p>
      <p className="text-xl font-semibold text-gray-900 break-words">{value || 'N/A'}</p>
    </div>
  );
}

export default Profile;