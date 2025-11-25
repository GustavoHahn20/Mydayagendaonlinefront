import { useState } from 'react';
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
  X
} from 'lucide-react';
import { Event } from '../lib/types';
import { eventTypes, eventCategories } from '../lib/mock-data';

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

  const [showFilters, setShowFilters] = useState(true);

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
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">Buscar Eventos</h1>
          <p className="text-gray-600">Encontre eventos usando filtros avançados</p>
        </div>

        {/* Barra de Busca */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título, descrição, localização..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="size-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <X className="size-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Painel de Filtros */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-type" className="flex items-center gap-2">
                    <Tag className="size-4" />
                    Tipo de Evento
                  </Label>
                  <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                    <SelectTrigger id="filter-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-category">Categoria</Label>
                  <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                    <SelectTrigger id="filter-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {eventCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-priority" className="flex items-center gap-2">
                    <AlertCircle className="size-4" />
                    Prioridade
                  </Label>
                  <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
                    <SelectTrigger id="filter-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as prioridades</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-start-date" className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    Data Inicial
                  </Label>
                  <Input
                    id="filter-start-date"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => updateFilter('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-end-date">Data Final</Label>
                  <Input
                    id="filter-end-date"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => updateFilter('endDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultados */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">
              Resultados ({filteredEvents.length})
            </h2>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onEventClick(event)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="size-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: event.color }}
                      >
                        <Calendar className="size-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                          <Badge className={priorityColors[event.priority]}>
                            {priorityLabels[event.priority]}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            {event.startDate.toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-4" />
                            {event.startTime} - {event.endTime}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="size-4" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Badge
                            variant="secondary"
                            style={{ backgroundColor: event.color, color: 'white' }}
                          >
                            {event.type}
                          </Badge>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="size-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">Nenhum evento encontrado</h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou fazer uma nova busca
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
