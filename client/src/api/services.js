import api from './axios';

// Service Category API
export const categoryAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Service API
export const serviceAPI = {
  getAll: async (categoryId = null) => {
    const url = categoryId ? `/services?category=${categoryId}` : '/services';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/services', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

// Service Provider API
export const providerAPI = {
  getAll: async (queryOrServiceId = null) => {
    let url = '/providers';
    if (queryOrServiceId) {
      // If it starts with '?', it's a raw query string (e.g., ?user=xxx)
      if (queryOrServiceId.startsWith('?')) {
        url = `/providers${queryOrServiceId}`;
      } else {
        url = `/providers?service=${queryOrServiceId}`;
      }
    }
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/providers/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/providers', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/providers/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/providers/${id}`);
    return response.data;
  },
};

// Booking API
export const bookingAPI = {
  getAll: async (status = null) => {
    const url = status ? `/bookings?status=${status}` : '/bookings';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

// Review API
export const reviewAPI = {
  getAll: async (providerId = null) => {
    const url = providerId ? `/reviews?provider=${providerId}` : '/reviews';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// User API (Admin)
export const userAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Wallet API
export const walletAPI = {
  initializePayment: async (amount) => {
    const response = await api.post('/wallet/initialize', { amount });
    return response.data;
  },

  verifyPayment: async (reference) => {
    const response = await api.get(`/wallet/verify/${reference}`);
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  }
};
