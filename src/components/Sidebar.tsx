import { Calendar, Plus, Search, Settings, User, LogOut, Menu, X, Home, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fechar sidebar ao mudar de página no mobile
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [currentPage, isMobile]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, shortLabel: 'Início' },
    { id: 'create', label: 'Criar Evento', icon: Plus, shortLabel: 'Criar' },
    { id: 'search', label: 'Buscar Eventos', icon: Search, shortLabel: 'Buscar' },
    { id: 'profile', label: 'Perfil', icon: User, shortLabel: 'Perfil' },
    { id: 'settings', label: 'Configurações', icon: Settings, shortLabel: 'Config' },
  ];

  // Itens principais para a navegação inferior mobile
  const mobileNavItems = menuItems.slice(0, 4);

  const SidebarContent = ({ showCloseButton = false }: { showCloseButton?: boolean }) => (
    <>
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-2 sm:p-2.5 shadow-lg relative">
            <Calendar className="size-5 sm:size-6 text-white" />
            <div className="absolute -top-1 -right-1 size-2.5 sm:size-3 bg-yellow-400 rounded-full animate-pulse" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1"
            >
              <h2 className="text-lg sm:text-xl text-gray-900 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
                MyDay
              </h2>
              <p className="text-xs text-indigo-600">Vá em frente!</p>
            </motion.div>
          )}
          {showCloseButton && (
            <motion.button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <X className="size-5 text-gray-600" />
            </motion.button>
          )}
        </motion.div>
      </div>

      <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileOpen(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all ${ 
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm'
                }`}
              >
                <Icon className="size-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate text-sm sm:text-base">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <motion.div
                    className="ml-auto size-2 bg-white rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      <div className="p-3 sm:p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all text-sm sm:text-base"
          onClick={onLogout}
        >
          <LogOut className="size-5 flex-shrink-0" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header - Botão de menu hamburguer */}
      <motion.div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
      >
        <motion.button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="size-6 text-gray-700" />
        </motion.button>
        
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-1.5 shadow-md">
            <Calendar className="size-5 text-white" />
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MyDay
          </span>
        </div>

        <div className="w-10" /> {/* Spacer para centralizar o logo */}
      </motion.div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-white border-r border-gray-200 flex flex-col z-50 shadow-2xl"
          >
            <SidebarContent showCloseButton={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-2 safe-area-pb"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[60px] transition-all ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-indigo-100' : ''
                }`}>
                  <Icon className="size-5" />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {item.shortLabel}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
          
          {/* Botão de mais opções */}
          <motion.button
            onClick={() => setIsMobileOpen(true)}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[60px] text-gray-500 hover:text-gray-700 transition-all"
          >
            <div className="p-1.5 rounded-lg">
              <Menu className="size-5" />
            </div>
            <span className="text-[10px] font-medium">Mais</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0, width: isCollapsed ? '80px' : '256px' }}
        transition={{ type: 'spring', damping: 25 }}
        className="hidden lg:flex bg-white border-r border-gray-200 flex-col h-screen shadow-sm relative"
      >
        <SidebarContent />
        
        {/* Botão de colapsar sidebar */}
        {onToggleCollapse && (
          <motion.button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className={`size-4 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </motion.button>
        )}
      </motion.div>
    </>
  );
}