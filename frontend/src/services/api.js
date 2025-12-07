import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getProducts = (params) => api.get('products/', { params });
export const getCategories = () => api.get('categories/');
export const createCategory = (data) => api.post('admin/categories/', data);
export const updateCategory = (id, data) => api.patch(`admin/categories/${id}/`, data);
export const deleteCategory = (id) => api.delete(`admin/categories/${id}/`);
export const getProduct = (id) => api.get(`products/${id}/`);

// Cart
export const getCart = () => api.get('cart/');
export const addToCart = (itemData) => api.post('cart/items/', itemData);
export const updateCartItem = (id, data) => api.patch(`cart/items/${id}/`, data);
export const removeFromCart = (id) => api.delete(`cart/items/${id}/`);

export default api;
