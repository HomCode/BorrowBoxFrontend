import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const login = async (username, password) => {
    console.log('📤 Login API called with:', { username });
    
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        
        console.log('📥 Login response:', response.data);
        
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log('✅ User saved to localStorage');
        }
        
        return response.data;
    } catch (error) {
        console.error('❌ Login error:', error.response?.data || error.message);
        
        // Extract error message from response
        let errorMessage = 'Login failed';
        
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const register = async (userData) => {
    console.log('📤 Register API called with:', { ...userData, password: '***' });
    
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        
        console.log('📥 Register response:', response.data);
        
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log('✅ User saved to localStorage');
        }
        
        return response.data;
    } catch (error) {
        console.error('❌ Register error:', error.response?.data || error.message);
        
        // Extract error message from response
        let errorMessage = 'Registration failed';
        
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        // Check for specific error types
        if (error.response?.status === 401) {
            errorMessage = 'Authentication failed. Please check your credentials.';
        } else if (error.response?.status === 409) {
            errorMessage = 'User already exists. Please use a different email.';
        } else if (error.response?.status === 429) {
            errorMessage = 'Too many registration attempts. Please try again later.';
        }
        
        throw new Error(errorMessage);
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('👋 User logged out');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};