import React, { useEffect, useState } from 'react';
import { getCurrentUser, getProfile } from '../api/auth';
import StudentProfile from './profile/StudentProfile';
import OfficerProfile from './profile/OfficerProfile';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfileForRouting();
  }, []);

  const loadProfileForRouting = async () => {
    try {
      setLoading(true);
      setError('');

      const currentUser = getCurrentUser();
      setUser(currentUser);

      const res = await getProfile();

      if (res.success) {
        setProfile(res.user);
      } else {
        setError(res.message || 'Failed to load profile.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 font-medium">
          {error}
        </div>
      </div>
    );
  }

  const role = String(profile?.role || user?.role || '').toLowerCase();

  if (role === 'officer') {
    return <OfficerProfile initialProfile={profile} initialUser={user} />;
  }

  return <StudentProfile initialProfile={profile} initialUser={user} />;
};

export default Profile;