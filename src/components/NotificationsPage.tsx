import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Bell, 
  Clock, 
  Calendar, 
  Home, 
  ChevronRight, 
  Trash2,
  CheckCheck,
  BellOff
} from 'lucide-react';
import { Event } from '../lib/types';
import { 
  Notification, 
  generateNotifications, 
  clearDismissedNotifications 
} from '../lib/notifications';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsPageProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function NotificationsPage({ events, onEventClick }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar notificações e limpar as dispensadas
  useEffect(() => {
    // Limpar notificações dispensadas quando acessar esta página
    clearDismissedNotifications();
    
    // Gerar todas as notificações
    const allNotifications = generateNotifications(events);
    setNotifications(allNotifications);
  }, [events]);

  // Atualizar notificações a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const allNotifications = generateNotifications(events);
      setNotifications(allNotifications);
    }, 60000);

    return () => clearInterval(interval);
  }, [events]);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return <Bell className="size-5" />;
      case 'today':
        return <Clock className="size-5" />;
      case 'upcoming':
        return <Calendar className="size-5" />;
    }
  };

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'Lembrete';
      case 'today':
        return 'Hoje';
      case 'upcoming':
        return 'Próximo';
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'today':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upcoming':
        return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getTypeGradient = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'from-orange-500 to-amber-500';
      case 'today':
        return 'from-blue-500 to-indigo-500';
      case 'upcoming':
        return 'from-purple-500 to-pink-500';
    }
  };

  const handleEventClick = (notification: Notification) => {
    const event = events.find((e) => e.id === notification.eventId);
    if (event) {
      onEventClick(event);
    }
  };

  // Agrupar notificações por tipo
  const reminderNotifications = notifications.filter((n) => n.type === 'reminder');
  const todayNotifications = notifications.filter((n) => n.type === 'today');
  const upcomingNotifications = notifications.filter((n) => n.type === 'upcoming');

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-5 md:p-6 overflow-auto h-full">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center gap-2 text-sm text-gray-500"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Home className="size-4" />
          <ChevronRight className="size-3" />
          <span className="text-gray-900 font-medium">Notificações</span>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="size-5 sm:size-6 text-indigo-600" />
              <h1 className="text-xl sm:text-2xl text-gray-900 font-semibold">Notificações</h1>
              {notifications.length > 0 && (
                <Badge className="bg-indigo-100 text-indigo-700">
                  {notifications.length}
                </Badge>
              )}
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Lembretes e avisos dos seus eventos
            </p>
          </div>
        </motion.div>

        {/* Lista de Notificações */}
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="bg-gray-100 rounded-full p-4 w-fit mx-auto mb-4">
                  <BellOff className="size-8 sm:size-10 text-gray-400" />
                </div>
                <h3 className="text-sm sm:text-base text-gray-900 mb-2 font-medium">
                  Nenhuma notificação
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Você não tem lembretes ou avisos de eventos no momento.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Lembretes (prioridade mais alta) */}
            {reminderNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${getTypeGradient('reminder')} text-white`}>
                    <Bell className="size-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">Lembretes Ativos</h2>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {reminderNotifications.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {reminderNotifications.map((notification, index) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      index={index}
                      onClick={() => handleEventClick(notification)}
                      getTypeColor={getTypeColor}
                      getTypeIcon={getTypeIcon}
                      getTypeLabel={getTypeLabel}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Eventos de Hoje */}
            {todayNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${getTypeGradient('today')} text-white`}>
                    <Clock className="size-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">Eventos de Hoje</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {todayNotifications.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {todayNotifications.map((notification, index) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      index={index}
                      onClick={() => handleEventClick(notification)}
                      getTypeColor={getTypeColor}
                      getTypeIcon={getTypeIcon}
                      getTypeLabel={getTypeLabel}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Eventos Amanhã */}
            {upcomingNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${getTypeGradient('upcoming')} text-white`}>
                    <Calendar className="size-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">Eventos Amanhã</h2>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {upcomingNotifications.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {upcomingNotifications.map((notification, index) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      index={index}
                      onClick={() => handleEventClick(notification)}
                      getTypeColor={getTypeColor}
                      getTypeIcon={getTypeIcon}
                      getTypeLabel={getTypeLabel}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de card de notificação individual
interface NotificationCardProps {
  notification: Notification;
  index: number;
  onClick: () => void;
  getTypeColor: (type: Notification['type']) => string;
  getTypeIcon: (type: Notification['type']) => JSX.Element;
  getTypeLabel: (type: Notification['type']) => string;
}

function NotificationCard({ 
  notification, 
  index, 
  onClick,
  getTypeColor,
  getTypeIcon,
  getTypeLabel
}: NotificationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
        onClick={onClick}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            {/* Cor do evento */}
            <div
              className="size-10 sm:size-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: notification.eventColor }}
            >
              <Calendar className="size-5 sm:size-6 text-white" />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base text-gray-900 font-medium truncate">
                    {notification.eventTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
                <Badge className={`${getTypeColor(notification.type)} text-[10px] sm:text-xs flex-shrink-0`}>
                  {getTypeLabel(notification.type)}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {notification.eventDate.toLocaleDateString('pt-BR', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {notification.eventTime}
                </div>
              </div>
            </div>

            {/* Seta */}
            <ChevronRight className="size-5 text-gray-400 flex-shrink-0 mt-3" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

