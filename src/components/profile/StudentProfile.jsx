import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  IdCard,
  Lock,
  Bell,
  Clock
} from 'lucide-react';

import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadPhoto,
  deletePhoto,
  getPhotoBlobUrl,
  getCurrentUser
} from '../../api/auth';

import { getStudentBorrows } from '../../api/borrowbox';

import {
  getInitials,
  normalizeStatus,
  SuccessModal,
  DeletePhotoModal,
  PasswordModal,
  ProfileInput,
  ReadOnlyField
} from './ProfileShared';

const StudentProfile = ({ initialProfile, initialUser }) => {
  const [profile, setProfile] = useState(initialProfile || null);
  const [user, setUser] = useState(initialUser || null);

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
  const [editError, setEditError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setGeneralError('');

      const currentUser = getCurrentUser();
      setUser(currentUser);

      const res = await getProfile();

      if (!res.success) {
        setGeneralError(res.message || 'Failed to load profile.');
        return;
      }

      const loadedProfile = res.user;
      setProfile(loadedProfile);
      setEditForm({ fullName: loadedProfile.fullName || '' });

      if (loadedProfile.hasPhoto) {
        const blob = await getPhotoBlobUrl();
        setPhotoUrl(blob);
      } else {
        setPhotoUrl(null);
      }

      await loadStudentStats();
    } catch (err) {
      setGeneralError(err.message || 'Failed to load profile.');
    }
  };

  const loadStudentStats = async () => {
    try {
      const borrowRes = await getStudentBorrows();

      if (borrowRes.success) {
        setBorrows(borrowRes.borrows || []);
      } else {
        setBorrows([]);
      }
    } catch (err) {
      console.log('Student borrow stats not loaded:', err.message);
      setBorrows([]);
    }
  };

  const showSuccessPopup = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
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

  const totalBorrowed = borrows
    .filter((b) => countableTotalStatuses.includes(normalizeStatus(b.status)))
    .reduce((sum, b) => sum + getBorrowQuantity(b), 0);

  const activeNow = borrows
    .filter((b) => activeStatuses.includes(normalizeStatus(b.status)))
    .reduce((sum, b) => sum + getBorrowQuantity(b), 0);

  const saveProfile = async () => {
    try {
      setGeneralError('');
      setEditError('');

      const cleanedName = editForm.fullName.trim();

      if (!cleanedName) {
        setEditError('Full name cannot be blank.');
        return;
      }

      const res = await updateProfile({
        ...editForm,
        fullName: cleanedName
      });

      if (res.success) {
        setProfile(res.user);
        setEditMode(false);

        await load();

        window.dispatchEvent(new Event('borrowbox-profile-updated'));
        window.dispatchEvent(new Event('user-changed'));

        showSuccessPopup('Profile updated successfully.');
      } else {
        setGeneralError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setGeneralError(err.message || 'Failed to update profile.');
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordError('');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const changePassword = async () => {
    setPasswordError('');

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
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
        closePasswordModal();
        showSuccessPopup('Password updated successfully.');
      } else {
        setPasswordError(res.message || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    }
  };

  const upload = async () => {
    if (!file) return;

    try {
      setGeneralError('');

      const res = await uploadPhoto(file);

      if (res.success) {
        await load();
        setFile(null);

        window.dispatchEvent(new Event('borrowbox-profile-updated'));
        window.dispatchEvent(new Event('user-changed'));

        showSuccessPopup('Profile photo updated successfully.');
      } else {
        setGeneralError(res.message || 'Failed to upload photo.');
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
        window.dispatchEvent(new Event('user-changed'));

        showSuccessPopup('Profile photo deleted successfully.');
      } else {
        setGeneralError(res.message || 'Failed to delete photo.');
      }
    } catch (err) {
      setShowDeletePhotoModal(false);
      setGeneralError(err.message || 'Failed to delete photo.');
    }
  };

  if (!profile) return <div className="p-8">Loading student profile...</div>;

  const emailValue = profile.email || profile.username || '';
  const displayName = profile.fullName || emailValue || 'Student';
  const initials = getInitials(displayName);
  const studentId = profile.studentId || 'N/A';

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10">
      {showSuccess && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {showDeletePhotoModal && (
        <DeletePhotoModal
          onCancel={() => setShowDeletePhotoModal(false)}
          onDelete={remove}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          passwordError={passwordError}
          onClose={closePasswordModal}
          onSubmit={changePassword}
        />
      )}

      <div className="max-w-[1280px] mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Profile Settings
          </h1>
          <p className="text-lg text-gray-500">
            Manage your account information
          </p>
        </div>

        {generalError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 font-medium">
            {generalError}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-8">
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

              <h2 className="text-2xl font-bold text-gray-900">
                {displayName}
              </h2>

              <p className="text-lg text-gray-500 mt-1">
                {emailValue}
              </p>

              <p className="text-gray-400 mt-1">
                ID: {studentId}
              </p>

              <div className="w-full mt-8 space-y-3">
                <input
                  id="student-profile-photo-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />

                <label
                  htmlFor="student-profile-photo-upload"
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
                      type="button"
                      onClick={upload}
                      className="bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      Upload
                    </button>

                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {photoUrl && !file && (
                  <button
                    type="button"
                    onClick={() => setShowDeletePhotoModal(true)}
                    className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
                  >
                    Delete Photo
                  </button>
                )}
              </div>

              <div className="w-full border-t border-gray-200 mt-8 pt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalBorrowed}
                  </p>
                  <p className="text-gray-400">Total Borrowed</p>
                </div>

                <div>
                  <p className="text-3xl font-bold text-[#10B981]">
                    {activeNow}
                  </p>
                  <p className="text-gray-400">Active Now</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Personal Information
                </h2>

                {!editMode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditError('');
                      setEditMode(true);
                    }}
                    className="text-[#2563EB] font-semibold hover:underline"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setEditError('');
                        setEditForm({ fullName: profile.fullName || '' });
                      }}
                      className="px-5 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={saveProfile}
                      className="px-5 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {editError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 font-medium">
                  {editError}
                </div>
              )}

              {editMode ? (
                <div className="space-y-5">
                  <ProfileInput
                    icon={<User className="w-5 h-5" />}
                    label="Full Name"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ fullName: e.target.value })}
                  />

                  <ProfileInput
                    icon={<Mail className="w-5 h-5" />}
                    label="Email Address"
                    value={emailValue}
                    disabled
                  />

                  <ProfileInput
                    icon={<IdCard className="w-5 h-5" />}
                    label="Student ID"
                    value={studentId}
                    disabled
                  />
                </div>
              ) : (
                <div className="space-y-5">
                  <ReadOnlyField
                    icon={<User className="w-5 h-5" />}
                    label="Full Name"
                    value={displayName}
                  />

                  <ReadOnlyField
                    icon={<Mail className="w-5 h-5" />}
                    label="Email Address"
                    value={emailValue}
                  />

                  <ReadOnlyField
                    icon={<IdCard className="w-5 h-5" />}
                    label="Student ID"
                    value={studentId}
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Security
              </h2>

              <button
                type="button"
                onClick={() => {
                  setPasswordError('');
                  setShowPasswordModal(true);
                }}
                className="w-full border border-gray-200 rounded-xl p-5 flex items-center gap-5 hover:bg-gray-50 transition text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <Lock className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-xl font-semibold text-gray-900">
                    Change Password
                  </p>
                  <p className="text-gray-500 mt-1">
                    Update your password
                  </p>
                </div>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Notifications
              </h2>

              <div className="space-y-5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-4 text-lg text-gray-800">
                    <Bell className="w-6 h-6 text-gray-400" />
                    Email Notifications
                  </span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                   <span className="flex items-center gap-4 text-lg text-gray-800">
                    <Clock className="w-6 h-6 text-gray-400" />
                    Borrow Reminders
                   </span>
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

export default StudentProfile;