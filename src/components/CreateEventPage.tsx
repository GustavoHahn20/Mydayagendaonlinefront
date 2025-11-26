import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  Repeat, 
  FileText,
  Save,
  Tag,
  AlertCircle,
  Palette,
  Home,
  ChevronRight,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Event } from '../lib/types';
import { eventTypes, eventCategories, repeatOptions } from '../lib/mock-data';
import { motion } from 'motion/react';

interface CreateEventPageProps {
  onSave: (event: Omit<Event, 'id'>) => void;
  onCancel: () => void;
}

export function CreateEventPage({ onSave, onCancel }: CreateEventPageProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'Reunião',
    category: 'Trabalho',
    priority: 'medium' as 'low' | 'medium' | 'high',
    location: '',
    participants: '',
    reminder: '15min',
    repeat: 'none',
    color: '#3b82f6',
    notes: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    
    // Atualizar cor automaticamente quando o tipo mudar
    if (field === 'type') {
      const selectedType = eventTypes.find((t) => t.name === value);
      if (selectedType) {
        setFormData((prev) => ({ ...prev, [field]: value, color: selectedType.color }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: Omit<Event, 'id'> = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    };
    
    onSave(newEvent);
  };

  return (
    <div className="h-full min-h-0 bg-gray-50 p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto pb-6">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center gap-2 text-sm text-gray-500 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Home className="size-4" />
          <ChevronRight className="size-3" />
          <span className="text-gray-600">Dashboard</span>
          <ChevronRight className="size-3" />
          <span className="text-gray-900 font-medium">Criar Evento</span>
        </motion.nav>

        <motion.div 
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="size-5 text-gray-600" />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Plus className="size-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl text-gray-900 font-semibold">Criar Novo Evento</h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 ml-0 lg:ml-11">Preencha as informações do seu evento</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Evento *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Digite o título do evento"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Descreva o evento"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="flex items-center gap-2">
                    <Tag className="size-4" />
                    Tipo de Evento *
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  Prioridade *
                </Label>
                <Select value={formData.priority} onValueChange={(value) => updateField('priority', value as 'low' | 'medium' | 'high')}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="flex items-center gap-2">
                  <Palette className="size-4" />
                  Cor do Evento
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => updateField('color', e.target.value)}
                    className="w-20 h-10"
                  />
                  <span className="text-sm text-gray-600">{formData.color}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data e Hora */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                Data e Hora
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Término *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="flex items-center gap-2">
                    <Clock className="size-4" />
                    Hora de Início *
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateField('startTime', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora de Término *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateField('endTime', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repeat" className="flex items-center gap-2">
                  <Repeat className="size-4" />
                  Repetir Evento
                </Label>
                <Select value={formData.repeat} onValueChange={(value) => updateField('repeat', value)}>
                  <SelectTrigger id="repeat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {repeatOptions.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  Localização
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Onde o evento acontecerá?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants" className="flex items-center gap-2">
                  <Users className="size-4" />
                  Participantes
                </Label>
                <Input
                  id="participants"
                  value={formData.participants}
                  onChange={(e) => updateField('participants', e.target.value)}
                  placeholder="Nome dos participantes (separados por vírgula)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder" className="flex items-center gap-2">
                  <Bell className="size-4" />
                  Lembrete
                </Label>
                <Select value={formData.reminder} onValueChange={(value) => updateField('reminder', value)}>
                  <SelectTrigger id="reminder">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="15min">15 minutos antes</SelectItem>
                    <SelectItem value="30min">30 minutos antes</SelectItem>
                    <SelectItem value="1hour">1 hora antes</SelectItem>
                    <SelectItem value="2hours">2 horas antes</SelectItem>
                    <SelectItem value="1day">1 dia antes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionais</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Adicione observações ou informações extras"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <motion.div 
            className="flex flex-col-reverse sm:flex-row gap-3 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button type="button" variant="outline" onClick={onCancel} className="sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 sm:flex-none gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Save className="size-4" />
              Salvar Evento
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
