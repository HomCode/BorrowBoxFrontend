import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Mail, Lock } from 'lucide-react';
import { login } from '../../../api/auth';

export function WebLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.username, formData.password);

      if (response.success) {
        const role = response.user?.role?.toLowerCase();

        if (role === 'student') {
          navigate('/web/student/dashboard');
        } else if (role === 'officer') {
          navigate('/web/officer/dashboard');
        } else {
          setError('Invalid user role');
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3fb] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[28px] shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#2f67ea] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <Box className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-[#111827] mb-2">
              BorrowBox
            </h1>

            <p className="text-lg text-[#6b7280]">
              Campus Item Borrowing System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 text-red-700 px-5 py-3 rounded-xl text-base">
                {error}
              </div>
            )}

            <div>
              <label className="block text-lg font-semibold text-[#1f2937] mb-3">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-2xl text-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-[#1f2937] mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-2xl text-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2f67ea] text-white py-3 rounded-2xl text-xl font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-60"
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-lg text-[#6B7280]">
              Don't have an account?{' '}
              <Link to="/web/register" className="text-[#2563EB] font-bold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-base text-[#6B7280]">
          <p>BorrowBox Web</p>
        </div>
      </div>
    </div>
  );
}