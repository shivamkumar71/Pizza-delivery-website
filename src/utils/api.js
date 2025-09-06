// ...existing code...
const API_BASE_URL = 'https://pizza-corner-kf2q.onrender.com/api'; // <-- Replace with your actual deployed API URL
// ...existing code...

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
};

export const orderAPI = {
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getAll: () => apiRequest('/orders'),
  
  delete: (orderId) => apiRequest(`/orders/${orderId}`, {
    method: 'DELETE',
  }),
};

export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  updateProfile: (userData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

export const contactAPI = {
  submit: (contactData) => apiRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
};