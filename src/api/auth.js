import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const AUTH_URL = `${API_URL}/auth`;
const PROFILE_URL = `${API_URL}/profile`;

const authAxios = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const login = async (username, password) => {
    console.log('📤 Login API called with:', { username });
    
    try {
        const response = await axios.post(`${AUTH_URL}/login`, {
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
        const response = await axios.post(`${AUTH_URL}/register`, userData);
        
        console.log('📥 Register response:', response.data);
        
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log('✅ User saved to localStorage');
        }
        
        return response.data;
    } catch (error) {
        console.error('❌ Register error:', error.response?.data || error.message);
        
        let errorMessage = 'Registration failed';
        
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
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

export const getProfile = async () => {
    console.log('📤 Get Profile API called');
    
    try {
        const response = await authAxios().get(`${PROFILE_URL}`);
        console.log('📥 Profile response:', response.data);

        if (response.data.success && response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        console.error('❌ Get Profile error:', error.response?.data || error.message);
        
        let errorMessage = 'Failed to fetch profile';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const updateProfile = async (profileData) => {
    console.log('📤 Update Profile API called with:', profileData);
    
    try {
        const response = await authAxios().put(`${PROFILE_URL}`, profileData);
        
        console.log('📥 Update Profile response:', response.data);
        
        if (response.data.success && response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    } catch (error) {
        console.error('❌ Update Profile error:', error.response?.data || error.message);
        
        let errorMessage = 'Failed to update profile';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const updatePassword = async (passwordData) => {
    console.log('📤 Update Password API called');
    
    try {
        const response = await authAxios().put(`${PROFILE_URL}/password`, passwordData);
        
        console.log('📥 Update Password response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Update Password error:', error.response?.data || error.message);
        
        let errorMessage = 'Failed to update password';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const uploadPhoto = async (file) => {
    console.log('📤 Upload Photo API called');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post(`${PROFILE_URL}/photo`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('📥 Upload Photo response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Upload Photo error:', error.response?.data || error.message);
        
        let errorMessage = 'Failed to upload photo';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        
        throw new Error(errorMessage);
    }
};

export const getPhotoBlobUrl = async () => {
    try {
        const response = await authAxios().get(`${PROFILE_URL}/photo`, {
            responseType: 'blob'
        });

        return URL.createObjectURL(response.data);
    } catch (error) {
        console.error('❌ Get Photo error:', error.response?.data || error.message);
        return null;
    }
};

export const deletePhoto = async () => {
    console.log('📤 Delete Photo API called');
    
    try {
        const response = await authAxios().delete(`${PROFILE_URL}/photo`);
        
        console.log('📥 Delete Photo response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Delete Photo error:', error.response?.data || error.message);
        
        let errorMessage = 'Failed to delete photo';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
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