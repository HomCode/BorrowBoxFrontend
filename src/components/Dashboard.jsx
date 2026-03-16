import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // ADDED Link import
import { getCurrentUser, logout, isAuthenticated } from '../api/auth';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="auth-container">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div className="auth-icon">📦</div>
                <h2>Welcome to BorrowBox!</h2>
                <p className="welcome-message">You have successfully logged in.</p>
                
                <div className="user-info">
                    <p><strong>Name:</strong> {user.fullName}</p>
                    <p><strong>Email:</strong> {user.username}</p>
                    <p><strong>Role:</strong> 
                        <span className="role-badge">
                            {user.role === 'student' ? 'Student' : 'Organization Officer'}
                        </span>
                    </p>
                    {user.studentId && <p><strong>Student ID:</strong> {user.studentId}</p>}
                    {user.orgId && <p><strong>Organization ID:</strong> {user.orgId}</p>}
                </div>

                {/* NEW: Profile Link Button */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                    <Link to="/profile" className="btn btn-primary" style={{ textDecoration: 'none', width: 'auto' }}>
                        View Profile
                    </Link>
                </div>

                <button onClick={handleLogout} className="btn btn-primary">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;