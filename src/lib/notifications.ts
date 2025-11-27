import { Event } from './types';

export interface Notification {
  id: string;
  eventId: string;
  eventTitle: string;
  eventColor: string;
  message: string;
  type: 'reminder' | 'today' | 'upcoming';
  eventDate: Date;
  eventTime: string;
  createdAt: Date;
}

// Chave do localStorage para notificações dispensadas
const DISMISSED_NOTIFICATIONS_KEY = 'myday_dismissed_notifications';

// Obter notificações dispensadas do localStorage
export function getDismissedNotifications(): string[] {
  try {
    const stored = localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erro ao carregar notificações dispensadas:', error);
  }
  return [];
}

// Salvar notificação como dispensada
export function dismissNotification(notificationId: string): void {
  const dismissed = getDismissedNotifications();
  if (!dismissed.includes(notificationId)) {
    dismissed.push(notificationId);
    localStorage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(dismissed));
  }
}

// Limpar notificações dispensadas (para quando o usuário acessar a seção de notificações)
export function clearDismissedNotifications(): void {
  localStorage.removeItem(DISMISSED_NOTIFICATIONS_KEY);
}

// Converter o lembrete para minutos
function reminderToMinutes(reminder: string | undefined): number {
  if (!reminder || reminder === 'none') return 0;
  
  switch (reminder) {
    case '15min': return 15;
    case '30min': return 30;
    case '1hour': return 60;
    case '2hours': return 120;
    case '1day': return 1440; // 24 * 60
    default: return 0;
  }
}

// Formatar o tempo do lembrete para exibição
function formatReminderText(reminder: string | undefined): string {
  switch (reminder) {
    case '15min': return '15 minutos';
    case '30min': return '30 minutos';
    case '1hour': return '1 hora';
    case '2hours': return '2 horas';
    case '1day': return '1 dia';
    default: return '';
  }
}

// Gerar notificações baseadas nos eventos
export function generateNotifications(events: Event[]): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0);
    
    // Criar data/hora completa do evento
    const [hours, minutes] = event.startTime.split(':').map(Number);
    const eventDateTime = new Date(event.startDate);
    eventDateTime.setHours(hours, minutes, 0, 0);
    
    // Calcular diferença em minutos
    const diffMinutes = (eventDateTime.getTime() - now.getTime()) / (1000 * 60);
    const reminderMinutes = reminderToMinutes(event.reminder);
    
    // Verificar se é um evento de hoje
    const isToday = eventDate.getTime() === today.getTime();
    
    // Verificar se está dentro do período do lembrete
    const isWithinReminder = reminderMinutes > 0 && diffMinutes > 0 && diffMinutes <= reminderMinutes;
    
    // Notificação de lembrete (dentro do período configurado)
    if (isWithinReminder) {
      const notificationId = `reminder-${event.id}-${event.startDate.toISOString().split('T')[0]}`;
      notifications.push({
        id: notificationId,
        eventId: event.id,
        eventTitle: event.title,
        eventColor: event.color,
        message: `Lembrete: "${event.title}" começa em ${formatReminderText(event.reminder)}`,
        type: 'reminder',
        eventDate: event.startDate,
        eventTime: event.startTime,
        createdAt: now,
      });
    }
    
    // Notificação de evento hoje (se ainda não passou)
    if (isToday && diffMinutes > 0) {
      const notificationId = `today-${event.id}-${event.startDate.toISOString().split('T')[0]}`;
      
      // Só adicionar se não tiver lembrete ativo (para não duplicar)
      if (!isWithinReminder) {
        notifications.push({
          id: notificationId,
          eventId: event.id,
          eventTitle: event.title,
          eventColor: event.color,
          message: `Evento hoje: "${event.title}" às ${event.startTime}`,
          type: 'today',
          eventDate: event.startDate,
          eventTime: event.startTime,
          createdAt: now,
        });
      }
    }
    
    // Notificação de evento amanhã
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = eventDate.getTime() === tomorrow.getTime();
    
    if (isTomorrow) {
      const notificationId = `upcoming-${event.id}-${event.startDate.toISOString().split('T')[0]}`;
      notifications.push({
        id: notificationId,
        eventId: event.id,
        eventTitle: event.title,
        eventColor: event.color,
        message: `Amanhã: "${event.title}" às ${event.startTime}`,
        type: 'upcoming',
        eventDate: event.startDate,
        eventTime: event.startTime,
        createdAt: now,
      });
    }
  });
  
  // Ordenar por data/hora do evento
  notifications.sort((a, b) => {
    const dateA = new Date(a.eventDate);
    dateA.setHours(...a.eventTime.split(':').map(Number) as [number, number]);
    const dateB = new Date(b.eventDate);
    dateB.setHours(...b.eventTime.split(':').map(Number) as [number, number]);
    return dateA.getTime() - dateB.getTime();
  });
  
  return notifications;
}

// Filtrar notificações não dispensadas (para o banner do Dashboard)
export function getActiveNotifications(events: Event[]): Notification[] {
  const allNotifications = generateNotifications(events);
  const dismissed = getDismissedNotifications();
  
  return allNotifications.filter((n) => !dismissed.includes(n.id));
}

