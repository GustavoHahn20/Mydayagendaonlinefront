// API Service para comunicação com o backend
const API_URL = import.meta.env.VITE_API_URL || 'https://my-day-agenda-online-api.vercel.app';

// Tipos para autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    timezone?: string;
    avatar?: string;
  };
}

// Tipos para eventos (API)
export interface EventAPI {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: string;
  category: string;
  priority: string;
  color: string;
  location?: string;
  participants?: string;
  reminder?: string;
  repeat?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type?: string;
  category?: string;
  priority?: string;
  color?: string;
  location?: string;
  participants?: string;
  reminder?: string;
  repeat?: string;
  notes?: string;
}

// Classe de erro da API
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper para fazer requisições
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.error || errorData.message || 'Erro na requisição'
    );
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;
  
  return JSON.parse(text);
}

// ==================== AUTH ====================

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Salvar token no localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Salvar token no localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  },

  validate: async (): Promise<{ valid: boolean; user?: AuthResponse['user'] }> => {
    try {
      const response = await request<{ valid: boolean; user: AuthResponse['user'] }>('/api/auth/validate');
      return response;
    } catch {
      return { valid: false };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser: (): AuthResponse['user'] | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

// ==================== EVENTS ====================

export const eventsApi = {
  getAll: async (): Promise<EventAPI[]> => {
    return request<EventAPI[]>('/api/events');
  },

  getById: async (id: string): Promise<EventAPI> => {
    return request<EventAPI>(`/api/events/${id}`);
  },

  getByDate: async (date: string): Promise<EventAPI[]> => {
    return request<EventAPI[]>(`/api/events/date/${date}`);
  },

  getByRange: async (startDate: string, endDate: string): Promise<EventAPI[]> => {
    return request<EventAPI[]>(`/api/events/range?startDate=${startDate}&endDate=${endDate}`);
  },

  create: async (data: CreateEventRequest): Promise<EventAPI> => {
    return request<EventAPI>('/api/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<CreateEventRequest>): Promise<EventAPI> => {
    return request<EventAPI>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await request<void>(`/api/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== USER ====================

export const userApi = {
  getProfile: async (): Promise<AuthResponse['user']> => {
    return request<AuthResponse['user']>('/api/user');
  },

  updateProfile: async (data: Partial<RegisterRequest>): Promise<AuthResponse['user']> => {
    return request<AuthResponse['user']>('/api/user', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ==================== HELPERS ====================

// Converter evento da API para o formato do frontend
export function apiEventToLocal(event: EventAPI): import('./types').Event {
  return {
    id: event.id,
    title: event.title,
    description: event.description || '',
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    startTime: event.startTime,
    endTime: event.endTime,
    type: event.type,
    category: event.category,
    priority: event.priority as 'low' | 'medium' | 'high',
    color: event.color,
    location: event.location,
    participants: event.participants,
    reminder: event.reminder,
    repeat: event.repeat,
    notes: event.notes,
  };
}

// Converter evento do frontend para o formato da API
export function localEventToApi(event: import('./types').Event): CreateEventRequest {
  return {
    title: event.title,
    description: event.description,
    startDate: event.startDate.toISOString().split('T')[0],
    endDate: event.endDate.toISOString().split('T')[0],
    startTime: event.startTime,
    endTime: event.endTime,
    type: event.type,
    category: event.category,
    priority: event.priority,
    color: event.color,
    location: event.location,
    participants: event.participants,
    reminder: event.reminder,
    repeat: event.repeat,
    notes: event.notes,
  };
}

