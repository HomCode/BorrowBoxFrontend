import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const AUTH_URL = `${API_URL}/auth`;
const PROFILE_URL = `${API_URL}/profile`;

export const notifyUserChanged = () => {
  window.dispatchEvent(new Event('user-changed'));
};

export const saveUserToStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  notifyUserChanged();
};

const authAxios = () => {
  const token = localStorage.getItem('token');

  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, {
      email,
      password
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      saveUserToStorage(response.data.user);
    }

    return response.data;
  } catch (error) {
    let errorMessage = 'Login failed';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status === 500) {
      errorMessage = 'Backend server error during login.';
    } else if (error.message === 'Network Error') {
      errorMessage = 'Unable to connect to server. Please check if the backend is running.';
    }

    throw new Error(errorMessage);
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, userData);

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      saveUserToStorage(response.data.user);
    }

    return response.data;
  } catch (error) {
    let errorMessage = 'Registration failed';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const getProfile = async () => {
  try {
    const response = await authAxios().get(PROFILE_URL);

    if (response.data.success && response.data.user) {
      saveUserToStorage(response.data.user);
    }

    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to fetch profile';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await authAxios().put(PROFILE_URL, profileData);

    if (response.data.success && response.data.user) {
      saveUserToStorage(response.data.user);
    }

    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to update profile';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const response = await authAxios().put(`${PROFILE_URL}/password`, passwordData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to update password';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(`${PROFILE_URL}/photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
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
    return null;
  }
};

export const deletePhoto = async () => {
  try {
    const response = await authAxios().delete(`${PROFILE_URL}/photo`);
    return response.data;
  } catch (error) {
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
  notifyUserChanged();
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