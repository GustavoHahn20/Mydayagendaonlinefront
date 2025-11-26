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

// Resposta da API de autenticação
interface ApiAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    timezone?: string;
    avatar?: string;
  };
}

// Resposta normalizada para o frontend
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
    super(translateErrorMessage(message));
    this.name = 'ApiError';
  }
}

// Tradução de mensagens de erro do backend para português
function translateErrorMessage(message: string): string {
  const translations: Record<string, string> = {
    // Erros de senha
    'Password must contain at least one digit, one lowercase, one uppercase, and one special character':
      'A senha deve conter pelo menos um número, uma letra minúscula, uma letra maiúscula e um caractere especial',
    'Password must be at least 6 characters':
      'A senha deve ter pelo menos 6 caracteres',
    'Password must be at least 8 characters':
      'A senha deve ter pelo menos 8 caracteres',
    'Invalid password':
      'Senha inválida',
    'Passwords do not match':
      'As senhas não coincidem',
    
    // Erros de email
    'Invalid email':
      'E-mail inválido',
    'Email already exists':
      'Este e-mail já está cadastrado',
    'Email is required':
      'O e-mail é obrigatório',
    'User not found':
      'Usuário não encontrado',
    
    // Erros de autenticação
    'Invalid credentials':
      'Credenciais inválidas',
    'Invalid email or password':
      'E-mail ou senha incorretos',
    'Unauthorized':
      'Não autorizado',
    'Token expired':
      'Sessão expirada. Faça login novamente',
    'Invalid token':
      'Token inválido',
    
    // Erros gerais
    'Name is required':
      'O nome é obrigatório',
    'All fields are required':
      'Todos os campos são obrigatórios',
    'Internal server error':
      'Erro interno do servidor',
    'Server error':
      'Erro no servidor',
    'Network error':
      'Erro de conexão',
    'Request failed':
      'Falha na requisição',
    'Something went wrong':
      'Algo deu errado',
    
    // Erros de eventos
    'Event not found':
      'Evento não encontrado',
    'Title is required':
      'O título é obrigatório',
    'Start date is required':
      'A data de início é obrigatória',
    'End date is required':
      'A data de término é obrigatória',
    'Invalid date format':
      'Formato de data inválido',
  };

  // Verifica se a mensagem contém alguma tradução conhecida
  for (const [english, portuguese] of Object.entries(translations)) {
    if (message.toLowerCase().includes(english.toLowerCase())) {
      return portuguese;
    }
  }

  // Se a mensagem for um JSON com erro, tenta extrair
  try {
    const parsed = JSON.parse(message);
    if (parsed.password) {
      return translateErrorMessage(parsed.password);
    }
    if (parsed.error) {
      return translateErrorMessage(parsed.error);
    }
    if (parsed.message) {
      return translateErrorMessage(parsed.message);
    }
  } catch {
    // Não é JSON, continua
  }

  // Retorna a mensagem original se não houver tradução
  return message;
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
    
    // Trata erros que vêm como objeto (ex: {"password": "mensagem"})
    let errorMessage = 'Erro na requisição';
    if (typeof errorData === 'object') {
      // Verifica campos específicos de erro
      if (errorData.password) {
        errorMessage = errorData.password;
      } else if (errorData.email) {
        errorMessage = errorData.email;
      } else if (errorData.name) {
        errorMessage = errorData.name;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    }
    
    throw new ApiError(response.status, errorMessage);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;
  
  return JSON.parse(text);
}

// ==================== AUTH ====================

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const apiResponse = await request<ApiAuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Normalizar resposta
    const response: AuthResponse = {
      token: apiResponse.access_token,
      user: apiResponse.user,
    };
    
    // Salvar token no localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const apiResponse = await request<ApiAuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Normalizar resposta
    const response: AuthResponse = {
      token: apiResponse.access_token,
      user: apiResponse.user,
    };
    
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

