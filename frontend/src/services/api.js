import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api`,
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  logout: () => API.post('/auth/logout'),
};

export const customerAPI = {
  getAll: () => API.get('/customers'),
  getById: (id) => API.get(`/customers/${id}`),
  add: (data) => API.post('/customers', data),
  getByUserId: (userId) => API.get(`/customers/user/${userId}`),
  delete: (id) => API.delete(`/customers/${id}`),
};

export const restaurantAPI = {
  getAll: () => API.get('/restaurants'),
  add: (data) => API.post('/restaurants', data),
  update: (id, data) => API.put(`/restaurants/${id}`, data),
  getByUserId: (userId) => API.get(`/restaurants/user/${userId}`),
  delete: (id) => API.delete(`/restaurants/${id}`),
};

export const foodItemAPI = {
  getByRestaurant: (restaurantId) => API.get(`/restaurants/${restaurantId}/items`),
  add: (restaurantId, data) => API.post(`/restaurants/${restaurantId}/items`, data),
  delete: (restaurantId, itemId) => API.delete(`/restaurants/${restaurantId}/items/${itemId}`),
};

export const orderAPI = {
  getAll: () => API.get('/orders'),
  getById: (id) => API.get(`/orders/${id}`),
  getByCustomer: (customerId) => API.get(`/orders/customer/${customerId}`),
  getByRestaurant: (restaurantId) => API.get(`/orders/restaurant/${restaurantId}`),
  place: (customerId, restaurantId, data) => API.post(`/orders/place?customerId=${customerId}&restaurantId=${restaurantId}`, data),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  accept: (id) => API.put(`/orders/${id}/accept`),
  reject: (id) => API.put(`/orders/${id}/reject`),
  assign: (orderId, partnerId) => API.put(`/orders/${orderId}/assign/${partnerId}`),
};

export const paymentAPI = {
  getAll: () => API.get('/payments'),
  process: (orderId, amount) => API.post(`/payments/process?orderId=${orderId}&amount=${amount}`),
};

export const couponAPI = {
  getAll: () => API.get('/coupons'),
  create: (data) => API.post('/coupons', data),
  validate: (code) => API.get(`/coupons/validate/${code}`),
  deactivate: (id) => API.put(`/coupons/${id}/deactivate`),
};

export const deliveryAPI = {
  getPartners: () => API.get('/delivery/partners'),
  getAvailablePartners: () => API.get('/delivery/partners/available'),
  getByUserId: (userId) => API.get(`/delivery/partners/user/${userId}`),
  createPartner: (data) => API.post('/delivery/partners', data),
  updateLocation: (id, lat, lng) => API.put(`/delivery/partners/${id}/location`, { latitude: lat, longitude: lng }),
  getAssignedOrders: (partnerId) => API.get(`/delivery/orders/${partnerId}`),
  getAvailableOrders: () => API.get('/delivery/orders/available'),
  acceptOrder: (orderId, partnerId) => API.put(`/delivery/orders/${orderId}/accept/${partnerId}`),
  pickup: (orderId) => API.put(`/delivery/orders/${orderId}/pickup`),
  deliver: (orderId) => API.put(`/delivery/orders/${orderId}/deliver`),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getAllOrders: () => API.get('/admin/orders'),
  assignPartner: (orderId, partnerId) => API.put(`/admin/orders/${orderId}/assign/${partnerId}`),
  getPartners: () => API.get('/admin/partners'),
  createPartner: (data) => API.post('/admin/partners', data),
};

export default API;
