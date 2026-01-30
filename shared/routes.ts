export const API_BASE = '/api';

export const routes = {
  // Auth routes
  auth: {
    signup: `${API_BASE}/auth/signup`,
    signin: `${API_BASE}/auth/signin`,
    signout: `${API_BASE}/auth/signout`,
    me: `${API_BASE}/auth/me`,
    refresh: `${API_BASE}/auth/refresh`,
    updateProfile: `${API_BASE}/auth/profile`,
  },

  // Request routes
  requests: {
    list: `${API_BASE}/requests`,
    create: `${API_BASE}/requests`,
    get: (id: string) => `${API_BASE}/requests/${id}`,
    update: (id: string) => `${API_BASE}/requests/${id}`,
    delete: (id: string) => `${API_BASE}/requests/${id}`,
    search: `${API_BASE}/requests/search`,
    statistics: `${API_BASE}/requests/statistics`,
    export: `${API_BASE}/requests/export`,
    rate: (id: string) => `${API_BASE}/requests/${id}/rate`,
    history: (id: string) => `${API_BASE}/requests/${id}/history`,
  },

  // Attachment routes
  attachments: {
    upload: `${API_BASE}/attachments/upload`,
    delete: (id: string) => `${API_BASE}/attachments/${id}`,
    list: (requestId: string) => `${API_BASE}/requests/${requestId}/attachments`,
  },

  // Assignment routes
  assignments: {
    list: `${API_BASE}/assignments`,
    create: `${API_BASE}/assignments`,
    get: (id: string) => `${API_BASE}/assignments/${id}`,
    update: (id: string) => `${API_BASE}/assignments/${id}`,
    accept: (id: string) => `${API_BASE}/assignments/${id}/accept`,
    reject: (id: string) => `${API_BASE}/assignments/${id}/reject`,
    complete: (id: string) => `${API_BASE}/assignments/${id}/complete`,
  },

  // Category routes
  categories: {
    list: `${API_BASE}/categories`,
    get: (id: string) => `${API_BASE}/categories/${id}`,
    create: `${API_BASE}/categories`,
    update: (id: string) => `${API_BASE}/categories/${id}`,
  },

  // Notification routes
  notifications: {
    list: `${API_BASE}/notifications`,
    markAsRead: (id: string) => `${API_BASE}/notifications/${id}/read`,
    markAllAsRead: `${API_BASE}/notifications/read-all`,
    delete: (id: string) => `${API_BASE}/notifications/${id}`,
    count: `${API_BASE}/notifications/unread-count`,
  },

  // User routes
  users: {
    list: `${API_BASE}/users`,
    get: (id: string) => `${API_BASE}/users/${id}`,
    statistics: `${API_BASE}/users/statistics`,
    byRole: (role: string) => `${API_BASE}/users/role/${role}`,
  },

  // Dashboard routes
  dashboard: {
    overview: `${API_BASE}/dashboard/overview`,
    stats: `${API_BASE}/dashboard/stats`,
    requests: `${API_BASE}/dashboard/requests`,
    performance: `${API_BASE}/dashboard/performance`,
  },
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>;
