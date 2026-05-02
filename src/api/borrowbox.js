import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ITEMS
export const getAllItems = async () => {
  const res = await api.get('/items');
  return res.data;
};

export const getAvailableItems = async () => {
  const res = await api.get('/items/available/all');
  return res.data;
};

export const createItem = async (itemData) => {
  const res = await api.post('/items/create', itemData);
  return res.data;
};

export const updateItem = async (id, itemData) => {
  const res = await api.put(`/items/${id}`, itemData);
  return res.data;
};

export const deleteItem = async (id) => {
  const res = await api.delete(`/items/${id}`);
  return res.data;
};

// BORROWS
export const borrowItem = async (itemId, notes = '') => {
  const res = await api.post('/borrows/borrow', {
    itemId,
    notes,
  });
  return res.data;
};

export const getStudentBorrows = async () => {
  const res = await api.get('/borrows/student');
  return res.data;
};

export const returnBorrow = async (borrowId, condition = 'Good') => {
  const res = await api.post(`/borrows/${borrowId}/return`, {
    condition,
  });
  return res.data;
};

export const getAllBorrows = async () => {
  const res = await api.get('/borrows');
  return res.data;
};

// TRANSACTIONS
export const getAllTransactions = async () => {
  const res = await api.get('/transactions');
  return res.data;
};

export const getTransactionsByStatus = async (status) => {
  const res = await api.get(`/transactions/status/${status}`);
  return res.data;
};