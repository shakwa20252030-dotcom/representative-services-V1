import { getAuthToken } from './supabase';
import { routes } from '@shared/routes';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any
  ): Promise<T> {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: response.statusText,
      }));
      throw new Error(error.error || 'Request failed');
    }

    if (response.status === 204) {
      return undefined as any;
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>('GET', endpoint);
  }

  post<T>(endpoint: string, body: any) {
    return this.request<T>('POST', endpoint, body);
  }

  put<T>(endpoint: string, body: any) {
    return this.request<T>('PUT', endpoint, body);
  }

  delete<T>(endpoint: string) {
    return this.request<T>('DELETE', endpoint);
  }
}

export const apiClient = new ApiClient();

// Auth services
export const authService = {
  signup: (data: any) => apiClient.post(routes.auth.signup, data),
  signin: (data: any) => apiClient.post(routes.auth.signin, data),
  signout: () => apiClient.post(routes.auth.signout, {}),
  getMe: () => apiClient.get(routes.auth.me),
  updateProfile: (data: any) => apiClient.put(routes.auth.updateProfile, data),
};

// Request services
export const requestService = {
  list: (limit?: number, offset?: number) =>
    apiClient.get(
      `${routes.requests.list}?limit=${limit || 20}&offset=${offset || 0}`
    ),
  get: (id: string) => apiClient.get(routes.requests.get(id)),
  create: (data: any) => apiClient.post(routes.requests.create, data),
  update: (id: string, data: any) =>
    apiClient.put(routes.requests.update(id), data),
  delete: (id: string) => apiClient.delete(routes.requests.delete(id)),
  getHistory: (id: string) => apiClient.get(routes.requests.history(id)),
};

// Category services
export const categoryService = {
  list: () => apiClient.get(routes.categories.list),
  get: (id: string) => apiClient.get(routes.categories.get(id)),
};

// Notification services
export const notificationService = {
  list: () => apiClient.get(routes.notifications.list),
  markAsRead: (id: string) =>
    apiClient.post(routes.notifications.markAsRead(id), {}),
  markAllAsRead: () =>
    apiClient.post(routes.notifications.markAllAsRead, {}),
};
