import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Mail,
  Lock,
  User,
  CreditCard,
  Building,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { register } from '../../../api/auth';

export function WebRegister() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    orgId: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: selectedRole === 'STUDENT' ? 'student' : 'officer',
        studentId: selectedRole === 'STUDENT' ? formData.studentId : '',
        orgId: selectedRole === 'ORG_OFFICER' ? formData.orgId : '',
      };

      const response = await register(payload);

      if (response.success) {
        const role = response.user?.role?.toLowerCase();
        if (role === 'student') {
          navigate('/web/student/dashboard');
        } else {
          navigate('/web/officer/dashboard');
        }
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (err) {
      let message = err.message || 'Registration failed.';

      if (message.includes('over_email_send_rate_limit')) {
        message = 'Too many signup attempts. Please wait a few minutes before trying again.';
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Box className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-sm text-[#6B7280]">Join BorrowBox to get started</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              <p className="font-semibold mb-1">Registration failed</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Select Your Role</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole('STUDENT')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedRole === 'STUDENT'
                    ? 'border-[#2563EB] bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedRole === 'STUDENT' ? 'bg-[#2563EB]' : 'bg-blue-100'
                  }`}>
                    <GraduationCap className={`w-6 h-6 ${
                      selectedRole === 'STUDENT' ? 'text-white' : 'text-[#2563EB]'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">STUDENT</h3>
                    <p className="text-sm text-[#6B7280]">I am a Student</p>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Browse and borrow items from the campus inventory
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('ORG_OFFICER')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedRole === 'ORG_OFFICER'
                    ? 'border-[#2563EB] bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedRole === 'ORG_OFFICER' ? 'bg-[#2563EB]' : 'bg-blue-100'
                  }`}>
                    <Briefcase className={`w-6 h-6 ${
                      selectedRole === 'ORG_OFFICER' ? 'text-white' : 'text-[#2563EB]'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">OFFICER</h3>
                    <p className="text-sm text-[#6B7280]">I am an Organization Officer</p>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Manage inventory and track borrowing transactions
                </p>
              </button>
            </div>
          </div>

          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
              </div>

              {selectedRole === 'STUDENT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="Enter your student ID"
                      required
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'ORG_OFFICER' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization ID
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.orgId}
                      onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="Enter your organization ID"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563EB] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md mt-6 disabled:opacity-60"
              >
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Already have an account?{' '}
              <Link to="/web/login" className="text-[#2563EB] font-semibold hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}