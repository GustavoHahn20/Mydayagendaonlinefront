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
}

export function CalendarViewComponent({ events, view, onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date()); // Data atual do sistema
  const [isMobile, setIsMobile] = useState(false);

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
        {view === 'month' && <MonthView events={events} currentDate={currentDate} onEventClick={onEventClick} isMobile={isMobile} />}
        {view === 'week' && <WeekView events={events} currentDate={currentDate} onEventClick={onEventClick} isMobile={isMobile} />}
        {view === 'day' && <DayView events={events} currentDate={currentDate} onEventClick={onEventClick} />}
      </div>
    </motion.div>
  );
}

function MonthView({ events, currentDate, onEventClick, isMobile }: { events: Event[], currentDate: Date, onEventClick: (event: Event) => void, isMobile: boolean }) {
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

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className={`min-h-[60px] sm:min-h-24 p-1 sm:p-2 border rounded-lg transition-all ${
                isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50'
              } ${isToday ? 'border-blue-500 border-2 shadow-sm' : 'border-gray-200'}`}
            >
              <div className={`text-xs sm:text-sm mb-0.5 sm:mb-1 font-medium ${isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                {day.getDate()}
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                {isMobile ? (
                  <div className="flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <button key={event.id} onClick={() => onEventClick(event)} className="size-2 rounded-full hover:scale-125 transition-transform" style={{ backgroundColor: event.color }} title={event.title} />
                    ))}
                    {dayEvents.length > 3 && <span className="text-[8px] text-gray-500">+{dayEvents.length - 3}</span>}
                  </div>
                ) : (
                  <>
                    {dayEvents.slice(0, 2).map((event) => (
                      <button key={event.id} onClick={() => onEventClick(event)} className="w-full text-left text-[10px] sm:text-xs p-0.5 sm:p-1 rounded truncate hover:opacity-80 transition-opacity" style={{ backgroundColor: event.color, color: 'white' }}>
                        <span className="hidden sm:inline">{event.startTime} </span>{event.title}
                      </button>
                    ))}
                    {dayEvents.length > 2 && <div className="text-[10px] sm:text-xs text-gray-500">+{dayEvents.length - 2} mais</div>}
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

function WeekView({ events, currentDate, onEventClick, isMobile }: { events: Event[], currentDate: Date, onEventClick: (event: Event) => void, isMobile: boolean }) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  // No mobile, mostrar apenas horários de trabalho (7h-20h)
  const hours = isMobile ? Array.from({ length: 14 }, (_, i) => i + 7) : Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <div className={`grid gap-1 sm:gap-2 ${isMobile ? 'grid-cols-8 min-w-[500px]' : 'grid-cols-8 min-w-[800px]'}`}>
        <div className="text-xs sm:text-sm text-gray-600 sticky left-0 bg-white z-10"></div>
        {weekDays.map((day) => {
          const isToday = day.toDateString() === new Date().toDateString();
          return (
            <div key={day.toISOString()} className="text-center">
              <div className={`text-[10px] sm:text-sm ${isToday ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                {isMobile ? day.toLocaleDateString('pt-BR', { weekday: 'narrow' }) : day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className={`text-xs sm:text-base ${isToday ? 'text-blue-600 font-bold bg-blue-100 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mx-auto' : 'text-gray-900'}`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}

        {hours.map((hour) => (
          <React.Fragment key={`hour-row-${hour}`}>
            <div className="text-[10px] sm:text-sm text-gray-600 py-4 sm:py-8 border-t sticky left-0 bg-white z-10">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {weekDays.map((day) => {
              const dayEvents = events.filter((event) => {
                if (event.startDate.toDateString() !== day.toDateString()) return false;
                const eventHour = parseInt(event.startTime.split(':')[0]);
                return eventHour === hour;
              });

              return (
                <div key={`${day.toISOString()}-${hour}`} className="border-t border-gray-200 py-0.5 sm:py-1 min-h-10 sm:min-h-16">
                  {dayEvents.map((event) => (
                    <button key={event.id} onClick={() => onEventClick(event)} className="w-full text-left text-[9px] sm:text-xs p-1 sm:p-2 rounded mb-0.5 sm:mb-1 hover:opacity-80 transition-opacity" style={{ backgroundColor: event.color, color: 'white' }}>
                      <div className="truncate">{event.title}</div>
                      {!isMobile && <div className="opacity-90">{event.startTime} - {event.endTime}</div>}
                    </button>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function DayView({ events, currentDate, onEventClick }: { events: Event[], currentDate: Date, onEventClick: (event: Event) => void }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter(
    (event) => event.startDate.toDateString() === currentDate.toDateString()
  );

  return (
    <div className="space-y-2">
      {hours.map((hour) => {
        const hourEvents = dayEvents.filter((event) => {
          const eventHour = parseInt(event.startTime.split(':')[0]);
          return eventHour === hour;
        });

        return (
          <div key={hour} className="flex gap-4 border-t border-gray-200 py-2">
            <div className="w-20 text-sm text-gray-600">
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div className="flex-1 space-y-2">
              {hourEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="w-full text-left p-3 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: event.color, color: 'white' }}
                >
                  <div>{event.title}</div>
                  <div className="text-sm opacity-90">
                    {event.startTime} - {event.endTime}
                  </div>
                  {event.location && (
                    <div className="text-sm opacity-90 mt-1">{event.location}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}