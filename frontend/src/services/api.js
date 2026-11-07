/**
 * MERN Frontend Service Layer (src/services/api.js)
 *
 * Designed so the React application operates autonomously as a standalone MERN frontend
 * (persisting products, uploaded photos, orders, and settings in IndexedDB),
 * AND can connect directly to a Node/Express/MongoDB REST API by setting VITE_API_URL.
 */

import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { dbGet, dbSet } from './storageDb';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function requestBackend(endpoint, options = {}) {
  const token = sessionStorage.getItem('jp_admin_token') || '';
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Erreur réseau avec le serveur');
  }
  return response.json();
}

export const boutiqueApi = {
  async loadInitialData() {
    if (API_BASE_URL) {
      const [products, settings] = await Promise.all([
        requestBackend('/api/products'),
        requestBackend('/api/settings'),
      ]);
      return { products, settings };
    }

    let products = await dbGet('products', null);
    if (!products || !Array.isArray(products) || products.length === 0) {
      products = INITIAL_PRODUCTS;
      await dbSet('products', products);
    }

    let settings = await dbGet('settings', null);
    if (!settings) {
      settings = INITIAL_SETTINGS;
      await dbSet('settings', settings);
    }

    let orders = await dbGet('orders', null);
    if (!orders || !Array.isArray(orders)) {
      orders = INITIAL_ORDERS;
      await dbSet('orders', orders);
    }

    return { products, settings, orders };
  },

  async saveProducts(products) {
    if (API_BASE_URL) {
      return requestBackend('/api/products/bulk', {
        method: 'PUT',
        body: JSON.stringify({ products }),
      });
    }
    await dbSet('products', products);
    return products;
  },

  async saveOrders(orders) {
    if (API_BASE_URL) {
      return requestBackend('/api/orders/bulk', {
        method: 'PUT',
        body: JSON.stringify({ orders }),
      });
    }
    await dbSet('orders', orders);
    return orders;
  },

  async saveSettings(settings) {
    if (API_BASE_URL) {
      return requestBackend('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    }
    await dbSet('settings', settings);
    return settings;
  },

  async verifyAdminPassword(password) {
    if (API_BASE_URL) {
      const data = await requestBackend('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      if (data.token) sessionStorage.setItem('jp_admin_token', data.token);
      return true;
    }
    const storedPassword = (await dbGet('admin_password', null)) || 'joshua2026';
    return password === storedPassword;
  },

  async updateAdminPassword(newPassword) {
    if (API_BASE_URL) {
      return requestBackend('/api/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ newPassword }),
      });
    }
    await dbSet('admin_password', newPassword);
    return true;
  },
};
