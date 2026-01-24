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
  getAll: async (serviceId = null) => {
    const url = serviceId ? `/providers?service=${serviceId}` : '/providers';
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
