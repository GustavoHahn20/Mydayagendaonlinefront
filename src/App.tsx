import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CreateEventPage } from './components/CreateEventPage';
import { SearchEventsPage } from './components/SearchEventsPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { EventDialog } from './components/EventDialog';
import { Event } from './lib/types';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  authApi, 
  eventsApi, 
  userApi,
  apiEventToLocal, 
  localEventToApi,
  AuthResponse 
} from './lib/api';
import { User } from './lib/types';
import { Loader2 } from 'lucide-react';
import { clearDismissedNotifications } from './lib/notifications';

type Page = 'dashboard' | 'create' | 'search' | 'notifications' | 'profile' | 'settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  // Carregar eventos quando logado
  useEffect(() => {
    if (isLoggedIn) {
      loadEvents();
    }
  }, [isLoggedIn]);

  const checkAuth = async () => {
    try {
      if (authApi.isAuthenticated()) {
        const result = await authApi.validate();
        if (result.valid && result.user) {
          // Limpar notificações dispensadas para que apareçam novamente ao logar
          clearDismissedNotifications();
          
          setUser(result.user as User);
          setIsLoggedIn(true);
        } else {
          // Token inválido, fazer logout
          authApi.logout();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      authApi.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const apiEvents = await eventsApi.getAll();
      const localEvents = apiEvents.map(apiEventToLocal);
      setEvents(localEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Erro ao carregar eventos', {
        description: 'Não foi possível carregar seus eventos. Tente novamente.',
      });
    }
  };

  const handleLogin = (userData: AuthResponse['user']) => {
    // Limpar notificações dispensadas para que apareçam novamente ao logar
    clearDismissedNotifications();
    
    setUser(userData as User);
    setIsLoggedIn(true);
    toast.success('Bem-vindo ao MyDay!', {
      description: `Olá, ${userData.name}! Vá em frente e organize seu dia com estilo.`,
    });
  };

  const handleLogout = () => {
    authApi.logout();
    setIsLoggedIn(false);
    setUser(null);
    setEvents([]);
    setCurrentPage('dashboard');
    toast.info('Até logo!', {
      description: 'Volte sempre ao MyDay para organizar seus dias.',
    });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleCreateEvent = async (newEventData: Omit<Event, 'id'>) => {
    try {
      const apiData = localEventToApi({ ...newEventData, id: '' } as Event);
      const createdEvent = await eventsApi.create(apiData);
      const localEvent = apiEventToLocal(createdEvent);
      
      setEvents([...events, localEvent]);
      setCurrentPage('dashboard');
      toast.success('Evento criado com sucesso!', {
        description: `"${localEvent.title}" foi adicionado à sua agenda.`,
      });
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error('Erro ao criar evento', {
        description: error.message || 'Não foi possível criar o evento. Tente novamente.',
      });
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      const apiData = localEventToApi(updatedEvent);
      await eventsApi.update(updatedEvent.id, apiData);
      
      setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
      toast.success('Evento atualizado!', {
        description: 'As alterações foram salvas.',
      });
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error('Erro ao atualizar evento', {
        description: error.message || 'Não foi possível atualizar o evento. Tente novamente.',
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const event = events.find((e) => e.id === eventId);
      await eventsApi.delete(eventId);
      
      setEvents(events.filter((e) => e.id !== eventId));
      toast.success('Evento excluído!', {
        description: event ? `"${event.title}" foi removido da sua agenda.` : undefined,
      });
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error('Erro ao excluir evento', {
        description: error.message || 'Não foi possível excluir o evento. Tente novamente.',
      });
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const result = await userApi.updateProfile({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      });
      
      setUser(result as User);
      // Atualizar no localStorage também
      localStorage.setItem('user', JSON.stringify(result));
      
      toast.success('Perfil atualizado!', {
        description: 'Suas informações foram salvas com sucesso.',
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar perfil', {
        description: error.message || 'Não foi possível atualizar seu perfil. Tente novamente.',
      });
    }
  };

  const handleUpdateSettings = (settings: any) => {
    console.log('Settings updated:', settings);
    toast.success('Configurações salvas!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-5 shadow-2xl">
            <Loader2 className="size-10 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Carregando MyDay...</p>
        </motion.div>
      </div>
    );
  }

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
            className="flex-1 min-h-0 flex flex-col overflow-hidden pt-18 pb-40 lg:pt-0 lg:pb-0"
          >
            {currentPage === 'dashboard' && (
              <Dashboard
                events={events}
                onEventUpdate={handleUpdateEvent}
                onEventDelete={handleDeleteEvent}
                onCreateEvent={() => setCurrentPage('create')}
                onNavigateToNotifications={() => setCurrentPage('notifications')}
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

            {currentPage === 'notifications' && (
              <NotificationsPage
                events={events}
                onEventClick={handleEventClick}
              />
            )}

            {currentPage === 'profile' && user && (
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
