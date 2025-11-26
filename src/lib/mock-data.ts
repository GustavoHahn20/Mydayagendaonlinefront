import { Event, EventType, EventCategory, RepeatOption, User } from './types';

export const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '+55 11 99999-9999',
  timezone: 'America/Sao_Paulo',
};

// Dados padrão para tipos de evento
export const defaultEventTypes: EventType[] = [
  { id: '1', name: 'Reunião', color: '#3b82f6', icon: 'users' },
  { id: '2', name: 'Tarefa', color: '#10b981', icon: 'check-circle' },
  { id: '3', name: 'Compromisso', color: '#f59e0b', icon: 'calendar' },
  { id: '4', name: 'Lembrete', color: '#8b5cf6', icon: 'bell' },
  { id: '5', name: 'Pessoal', color: '#ec4899', icon: 'heart' },
];

// Dados padrão para categorias
export const defaultEventCategories: EventCategory[] = [
  { id: '1', name: 'Trabalho', color: '#3b82f6' },
  { id: '2', name: 'Pessoal', color: '#10b981' },
  { id: '3', name: 'Saúde', color: '#f59e0b' },
  { id: '4', name: 'Educação', color: '#8b5cf6' },
  { id: '5', name: 'Família', color: '#ec4899' },
];

// Dados padrão para opções de repetição
export const defaultRepeatOptions: RepeatOption[] = [
  { id: '1', name: 'Não repetir', value: 'none' },
  { id: '2', name: 'Diariamente', value: 'daily' },
  { id: '3', name: 'Semanalmente', value: 'weekly' },
  { id: '4', name: 'Mensalmente', value: 'monthly' },
  { id: '5', name: 'Anualmente', value: 'yearly' },
];

// Funções para gerenciar configurações no localStorage
const STORAGE_KEYS = {
  EVENT_TYPES: 'myday_event_types',
  EVENT_CATEGORIES: 'myday_event_categories',
  REPEAT_OPTIONS: 'myday_repeat_options',
  GENERAL_SETTINGS: 'myday_general_settings',
};

// Tipos de evento - carregar e salvar
export const getEventTypes = (): EventType[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.EVENT_TYPES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultEventTypes;
    }
  }
  return defaultEventTypes;
};

export const saveEventTypes = (types: EventType[]): void => {
  localStorage.setItem(STORAGE_KEYS.EVENT_TYPES, JSON.stringify(types));
};

// Categorias - carregar e salvar
export const getEventCategories = (): EventCategory[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.EVENT_CATEGORIES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultEventCategories;
    }
  }
  return defaultEventCategories;
};

export const saveEventCategories = (categories: EventCategory[]): void => {
  localStorage.setItem(STORAGE_KEYS.EVENT_CATEGORIES, JSON.stringify(categories));
};

// Opções de repetição - carregar e salvar
export const getRepeatOptions = (): RepeatOption[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.REPEAT_OPTIONS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultRepeatOptions;
    }
  }
  return defaultRepeatOptions;
};

export const saveRepeatOptions = (options: RepeatOption[]): void => {
  localStorage.setItem(STORAGE_KEYS.REPEAT_OPTIONS, JSON.stringify(options));
};

// Configurações gerais
export interface GeneralSettings {
  defaultView: string;
  weekStartsOn: string;
  timeFormat: string;
  dateFormat: string;
  defaultReminder: string;
  theme: string;
}

export const defaultGeneralSettings: GeneralSettings = {
  defaultView: 'month',
  weekStartsOn: 'sunday',
  timeFormat: '24h',
  dateFormat: 'dd/mm/yyyy',
  defaultReminder: '15min',
  theme: 'light',
};

export const getGeneralSettings = (): GeneralSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.GENERAL_SETTINGS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultGeneralSettings;
    }
  }
  return defaultGeneralSettings;
};

export const saveGeneralSettings = (settings: GeneralSettings): void => {
  localStorage.setItem(STORAGE_KEYS.GENERAL_SETTINGS, JSON.stringify(settings));
};

// Exports legados para compatibilidade
export const eventTypes = getEventTypes();
export const eventCategories = getEventCategories();
export const repeatOptions = getRepeatOptions();

// Helper para criar data relativa ao dia atual
const getRelativeDate = (daysOffset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Eventos mock com datas relativas à data atual
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Reunião com Cliente',
    description: 'Discutir proposta do novo projeto',
    startDate: getRelativeDate(0), // Hoje
    endDate: getRelativeDate(0),
    startTime: '09:00',
    endTime: '10:30',
    type: 'Reunião',
    category: 'Trabalho',
    priority: 'high',
    location: 'Sala de Reuniões 1',
    participants: 'Maria Santos, Pedro Costa',
    reminder: '15min',
    repeat: 'none',
    color: '#3b82f6',
    notes: 'Levar apresentação do projeto',
  },
  {
    id: '2',
    title: 'Consulta Médica',
    description: 'Check-up anual',
    startDate: getRelativeDate(1), // Amanhã
    endDate: getRelativeDate(1),
    startTime: '14:00',
    endTime: '15:00',
    type: 'Compromisso',
    category: 'Saúde',
    priority: 'medium',
    location: 'Clínica Central',
    reminder: '1hour',
    repeat: 'yearly',
    color: '#f59e0b',
  },
  {
    id: '3',
    title: 'Aniversário da Maria',
    description: 'Festa de aniversário',
    startDate: getRelativeDate(4), // 4 dias a partir de hoje
    endDate: getRelativeDate(4),
    startTime: '19:00',
    endTime: '23:00',
    type: 'Pessoal',
    category: 'Família',
    priority: 'high',
    location: 'Chácara da família',
    reminder: '1day',
    repeat: 'yearly',
    color: '#ec4899',
    notes: 'Comprar presente',
  },
  {
    id: '4',
    title: 'Entregar Relatório',
    description: 'Relatório mensal de vendas',
    startDate: getRelativeDate(3), // 3 dias a partir de hoje
    endDate: getRelativeDate(3),
    startTime: '17:00',
    endTime: '18:00',
    type: 'Tarefa',
    category: 'Trabalho',
    priority: 'high',
    location: 'Escritório',
    reminder: '2hours',
    repeat: 'monthly',
    color: '#10b981',
  },
  {
    id: '5',
    title: 'Academia',
    description: 'Treino de força',
    startDate: getRelativeDate(0), // Hoje
    endDate: getRelativeDate(0),
    startTime: '18:00',
    endTime: '19:30',
    type: 'Pessoal',
    category: 'Saúde',
    priority: 'medium',
    location: 'Smart Fit',
    reminder: '30min',
    repeat: 'weekly',
    color: '#ec4899',
  },
];
