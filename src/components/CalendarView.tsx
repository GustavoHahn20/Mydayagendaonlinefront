import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from './ui/button';
import { Event, CalendarView } from '../lib/types';
import { motion, AnimatePresence } from 'motion/react';
import React from 'react';

interface CalendarViewProps {
  events: Event[];
  view: CalendarView;
  onEventClick: (event: Event) => void;
  onViewChange?: (view: CalendarView) => void;
}

export function CalendarViewComponent({ events, view, onEventClick, onViewChange }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date()); // Data atual do sistema
  const [isMobile, setIsMobile] = useState(false);

  // Função para navegar para a visualização de dia em uma data específica
  const navigateToDay = (date: Date) => {
    setCurrentDate(date);
    if (onViewChange) {
      onViewChange('day');
    }
  };

  // Detectar tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  const getDateTitle = () => {
    if (view === 'day') {
      if (isMobile) {
        return currentDate.toLocaleDateString('pt-BR', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        });
      }
      return currentDate.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (isMobile) {
        return `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} - ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}`;
      }
      return `${startOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      if (isMobile) {
        return currentDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      }
      return currentDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <motion.div
      className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CalendarDays className="size-5 text-indigo-600 hidden sm:block" />
          <AnimatePresence mode="wait">
            <motion.h2
              className="text-sm sm:text-base lg:text-lg text-gray-900 capitalize font-medium truncate"
              key={getDateTitle()}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {getDateTitle()}
            </motion.h2>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" onClick={goToToday} className="shadow-sm text-xs sm:text-sm">
              Hoje
            </Button>
          </motion.div>
          <div className="flex items-center gap-1">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')} className="shadow-sm p-2 sm:px-3">
                <ChevronLeft className="size-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')} className="shadow-sm p-2 sm:px-3">
                <ChevronRight className="size-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-2 sm:p-4 overflow-x-auto">
        {view === 'month' && <MonthView events={events} currentDate={currentDate} onEventClick={onEventClick} isMobile={isMobile} onDayClick={navigateToDay} />}
        {view === 'week' && <WeekView events={events} currentDate={currentDate} onEventClick={onEventClick} isMobile={isMobile} />}
        {view === 'day' && <DayView events={events} currentDate={currentDate} onEventClick={onEventClick} />}
      </div>
    </motion.div>
  );
}

function MonthView({ events, currentDate, onEventClick, isMobile, onDayClick }: { events: Event[], currentDate: Date, onEventClick: (event: Event) => void, isMobile: boolean, onDayClick: (date: Date) => void }) {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const days = [];
  const currentDay = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  const weekDays = isMobile ? ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-1 sm:space-y-2">
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map((day, idx) => (
          <div key={idx} className="text-center p-1 sm:p-2 text-[10px] sm:text-sm text-gray-600 font-medium">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const dayEvents = events.filter((event) => event.startDate.toDateString() === day.toDateString());
          const hasMoreEvents = dayEvents.length > (isMobile ? 3 : 2);

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              onClick={() => onDayClick(day)}
              className={`min-h-[60px] sm:min-h-24 p-1 sm:p-2 border rounded-lg transition-all cursor-pointer ${
                isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/50'
              } ${isToday ? 'border-blue-500 border-2 shadow-sm' : 'border-gray-200 hover:border-indigo-300'}`}
            >
              <div className={`text-xs sm:text-sm mb-0.5 sm:mb-1 font-medium ${isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                {day.getDate()}
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                {isMobile ? (
                  <div className="flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <button 
                        key={event.id} 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }} 
                        className="size-2 rounded-full hover:scale-125 transition-transform" 
                        style={{ backgroundColor: event.color }} 
                        title={event.title} 
                      />
                    ))}
                    {hasMoreEvents && (
                      <span 
                        className="text-[8px] text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer"
                        title="Clique para ver todos os eventos"
                      >
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    {dayEvents.slice(0, 2).map((event) => (
                      <button 
                        key={event.id} 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }} 
                        className="w-full text-left text-[10px] sm:text-xs p-0.5 sm:p-1 rounded truncate hover:opacity-80 transition-opacity" 
                        style={{ backgroundColor: event.color, color: 'white' }}
                      >
                        <span className="hidden sm:inline">{event.startTime} </span>{event.title}
                      </button>
                    ))}
                    {hasMoreEvents && (
                      <div 
                        className="text-[10px] sm:text-xs text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer"
                        title="Clique para ver todos os eventos"
                      >
                        +{dayEvents.length - 2} mais
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Helper para calcular duração do evento em horas
function getEventDuration(startTime: string, endTime?: string): number {
  if (!endTime) return 1; // Duração padrão de 1 hora se não tiver horário de término
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return (endMinutes - startMinutes) / 60;
}

// Helper para calcular offset do evento (minutos após a hora cheia)
function getEventOffset(startTime: string): number {
  const [, startMin] = startTime.split(':').map(Number);
  return startMin / 60;
}

// Helper para converter horário em minutos desde meia-noite
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Interface para evento com informações de layout
interface EventWithLayout extends Event {
  column: number;
  totalColumns: number;
}

// Função para verificar se dois eventos se sobrepõem
function eventsOverlap(event1: Event, event2: Event): boolean {
  const start1 = timeToMinutes(event1.startTime);
  const end1 = event1.endTime ? timeToMinutes(event1.endTime) : start1 + 60; // Assume 1 hora se não tiver término
  const start2 = timeToMinutes(event2.startTime);
  const end2 = event2.endTime ? timeToMinutes(event2.endTime) : start2 + 60; // Assume 1 hora se não tiver término
  
  // Eventos se sobrepõem se um começa antes do outro terminar
  return start1 < end2 && start2 < end1;
}

// Função para calcular o layout dos eventos (posição lado a lado)
function calculateEventsLayout(events: Event[]): EventWithLayout[] {
  if (events.length === 0) return [];
  
  // Ordenar eventos por horário de início
  const sortedEvents = [...events].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );
  
  // Array para armazenar grupos de eventos que se sobrepõem
  const columns: Event[][] = [];
  
  // Para cada evento, encontrar a primeira coluna disponível
  const eventLayouts: EventWithLayout[] = sortedEvents.map(event => {
    // Encontrar a primeira coluna onde o evento não se sobrepõe com nenhum outro
    let columnIndex = 0;
    let foundColumn = false;
    
    while (!foundColumn) {
      if (!columns[columnIndex]) {
        columns[columnIndex] = [];
      }
      
      // Verificar se o evento se sobrepõe com algum evento nesta coluna
      const hasOverlap = columns[columnIndex].some(existingEvent => 
        eventsOverlap(event, existingEvent)
      );
      
      if (!hasOverlap) {
        columns[columnIndex].push(event);
        foundColumn = true;
      } else {
        columnIndex++;
      }
    }
    
    return {
      ...event,
      column: columnIndex,
      totalColumns: 1 // Será atualizado depois
    };
  });
  
  // Calcular o número total de colunas para cada grupo de eventos sobrepostos
  eventLayouts.forEach(event => {
    // Encontrar todos os eventos que se sobrepõem com este
    const overlappingEvents = eventLayouts.filter(other => 
      eventsOverlap(event, other)
    );
    
    // O total de colunas é o máximo índice de coluna + 1 entre os eventos sobrepostos
    const maxColumn = Math.max(...overlappingEvents.map(e => e.column));
    
    // Atualizar o totalColumns para todos os eventos sobrepostos
    overlappingEvents.forEach(e => {
      e.totalColumns = Math.max(e.totalColumns, maxColumn + 1);
    });
  });
  
  return eventLayouts;
}

function WeekView({ events, currentDate, onEventClick, isMobile }: { events: Event[], currentDate: Date, onEventClick: (event: Event) => void, isMobile: boolean }) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  // Mostrar horários do dia completo (0h-24h) em todas as telas
  const startHour = 0;
  const endHour = 24;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => i + startHour);
  const hourHeight = isMobile ? 40 : 64; // altura em pixels por hora

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <div className={`grid ${isMobile ? 'grid-cols-8 min-w-[500px]' : 'grid-cols-8 min-w-[800px]'}`}>
        {/* Header com dias da semana */}
        <div className="text-xs sm:text-sm text-gray-600 sticky left-0 bg-white z-10 border-b border-gray-200 pb-2"></div>
        {weekDays.map((day) => {
          const isToday = day.toDateString() === new Date().toDateString();
          return (
            <div key={day.toISOString()} className="text-center border-b border-gray-200 pb-2">
              <div className={`text-[10px] sm:text-sm ${isToday ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                {isMobile ? day.toLocaleDateString('pt-BR', { weekday: 'narrow' }) : day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className={`text-xs sm:text-base ${isToday ? 'text-blue-600 font-bold bg-blue-100 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mx-auto' : 'text-gray-900'}`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}

        {/* Coluna de horas */}
        <div className="sticky left-0 bg-white z-10">
          {hours.map((hour) => (
            <div 
              key={`hour-label-${hour}`} 
              className="text-[10px] sm:text-sm text-gray-600 border-t border-gray-100 pr-2 text-right"
              style={{ height: `${hourHeight}px` }}
            >
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Colunas dos dias com eventos */}
        {weekDays.map((day) => {
          const dayEvents = events.filter((event) => event.startDate.toDateString() === day.toDateString());
          const eventsWithLayout = calculateEventsLayout(dayEvents);
          
          return (
            <div key={day.toISOString()} className="relative border-l border-gray-200">
              {/* Linhas de grade das horas */}
              {hours.map((hour) => (
                <div 
                  key={`grid-${day.toISOString()}-${hour}`}
                  className="border-t border-gray-100"
                  style={{ height: `${hourHeight}px` }}
                />
              ))}
              
              {/* Eventos posicionados absolutamente */}
              {eventsWithLayout.map((event) => {
                const eventStartHour = parseInt(event.startTime.split(':')[0]);
                
                // Só mostrar se o evento estiver dentro do range de horas visíveis
                if (eventStartHour < startHour || eventStartHour >= endHour) return null;
                
                const duration = getEventDuration(event.startTime, event.endTime);
                const offset = getEventOffset(event.startTime);
                const top = (eventStartHour - startHour + offset) * hourHeight;
                const height = Math.max(duration * hourHeight, hourHeight * 0.5); // mínimo de meia hora
                
                // Calcular largura e posição horizontal baseado no layout
                const columnWidth = 100 / event.totalColumns;
                const leftPosition = event.column * columnWidth;
                const gap = isMobile ? 1 : 2; // gap em pixels
                
                return (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="absolute text-left text-[9px] sm:text-xs p-1 sm:p-2 rounded overflow-hidden hover:opacity-90 transition-opacity shadow-sm z-10"
                    style={{ 
                      backgroundColor: event.color, 
                      color: 'white',
                      top: `${top}px`,
                      height: `${height - 2}px`,
                      left: `calc(${leftPosition}% + ${gap}px)`,
                      width: `calc(${columnWidth}% - ${gap * 2}px)`,
                    }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    {height > 30 && <div className="opacity-90 truncate">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</div>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayView({ events, currentDate, onEventClick }: { events: Event[], currentDate: Date, onEventClick: (event: Event) => void }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter(
    (event) => event.startDate.toDateString() === currentDate.toDateString()
  );
  const eventsWithLayout = calculateEventsLayout(dayEvents);
  const hourHeight = 64; // altura em pixels por hora

  return (
    <div className="relative">
      {/* Grade de horas */}
      <div className="flex">
        {/* Coluna de labels das horas */}
        <div className="w-20 flex-shrink-0">
          {hours.map((hour) => (
            <div 
              key={`label-${hour}`} 
              className="text-sm text-gray-600 border-t border-gray-100"
              style={{ height: `${hourHeight}px` }}
            >
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Coluna de eventos */}
        <div className="flex-1 relative border-l border-gray-200">
          {/* Linhas de grade */}
          {hours.map((hour) => (
            <div 
              key={`grid-${hour}`}
              className="border-t border-gray-100"
              style={{ height: `${hourHeight}px` }}
            />
          ))}

          {/* Eventos posicionados absolutamente */}
          {eventsWithLayout.map((event) => {
            const eventStartHour = parseInt(event.startTime.split(':')[0]);
            const eventStartMin = parseInt(event.startTime.split(':')[1] || '0');
            const duration = getEventDuration(event.startTime, event.endTime);
            const offset = eventStartMin / 60;
            const top = (eventStartHour + offset) * hourHeight;
            const height = Math.max(duration * hourHeight, hourHeight * 0.5);
            
            // Calcular largura e posição horizontal baseado no layout
            const columnWidth = 100 / event.totalColumns;
            const leftPosition = event.column * columnWidth;
            const gap = 4; // gap em pixels
            
            return (
              <button
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
                className="absolute text-left p-2 sm:p-3 rounded-lg hover:opacity-90 transition-opacity shadow-md z-10"
                style={{ 
                  backgroundColor: event.color, 
                  color: 'white',
                  top: `${top}px`,
                  height: `${height - 4}px`,
                  left: `calc(${leftPosition}% + ${gap}px)`,
                  width: `calc(${columnWidth}% - ${gap * 2}px)`,
                }}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="text-sm opacity-90 truncate">
                  {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                </div>
                {height > 80 && event.location && (
                  <div className="text-sm opacity-90 mt-1 truncate">{event.location}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}