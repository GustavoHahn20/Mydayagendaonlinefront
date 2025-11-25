import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  AlertCircle,
  MapPin,
  Clock,
  X,
  Home,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { Event } from '../lib/types';
import { eventTypes, eventCategories } from '../lib/mock-data';
import { motion, AnimatePresence } from 'motion/react';

interface SearchEventsPageProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function SearchEventsPage({ events, onEventClick }: SearchEventsPageProps) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: 'all',
    category: 'all',
    priority: 'all',
    startDate: '',
    endDate: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // No desktop, mostrar filtros por padrão
      if (!mobile) setShowFilters(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateFilter = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      type: 'all',
      category: 'all',
      priority: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const filteredEvents = events.filter((event) => {
    // Filtro de busca textual
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower) ||
        event.participants?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Filtro de tipo
    if (filters.type !== 'all' && event.type !== filters.type) {
      return false;
    }

    // Filtro de categoria
    if (filters.category !== 'all' && event.category !== filters.category) {
      return false;
    }

    // Filtro de prioridade
    if (filters.priority !== 'all' && event.priority !== filters.priority) {
      return false;
    }

    // Filtro de data de início
    if (filters.startDate) {
      const filterDate = new Date(filters.startDate);
      if (event.startDate < filterDate) {
        return false;
      }
    }

    // Filtro de data de término
    if (filters.endDate) {
      const filterDate = new Date(filters.endDate);
      if (event.startDate > filterDate) {
        return false;
      }
    }

    return true;
  });

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'searchTerm' && value !== 'all' && value !== ''
  ).length;

  return (
    <div className="flex-1 bg-gray-50 p-3 sm:p-4 md:p-6 overflow-auto h-full">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center gap-2 text-sm text-gray-500"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Home className="size-4" />
          <ChevronRight className="size-3" />
          <span className="text-gray-900 font-medium">Buscar Eventos</span>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Search className="size-5 sm:size-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl text-gray-900 font-semibold">Buscar Eventos</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Encontre eventos usando filtros avançados</p>
        </motion.div>

        {/* Barra de Busca */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-2 sm:gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-gray-400" />
            <Input
              type="text"
              placeholder={isMobile ? "Buscar eventos..." : "Buscar por título, descrição, localização..."}
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-9 sm:pl-10 text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className={`gap-2 flex-1 sm:flex-none ${showFilters ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
            >
              <SlidersHorizontal className="size-4" />
              <span className="sm:inline">Filtros</span>
              {activeFiltersCount > 0 && (
                <Badge variant={showFilters ? "outline" : "secondary"} className={`ml-1 ${showFilters ? 'bg-white text-indigo-600' : ''}`}>
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters} className="gap-2 px-3">
                <X className="size-4" />
                <span className="hidden sm:inline">Limpar</span>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Painel de Filtros */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="pt-4 sm:pt-6 pb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="filter-type" className="flex items-center gap-2 text-xs sm:text-sm">
                        <Tag className="size-3 sm:size-4" />
                        Tipo
                      </Label>
                      <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                        <SelectTrigger id="filter-type" className="text-xs sm:text-sm h-9 sm:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="filter-category" className="text-xs sm:text-sm">Categoria</Label>
                      <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                        <SelectTrigger id="filter-category" className="text-xs sm:text-sm h-9 sm:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {eventCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="filter-priority" className="flex items-center gap-2 text-xs sm:text-sm">
                        <AlertCircle className="size-3 sm:size-4" />
                        Prioridade
                      </Label>
                      <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
                        <SelectTrigger id="filter-priority" className="text-xs sm:text-sm h-9 sm:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="filter-start-date" className="flex items-center gap-2 text-xs sm:text-sm">
                        <Calendar className="size-3 sm:size-4" />
                        De
                      </Label>
                      <Input
                        id="filter-start-date"
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => updateFilter('startDate', e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="filter-end-date" className="text-xs sm:text-sm">Até</Label>
                      <Input
                        id="filter-end-date"
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => updateFilter('endDate', e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resultados */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base text-gray-900 font-medium">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'resultado' : 'resultados'}
            </h2>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                    onClick={() => onEventClick(event)}
                  >
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className="size-10 sm:size-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: event.color }}
                        >
                          <Calendar className="size-5 sm:size-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1 sm:mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base text-gray-900 font-medium truncate">{event.title}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 sm:line-clamp-2">
                                {event.description}
                              </p>
                            </div>
                            <Badge className={`${priorityColors[event.priority]} text-[10px] sm:text-xs px-1.5 sm:px-2 flex-shrink-0`}>
                              {isMobile ? (event.priority === 'high' ? '🔴' : event.priority === 'medium' ? '🟡' : '🟢') : priorityLabels[event.priority]}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <Calendar className="size-3 sm:size-4" />
                              {event.startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <Clock className="size-3 sm:size-4" />
                              {event.startTime}
                            </div>
                            {event.location && !isMobile && (
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                <MapPin className="size-3 sm:size-4" />
                                <span className="truncate max-w-[150px]">{event.location}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                            <Badge
                              variant="secondary"
                              className="text-[10px] sm:text-xs"
                              style={{ backgroundColor: event.color, color: 'white' }}
                            >
                              {event.type}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] sm:text-xs">{event.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Search className="size-10 sm:size-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-sm sm:text-base text-gray-900 mb-2 font-medium">Nenhum evento encontrado</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Tente ajustar os filtros ou fazer uma nova busca
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
