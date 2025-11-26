import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CreateEventPage } from './components/CreateEventPage';
import { SearchEventsPage } from './components/SearchEventsPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { EventDialog } from './components/EventDialog';
import { Event } from './lib/types';
import { mockEvents, mockUser } from './lib/mock-data';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

type Page = 'dashboard' | 'create' | 'search' | 'profile' | 'settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [user, setUser] = useState(mockUser);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast.success('Bem-vindo ao MyDay!', {
      description: 'Vá em frente e organize seu dia com estilo.',
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    toast.info('Até logo!', {
      description: 'Volte sempre ao MyDay para organizar seus dias.',
    });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleCreateEvent = (newEventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...newEventData,
      id: String(Date.now()),
    };
    setEvents([...events, newEvent]);
    setCurrentPage('dashboard');
    toast.success('Evento criado com sucesso!', {
      description: `"${newEvent.title}" foi adicionado à sua agenda.`,
    });
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    toast.success('Evento atualizado!', {
      description: 'As alterações foram salvas.',
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    setEvents(events.filter((e) => e.id !== eventId));
    toast.success('Evento excluído!', {
      description: event ? `"${event.title}" foi removido da sua agenda.` : undefined,
    });
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleUpdateUser = (updatedUser: typeof mockUser) => {
    setUser(updatedUser);
  };

  const handleUpdateSettings = (settings: any) => {
    console.log('Settings updated:', settings);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="flex-1 min-h-0 flex flex-col overflow-hidden pt-14 pb-20 lg:pt-0 lg:pb-0"
          >
            {currentPage === 'dashboard' && (
              <Dashboard
                events={events}
                onEventUpdate={handleUpdateEvent}
                onEventDelete={handleDeleteEvent}
                onCreateEvent={() => setCurrentPage('create')}
              />
            )}

            {currentPage === 'create' && (
              <CreateEventPage
                onSave={handleCreateEvent}
                onCancel={() => setCurrentPage('dashboard')}
              />
            )}

            {currentPage === 'search' && (
              <SearchEventsPage
                events={events}
                onEventClick={handleEventClick}
              />
            )}

            {currentPage === 'profile' && (
              <ProfilePage
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {currentPage === 'settings' && (
              <SettingsPage
                onUpdateSettings={handleUpdateSettings}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Event Dialog from Search Page */}
        <EventDialog
          event={selectedEvent}
          open={isEventDialogOpen}
          onClose={() => {
            setIsEventDialogOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </>
  );
}