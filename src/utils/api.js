// ...existing code...
const API_BASE_URL = 'https://anshu-pizza-waale.onrender.com/api'; // <-- Replace with your actual deployed API URL
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
  const contentType = response.headers.get('content-type') || '';

  // Handle non-OK responses: try JSON first, then fallback to text
  if (!response.ok) {
    if (contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.error || error.message || JSON.stringify(error));
    }
    const text = await response.text();
  // Some hosts return HTML error pages - strip HTML tags and return readable text
  const stripped = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  throw new Error(stripped || text || 'API request failed');
  }

  // For success, parse JSON if present, otherwise return text
  if (contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  const stripped = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return stripped || text;
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
  
  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  resetPassword: (token, password) => apiRequest(`/auth/reset-password/${token}`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),

  changePassword: (currentPassword, newPassword) => apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  }),
};

export const contactAPI = {
  submit: (contactData) => apiRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
};