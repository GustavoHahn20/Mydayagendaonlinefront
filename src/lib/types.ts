export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  type: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  location?: string;
  participants?: string;
  reminder?: string;
  repeat?: string;
  color: string;
  notes?: string;
}

export interface EventType {
  id: string;
  name: string;
  color: string;
  icon: string;
  active?: boolean; // Se não definido, considera como ativo
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  active?: boolean; // Se não definido, considera como ativo
}

export interface RepeatOption {
  id: string;
  name: string;
  value: string;
  active?: boolean; // Se não definido, considera como ativo
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  timezone?: string;
}

export type CalendarView = 'day' | 'week' | 'month';
