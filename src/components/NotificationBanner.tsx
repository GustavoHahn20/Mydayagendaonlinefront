import { useState, useEffect } from 'react';
import { X, Bell, Clock, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Event } from '../lib/types';
import { 
  Notification, 
  getActiveNotifications, 
  dismissNotification 
} from '../lib/notifications';

interface NotificationBannerProps {
  events: Event[];
  onViewAll: () => void;
  onEventClick?: (eventId: string) => void;
}

export function NotificationBanner({ events, onViewAll, onEventClick }: NotificationBannerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Atualizar notificações quando os eventos mudarem
  useEffect(() => {
    const activeNotifications = getActiveNotifications(events);
    setNotifications(activeNotifications);
    setCurrentIndex(0);
  }, [events]);

  // Atualizar notificações a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const activeNotifications = getActiveNotifications(events);
      setNotifications(activeNotifications);
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, [events]);

  const handleDismiss = (notificationId: string) => {
    dismissNotification(notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleDismissAll = () => {
    notifications.forEach((n) => dismissNotification(n.id));
    setNotifications([]);
  };

  if (notifications.length === 0) {
    return null;
  }

  const currentNotification = notifications[currentIndex];
  const hasMultiple = notifications.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? notifications.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === notifications.length - 1 ? 0 : prev + 1));
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return <Bell className="size-4" />;
      case 'today':
        return <Clock className="size-4" />;
      case 'upcoming':
        return <Calendar className="size-4" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'from-orange-500 to-amber-500';
      case 'today':
        return 'from-blue-500 to-indigo-500';
      case 'upcoming':
        return 'from-purple-500 to-pink-500';
    }
  };

  const getTypeBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'bg-orange-50 border-orange-200';
      case 'today':
        return 'bg-blue-50 border-blue-200';
      case 'upcoming':
        return 'bg-purple-50 border-purple-200';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`rounded-xl border p-3 sm:p-4 mb-4 ${getTypeBgColor(currentNotification.type)}`}
      >
        <div className="flex items-start gap-3">
          {/* Ícone com cor do tipo */}
          <div className={`p-2 rounded-lg bg-gradient-to-br ${getTypeColor(currentNotification.type)} text-white flex-shrink-0`}>
            {getTypeIcon(currentNotification.type)}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="size-2.5 rounded-full flex-shrink-0" 
                style={{ backgroundColor: currentNotification.eventColor }} 
              />
              <span className="text-sm font-medium text-gray-900 truncate">
                {currentNotification.eventTitle}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              {currentNotification.message}
            </p>
            
            {/* Navegação entre notificações */}
            {hasMultiple && (
              <div className="flex items-center gap-3 mt-3">
                {/* Botão Anterior */}
                <motion.button
                  onClick={goToPrevious}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/60 hover:bg-white border border-gray-200 text-gray-600 hover:text-gray-900 transition-all text-xs font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronLeft className="size-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </motion.button>

                {/* Indicador de posição */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {notifications.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`rounded-full transition-all ${
                          idx === currentIndex 
                            ? 'bg-gray-700 w-4 h-2' 
                            : 'bg-gray-300 hover:bg-gray-400 size-2'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {currentIndex + 1}/{notifications.length}
                  </span>
                </div>

                {/* Botão Próximo */}
                <motion.button
                  onClick={goToNext}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/60 hover:bg-white border border-gray-200 text-gray-600 hover:text-gray-900 transition-all text-xs font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="hidden sm:inline">Próximo</span>
                  <ChevronRight className="size-4" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Ver todas */}
            <motion.button
              onClick={onViewAll}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-500 hover:text-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Ver todas as notificações"
            >
              <ChevronRight className="size-4" />
            </motion.button>

            {/* Dispensar */}
            <motion.button
              onClick={() => handleDismiss(currentNotification.id)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-500 hover:text-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Dispensar notificação"
            >
              <X className="size-4" />
            </motion.button>
          </div>
        </div>

        {/* Botão para dispensar todas */}
        {hasMultiple && (
          <div className="mt-3 pt-3 border-t border-gray-200/50 flex justify-end">
            <button
              onClick={handleDismissAll}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Dispensar todas ({notifications.length})
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

