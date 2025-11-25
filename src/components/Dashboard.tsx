import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar as CalendarIcon, Plus, TrendingUp, Clock, Calendar as CalendarDayIcon } from 'lucide-react';
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

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  const todayEvents = events.filter(
    (event) => event.startDate.toDateString() === new Date(2025, 10, 21).toDateString()
  );

  const upcomingEvents = events
    .filter((event) => event.startDate >= new Date(2025, 10, 21))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 5);

  const weekEvents = events.filter((e) => {
    const weekStart = new Date(2025, 10, 21);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return e.startDate >= weekStart && e.startDate <= weekEnd;
  });

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6 lg:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Seu Dia
              </h1>
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </div>
            <p className="text-gray-600">
              {new Date(2025, 10, 21).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onCreateEvent}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="size-5" />
              Criar Evento
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Eventos</p>
                <p className="text-gray-900 mt-1">{events.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CalendarIcon className="size-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoje</p>
                <p className="text-gray-900 mt-1">{todayEvents.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CalendarDayIcon className="size-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Esta Semana</p>
                <p className="text-gray-900 mt-1">{weekEvents.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 w-fit shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {(['day', 'week', 'month'] as const).map((viewType) => (
            <motion.div key={viewType} whileTap={{ scale: 0.95 }}>
              <Button
                variant={view === viewType ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(viewType)}
                className={view === viewType ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}
              >
                {viewType === 'day' ? 'Dia' : viewType === 'week' ? 'Semana' : 'Mês'}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <motion.div
            className="lg:col-span-3"
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

          {/* Sidebar */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Eventos de Hoje */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="size-5 text-blue-600" />
                Hoje
              </h3>
              {todayEvents.length > 0 ? (
                <div className="space-y-2">
                  {todayEvents.map((event, index) => (
                    <motion.button
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="size-3 rounded-full shadow-sm"
                          style={{ backgroundColor: event.color }}
                        />
                        <span className="text-sm">{event.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="size-3" />
                        {event.startTime} - {event.endTime}
                      </p>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-sm text-gray-600 mb-1">Nenhum evento hoje</p>
                  <p className="text-xs text-gray-500">Vá em frente e crie um!</p>
                </motion.div>
              )}
            </div>

            {/* Próximos Eventos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all">
              <h3 className="text-gray-900 mb-4">Próximos Eventos</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="size-3 rounded-full shadow-sm"
                        style={{ backgroundColor: event.color }}
                      />
                      <span className="text-sm">{event.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-600">
                        {event.startDate.toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        • {event.startTime}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {event.priority === 'high' ? '🔴 Alta' : event.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
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