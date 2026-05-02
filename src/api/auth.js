import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
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
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// ============================================================================
// ITEM API METHODS (Inventory Management)
// ============================================================================

const ITEMS_URL = `${API_URL}/items`;

export const getItems = async () => {
  try {
    const response = await axios.get(ITEMS_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch items');
  }
};

export const getItemById = async (itemId) => {
  try {
    const response = await axios.get(`${ITEMS_URL}/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch item');
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await authAxios().post(`${ITEMS_URL}/create`, itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create item');
  }
};

export const updateItem = async (itemId, itemData) => {
  try {
    const response = await authAxios().put(`${ITEMS_URL}/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update item');
  }
};

export const deleteItem = async (itemId) => {
  try {
    const response = await authAxios().delete(`${ITEMS_URL}/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete item');
  }
};

export const searchItems = async (searchTerm) => {
  try {
    const response = await axios.get(`${ITEMS_URL}/search/${searchTerm}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search items');
  }
};

export const getItemsByCategory = async (category) => {
  try {
    const response = await axios.get(`${ITEMS_URL}/category/${category}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch items by category');
  }
};

export const getAvailableItems = async () => {
  try {
    const response = await axios.get(`${ITEMS_URL}/available/all`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch available items');
  }
};

// ============================================================================
// BORROW API METHODS (Item Borrowing)
// ============================================================================

const BORROWS_URL = `${API_URL}/borrows`;

export const borrowItem = async (borrowData) => {
  try {
    const response = await authAxios().post(`${BORROWS_URL}/borrow`, borrowData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to borrow item');
  }
};

export const returnItem = async (borrowId, returnData) => {
  try {
    const response = await authAxios().post(`${BORROWS_URL}/${borrowId}/return`, returnData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to return item');
  }
};

export const getAllBorrows = async () => {
  try {
    const response = await axios.get(BORROWS_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch borrows');
  }
};

export const getBorrowById = async (borrowId) => {
  try {
    const response = await axios.get(`${BORROWS_URL}/${borrowId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch borrow');
  }
};

export const getStudentBorrows = async () => {
  try {
    const response = await authAxios().get(`${BORROWS_URL}/student`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch student borrows');
  }
};

export const getStudentActiveBorrows = async () => {
  try {
    const response = await authAxios().get(`${BORROWS_URL}/student/active`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch active borrows');
  }
};

export const getOverdueItems = async () => {
  try {
    const response = await axios.get(`${BORROWS_URL}/overdue/all`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch overdue items');
  }
};

// ============================================================================
// TRANSACTION API METHODS (Transaction History)
// ============================================================================

const TRANSACTIONS_URL = `${API_URL}/transactions`;

export const getAllTransactions = async () => {
  try {
    const response = await axios.get(TRANSACTIONS_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};

export const getTransactionById = async (transactionId) => {
  try {
    const response = await axios.get(`${TRANSACTIONS_URL}/${transactionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transaction');
  }
};

export const getStudentTransactions = async (studentId) => {
  try {
    const response = await axios.get(`${TRANSACTIONS_URL}/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch student transactions');
  }
};

export const getTransactionsByStatus = async (status) => {
  try {
    const response = await axios.get(`${TRANSACTIONS_URL}/status/${status}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions by status');
  }
};

export const getTransactionsByItem = async (itemId) => {
  try {
    const response = await axios.get(`${TRANSACTIONS_URL}/item/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch item transactions');
  }
};

export const getTransactionsByDateRange = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${TRANSACTIONS_URL}/range`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions by date range');
  }
};