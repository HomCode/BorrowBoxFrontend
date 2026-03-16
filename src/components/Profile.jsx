import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadPhoto,
  getPhotoBlobUrl,
  deletePhoto,
  getCurrentUser
} from '../api/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    studentId: '',
    orgId: ''
  });

  const [passwordMode, setPasswordMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/web/login');
        return;
      }

      setUser(currentUser);

      const response = await getProfile();
      if (response.success) {
        setProfile(response.user);
        setUser(response.user);

        setEditForm({
          fullName: response.user.fullName || '',
          studentId: response.user.studentId || '',
          orgId: response.user.orgId || ''
        });

        if (response.user.hasPhoto) {
          if (photoUrl) URL.revokeObjectURL(photoUrl);
          const blobUrl = await getPhotoBlobUrl();
          setPhotoUrl(blobUrl);
        } else {
          setPhotoUrl(null);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        setError('Please select a JPG or PNG image');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateProfile(editForm);
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setEditMode(false);
        setProfile(response.user);
        setUser(response.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await updatePassword(passwordForm);
      if (response.success) {
        setSuccess('Password updated successfully!');
        setPasswordMode(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await uploadPhoto(selectedFile);
      if (response.success) {
        setSuccess('Photo uploaded successfully!');
        setSelectedFile(null);

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);

        await loadProfile();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm('Are you sure you want to delete your profile photo?')) {
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await deletePhoto();
      if (response.success) {
        setSuccess('Photo deleted successfully!');

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (photoUrl) URL.revokeObjectURL(photoUrl);

        setPreviewUrl(null);
        setPhotoUrl(null);
        setSelectedFile(null);

        await loadProfile();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <p className="text-gray-500 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-[#0f172a] mb-3">Profile</h1>
        <p className="text-xl text-[#64748b]">Manage your account information and security</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 text-red-700 px-5 py-4 rounded-2xl border border-red-200 text-base">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-100 text-green-700 px-5 py-4 rounded-2xl border border-green-200 text-base">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Profile Photo</h2>

            <div className="flex flex-col items-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-36 h-36 rounded-full object-cover border-4 border-gray-100 shadow-md"
                />
              ) : photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-gray-100 shadow-md"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-gray-100 border-4 border-gray-100 flex items-center justify-center text-5xl">
                  📷
                </div>
              )}

              <div className="w-full mt-6">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#eff6ff] file:text-[#2563EB] hover:file:bg-[#dbeafe]"
                />
              </div>

              {selectedFile && (
                <div className="flex gap-3 mt-6 w-full">
                  <button
                    onClick={handleUploadPhoto}
                    disabled={uploading}
                    className="flex-1 bg-[#2563EB] text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </button>

                  <button
                    onClick={() => {
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {!selectedFile && photoUrl && (
                <button
                  onClick={handleDeletePhoto}
                  className="mt-6 w-full bg-red-500 text-white py-3 rounded-2xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete Photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Personal Info */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0f172a]">Personal Information</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-[#2563EB] text-white px-5 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>

                {user?.role === 'student' && (
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      value={editForm.studentId}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                )}

                {user?.role === 'officer' && (
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">Organization ID</label>
                    <input
                      type="text"
                      name="orgId"
                      value={editForm.orgId}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={updating}
                  className="bg-[#2563EB] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-[#0f172a]">{profile?.fullName || user?.fullName}</p>
                </div>

                <div className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Username</p>
                  <p className="text-lg font-semibold text-[#0f172a]">{profile?.username || user?.username}</p>
                </div>

                <div className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="text-lg font-semibold text-[#0f172a]">
                    {user?.role === 'student' ? 'Student' : 'Organization Officer'}
                  </p>
                </div>

                {user?.role === 'student' && (
                  <div className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Student ID</p>
                    <p className="text-lg font-semibold text-[#0f172a]">{profile?.studentId || user?.studentId}</p>
                  </div>
                )}

                {user?.role === 'officer' && (
                  <div className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Organization ID</p>
                    <p className="text-lg font-semibold text-[#0f172a]">{profile?.orgId || user?.orgId}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0f172a]">Security</h2>
              <button
                onClick={() => setPasswordMode(!passwordMode)}
                className="bg-[#2563EB] text-white px-5 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
              >
                {passwordMode ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {passwordMode ? (
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="bg-[#2563EB] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {updating ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            ) : (
              <div className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100">
                <p className="text-gray-500">
                  Keep your account secure by using a strong password and updating it regularly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;