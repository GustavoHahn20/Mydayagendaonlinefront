import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Event, CalendarView } from '../lib/types';
import { motion } from 'motion/react';
import React from 'react';

interface CalendarViewProps {
  events: Event[];
  view: CalendarView;
  onEventClick: (event: Event) => void;
}

export function CalendarViewComponent({ events, view, onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 21)); // 21 de novembro de 2025

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
      
      return `${startOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date(2025, 10, 21));
  };

  return (
    <motion.div
      className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-4">
          <motion.h2
            className="text-gray-900 capitalize"
            key={getDateTitle()}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {getDateTitle()}
          </motion.h2>
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" onClick={goToToday} className="shadow-sm">
              Hoje
            </Button>
          </motion.div>
          <div className="flex items-center gap-1">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')} className="shadow-sm">
                <ChevronLeft className="size-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')} className="shadow-sm">
                <ChevronRight className="size-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        {view === 'month' && <MonthView events={events} currentDate={currentDate} onEventClick={onEventClick} />}
        {view === 'week' && <WeekView events={events} currentDate={currentDate} onEventClick={onEventClick} />}
        {view === 'day' && <DayView events={events} currentDate={currentDate} onEventClick={onEventClick} />}
      </div>
    </motion.div>
  );
}

function MonthView({ events, currentDate, onEventClick }: { events: Event[], currentDate: Date, onEventClick: (event: Event) => void }) {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const days = [];
  const currentDay = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center p-2 text-sm text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date(2025, 10, 21).toDateString();
          const dayEvents = events.filter(
            (event) => event.startDate.toDateString() === day.toDateString()
          );

          return (
            <div
              key={index}
              className={`min-h-24 p-2 border rounded-lg ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}`}
            >
              <div className={`text-sm mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left text-xs p-1 rounded truncate hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: event.color, color: 'white' }}
                  >
                    {event.startTime} {event.title}
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 2} mais</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ events, currentDate, onEventClick }: { events: Event[], currentDate: Date, onEventClick: (event: Event) => void }) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-8 gap-2 min-w-[800px]">
        <div className="text-sm text-gray-600"></div>
        {weekDays.map((day) => {
          const isToday = day.toDateString() === new Date(2025, 10, 21).toDateString();
          return (
            <div key={day.toISOString()} className="text-center">
              <div className={`text-sm ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className={`${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}

        {hours.map((hour) => (
          <React.Fragment key={`hour-row-${hour}`}>
            <div className="text-sm text-gray-600 py-8 border-t">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {weekDays.map((day) => {
              const dayEvents = events.filter((event) => {
                if (event.startDate.toDateString() !== day.toDateString()) return false;
                const eventHour = parseInt(event.startTime.split(':')[0]);
                return eventHour === hour;
              });

              return (
                <div key={`${day.toISOString()}-${hour}`} className="border-t border-gray-200 py-1 min-h-16">
                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left text-xs p-2 rounded mb-1 hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: event.color, color: 'white' }}
                    >
                      <div>{event.title}</div>
                      <div className="opacity-90">
                        {event.startTime} - {event.endTime}
                      </div>
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