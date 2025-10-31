import axios, { AxiosInstance, AxiosError } from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Products
  getProducts(params?: any) {
    return this.client.get('/api/store/products', { params });
  }

  getProduct(id: string) {
    return this.client.get(`/api/store/products/${id}`);
  }

  // Categories
  getCategories() {
    return this.client.get('/api/store/categories');
  }

  getCategoryBySlug(slug: string) {
    return this.client.get(`/api/store/categories/${slug}`);
  }

  getCategoryProducts(slug: string) {
    return this.client.get(`/api/store/categories/${slug}/products`);
  }

  // Orders
  createOrder(data: any) {
    return this.client.post('/api/store/checkout/submit', data);
  }

  getOrder(orderId: string) {
    return this.client.get(`/api/store/orders/${orderId}`);
  }

  trackGuestOrder(email: string, code: string) {
    return this.client.get(`/api/store/guest/track-order`, {
      params: { email, code },
    });
  }

  // Shipping
  calculateShipping(data: any) {
    return this.client.post('/api/store/shipping/calculate', data);
  }

  trackShipment(trackingNumber: string) {
    return this.client.get(`/api/store/shipments/track/${trackingNumber}`);
  }

  // Generic methods
  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
