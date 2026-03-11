import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

const Register = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        studentId: '',
        orgId: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleSelect = (selectedRole) => {
        console.log('Role selected:', selectedRole);
        setRole(selectedRole);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('=== REGISTRATION SUBMITTED ===');
        
        setError('');
        setLoading(true);

        // Validate all fields are filled
        if (!formData.fullName || !formData.username || !formData.password || !formData.confirmPassword) {
            const errorMsg = 'Please fill in all required fields';
            setError(errorMsg);
            alert(`❌ ${errorMsg}`);
            setLoading(false);
            return;
        }

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            const errorMsg = 'Passwords do not match';
            setError(errorMsg);
            alert(`❌ ${errorMsg}`);
            setLoading(false);
            return;
        }

        // Password strength check (optional)
        if (formData.password.length < 6) {
            const errorMsg = 'Password must be at least 6 characters long';
            setError(errorMsg);
            alert(`❌ ${errorMsg}`);
            setLoading(false);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.username)) {
            const errorMsg = 'Please enter a valid email address';
            setError(errorMsg);
            alert(`❌ ${errorMsg}`);
            setLoading(false);
            return;
        }

        // Validate role-specific fields
        if (role === 'student' && !formData.studentId) {
            const errorMsg = 'Student ID is required';
            setError(errorMsg);
            alert(`❌ ${errorMsg}`);
            setLoading(false);
            return;
        }

        if (role === 'officer' && !formData.orgId) {
            const errorMsg = 'Organization ID is required';
            setError(errorMsg);
            alert(`❌ ${errorMsg}`);
            setLoading(false);
            return;
        }

        const userData = {
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            fullName: formData.fullName,
            role: role
        };

        if (role === 'student') {
            userData.studentId = formData.studentId;
        } else {
            userData.orgId = formData.orgId;
        }

        console.log('Sending to API:', { ...userData, password: '***' });

        try {
            console.log('Calling register API...');
            const response = await register(userData);
            console.log('API response:', response);
            
            if (response.success) {
                alert(`✅ Registration successful! Welcome, ${formData.fullName}!`);
                navigate('/dashboard');
            } else {
                const errorMsg = response.message || 'Registration failed';
                setError(errorMsg);
                alert(`❌ ${errorMsg}`);
            }
        } catch (err) {
            console.error('Caught error:', err);
            
            // Handle specific error messages
            let errorMsg = err.message || 'Registration failed';
            
            if (errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
                errorMsg = 'An account with this email already exists. Please login instead.';
            } else if (errorMsg.includes('rate limit')) {
                errorMsg = 'Too many registration attempts. Please try again later.';
            } else if (errorMsg.includes('Network Error')) {
                errorMsg = 'Cannot connect to server. Please check if backend is running.';
            }
            
            setError(errorMsg);
            alert(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon">📦</div>
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join BorrowBox today</p>
                </div>

                {error && <div className="alert-error">{error}</div>}

                <div className="role-selection">
                    <div 
                        className={`role-card ${role === 'student' ? 'active' : ''}`}
                        onClick={() => handleRoleSelect('student')}
                    >
                        <div className="role-icon">🎓</div>
                        <div className="role-title">STUDENT</div>
                        <div className="role-desc">I am a Student</div>
                    </div>
                    <div 
                        className={`role-card ${role === 'officer' ? 'active' : ''}`}
                        onClick={() => handleRoleSelect('officer')}
                    >
                        <div className="role-icon">🏢</div>
                        <div className="role-title">OFFICER</div>
                        <div className="role-desc">I am an Organization Officer</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {role === 'student' && (
                        <div className="form-group">
                            <label>Student ID</label>
                            <input
                                type="text"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                placeholder="Enter your student ID"
                                required
                            />
                        </div>
                    )}

                    {role === 'officer' && (
                        <div className="form-group">
                            <label>Organization ID</label>
                            <input
                                type="text"
                                name="orgId"
                                value={formData.orgId}
                                onChange={handleChange}
                                placeholder="Enter your organization ID"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password (min. 6 characters)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <p className="alt-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;