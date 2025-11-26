import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar as CalendarIcon, Plus, TrendingUp, Clock, Calendar as CalendarDayIcon, Home, ChevronRight } from 'lucide-react';
import { CalendarView, Event } from '../lib/types';
import { CalendarViewComponent } from './CalendarView';
import { EventDialog } from './EventDialog';
import { motion } from 'motion/react';

interface DashboardProps {
  events: Event[];
  onEventUpdate: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
  onCreateEvent: () => void;
}

export function Dashboard({ events, onEventUpdate, onEventDelete, onCreateEvent }: DashboardProps) {
  const [view, setView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEvents = events.filter(
    (event) => event.startDate.toDateString() === today.toDateString()
  );

  const upcomingEvents = events
    .filter((event) => event.startDate >= today)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 5);

  const weekEvents = events.filter((e) => {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return e.startDate >= weekStart && e.startDate <= weekEnd;
  });

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto h-full">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center gap-2 text-sm text-gray-500"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Home className="size-4" />
          <ChevronRight className="size-3" />
          <span className="text-gray-900 font-medium">Dashboard</span>
        </motion.nav>

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
                Seu Dia
              </h1>
              <motion.span
                className="text-lg sm:text-2xl"
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: isMobile ? 'short' : 'long', 
                day: 'numeric', 
                month: isMobile ? 'short' : 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button
              onClick={onCreateEvent}
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="size-4 sm:size-5" />
              <span className="sm:inline">Criar Evento</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-3 gap-2 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-0.5 sm:mt-1">{events.length}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg self-end sm:self-auto">
                <CalendarIcon className="size-4 sm:size-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Hoje</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-0.5 sm:mt-1">{todayEvents.length}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg self-end sm:self-auto">
                <CalendarDayIcon className="size-4 sm:size-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Semana</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-0.5 sm:mt-1">{weekEvents.length}</p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg self-end sm:self-auto">
                <TrendingUp className="size-4 sm:size-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          className="flex items-center gap-1 sm:gap-2 bg-white p-1 sm:p-1.5 rounded-xl border border-gray-200 w-full sm:w-fit shadow-sm overflow-x-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {(['day', 'week', 'month'] as const).map((viewType) => (
            <motion.div key={viewType} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
              <Button
                variant={view === viewType ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(viewType)}
                className={`w-full sm:w-auto text-xs sm:text-sm ${view === viewType ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}`}
              >
                {viewType === 'day' ? 'Dia' : viewType === 'week' ? 'Semana' : 'Mês'}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Calendar */}
          <motion.div
            className="lg:col-span-3 order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CalendarViewComponent
              events={events}
              view={view}
              onEventClick={handleEventClick}
            />
          </motion.div>

          {/* Sidebar - No mobile aparece primeiro */}
          <motion.div
            className="space-y-3 sm:space-y-4 order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Eventos de Hoje */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all">
              <h3 className="text-sm sm:text-base text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 font-medium">
                <Clock className="size-4 sm:size-5 text-blue-600" />
                Hoje
              </h3>
              {todayEvents.length > 0 ? (
                <div className="space-y-2">
                  {todayEvents.slice(0, isMobile ? 2 : todayEvents.length).map((event, index) => (
                    <motion.button
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="size-2.5 sm:size-3 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: event.color }} />
                        <span className="text-xs sm:text-sm truncate">{event.title}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="size-3" />
                        {event.startTime} - {event.endTime}
                      </p>
                    </motion.button>
                  ))}
                  {isMobile && todayEvents.length > 2 && (
                    <p className="text-xs text-center text-gray-500">+{todayEvents.length - 2} mais eventos</p>
                  )}
                </div>
              ) : (
                <motion.div
                  className="text-center py-4 sm:py-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-2xl sm:text-4xl mb-2">🎯</div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Nenhum evento hoje</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Vá em frente e crie um!</p>
                </motion.div>
              )}
            </div>

            {/* Próximos Eventos - Escondido no mobile pequeno */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all hidden sm:block">
              <h3 className="text-sm sm:text-base text-gray-900 mb-3 sm:mb-4 font-medium">Próximos Eventos</h3>
              <div className="space-y-2 sm:space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="size-2.5 sm:size-3 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: event.color }} />
                      <span className="text-xs sm:text-sm truncate">{event.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        {event.startDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} • {event.startTime}
                      </p>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                        {event.priority === 'high' ? '🔴' : event.priority === 'medium' ? '🟡' : '🟢'}
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <EventDialog
        event={selectedEvent}
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={onEventUpdate}
        onDelete={onEventDelete}
      />
    </div>
  );
}