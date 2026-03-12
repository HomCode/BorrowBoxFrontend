import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login form submitted with:', { username, password: '***' });
        
        // Validate inputs
        if (!username || !password) {
            const errorMsg = 'Please enter both email and password';
            setError(errorMsg);
            return;
        }
        
        setError('');
        setLoading(true);

        try {
            console.log('Calling login API...');
            const response = await login(username, password);
            console.log('Login successful:', response);
            
            if (response.success) {
                // Get user role from response
                const userRole = response.user?.role;
                
                // Show welcome message with role
                if (userRole === 'student') {
                    // Welcome Student message
                } else if (userRole === 'officer') {
                    // Welcome Officer message
                }
                
                navigate('/dashboard');
            } else {
                const errorMsg = response.message || 'Login failed';
                setError(errorMsg);
            }
        } catch (err) {
            console.error('Caught error:', err);
            
            // Handle different error types with specific messages
            let errorMsg = err.message || 'Login failed';
            
            if (errorMsg.includes('invalid email or password') || errorMsg.includes('401')) {
                errorMsg = 'Invalid email or password. Please try again.';
            } else if (errorMsg.includes('Network Error')) {
                errorMsg = 'Cannot connect to server. Please check if backend is running.';
            }
            
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon">📦</div>
                <div className="auth-header">
                    <h2>BorrowBox</h2>
                    <p>Campus Item Borrowing System</p>
                </div>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'LOGIN'}
                    </button>
                </form>

                <p className="alt-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;