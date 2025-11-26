import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  Repeat, 
  FileText,
  Edit2,
  Save,
  X,
  Tag,
  AlertCircle,
  Trash2,
  Palette,
  CalendarCheck
} from 'lucide-react';
import { Event } from '../lib/types';
import { eventTypes, eventCategories, repeatOptions } from '../lib/mock-data';
import { motion, AnimatePresence } from 'motion/react';

interface EventDialogProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export function EventDialog({ event, open, onClose, onSave, onDelete }: EventDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(event);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    setEditedEvent(event);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedEvent) {
      onSave(editedEvent);
      setIsEditing(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setEditedEvent(event);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && event) {
      onDelete(event.id);
      setShowDeleteDialog(false);
      onClose();
    }
  };

  const updateField = (field: keyof Event, value: any) => {
    if (editedEvent) {
      setEditedEvent({ ...editedEvent, [field]: value });
    }
  };

  if (!event && !editedEvent) return null;

  const displayEvent = editedEvent || event!;

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <motion.div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: displayEvent.color }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {isEditing ? 'Editar Evento' : 'Detalhes do Evento'}
                </DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Faça as alterações necessárias e salve.' : 'Visualize os detalhes do evento.'}
                </DialogDescription>
              </div>
              {!isEditing && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="gap-2"
                  >
                    <Edit2 className="size-4" />
                    Editar
                  </Button>
                </motion.div>
              )}
            </div>
          </DialogHeader>

          <AnimatePresence mode="wait">
            <motion.div
              key={isEditing ? 'editing' : 'viewing'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 mt-4"
            >
              {/* Título */}
              <div className="space-y-2">
                <Label>Título</Label>
                {isEditing ? (
                  <Input
                    value={displayEvent.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <h3 className="text-gray-900">{displayEvent.title}</h3>
                )}
              </div>

              {/* Tipo e Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="size-4 text-blue-600" />
                    Tipo
                  </Label>
                  {isEditing ? (
                    <Select
                      value={displayEvent.type}
                      onValueChange={(value) => updateField('type', value)}
                    >
                      <SelectTrigger>
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
                  ) : (
                    <Badge 
                      style={{ backgroundColor: displayEvent.color }}
                      className="w-fit shadow-sm"
                    >
                      {displayEvent.type}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Categoria</Label>
                  {isEditing ? (
                    <Select
                      value={displayEvent.category}
                      onValueChange={(value) => updateField('category', value)}
                    >
                      <SelectTrigger>
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
                  ) : (
                    <p className="text-gray-700">{displayEvent.category}</p>
                  )}
                </div>
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="size-4 text-green-600" />
                    Data de Início
                  </Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={displayEvent.startDate.toISOString().split('T')[0]}
                      onChange={(e) => updateField('startDate', new Date(e.target.value))}
                      className="transition-all focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {displayEvent.startDate.toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarCheck className="size-4 text-green-600" />
                    Data de Término
                  </Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={displayEvent.endDate.toISOString().split('T')[0]}
                      onChange={(e) => updateField('endDate', new Date(e.target.value))}
                      className="transition-all focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {displayEvent.endDate.toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>

              {/* Horário */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="size-4 text-orange-600" />
                    Hora de Início
                  </Label>
                  {isEditing ? (
                    <Input
                      type="time"
                      value={displayEvent.startTime}
                      onChange={(e) => updateField('startTime', e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700">{displayEvent.startTime}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="size-4 text-orange-600" />
                    Hora de Término
                  </Label>
                  {isEditing ? (
                    <Input
                      type="time"
                      value={displayEvent.endTime}
                      onChange={(e) => updateField('endTime', e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700">{displayEvent.endTime}</p>
                  )}
                </div>
              </div>

              {/* Prioridade e Cor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="size-4 text-red-600" />
                    Prioridade
                  </Label>
                  {isEditing ? (
                    <Select
                      value={displayEvent.priority}
                      onValueChange={(value) => updateField('priority', value as 'low' | 'medium' | 'high')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Baixa</SelectItem>
                        <SelectItem value="medium">🟡 Média</SelectItem>
                        <SelectItem value="high">🔴 Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={priorityColors[displayEvent.priority]}>
                      {priorityLabels[displayEvent.priority]}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="size-4 text-pink-600" />
                    Cor do Evento
                  </Label>
                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={displayEvent.color}
                        onChange={(e) => updateField('color', e.target.value)}
                        className="w-20 h-10"
                      />
                      <span className="text-sm text-gray-600">{displayEvent.color}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div 
                        className="size-6 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: displayEvent.color }}
                      />
                      <span className="text-gray-700">{displayEvent.color}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Localização e Participantes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="size-4 text-purple-600" />
                    Localização
                  </Label>
                  {isEditing ? (
                    <Input
                      value={displayEvent.location || ''}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="Adicionar localização"
                      className="transition-all focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {displayEvent.location || <span className="text-gray-400 italic">Não informado</span>}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="size-4 text-indigo-600" />
                    Participantes
                  </Label>
                  {isEditing ? (
                    <Input
                      value={displayEvent.participants || ''}
                      onChange={(e) => updateField('participants', e.target.value)}
                      placeholder="Adicionar participantes"
                      className="transition-all focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {displayEvent.participants || <span className="text-gray-400 italic">Não informado</span>}
                    </p>
                  )}
                </div>
              </div>

              {/* Repetição e Lembrete */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Repeat className="size-4 text-teal-600" />
                    Repetir
                  </Label>
                  {isEditing ? (
                    <Select
                      value={displayEvent.repeat || 'none'}
                      onValueChange={(value) => updateField('repeat', value)}
                    >
                      <SelectTrigger>
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
                  ) : (
                    <p className="text-gray-700">
                      {repeatOptions.find((opt) => opt.value === displayEvent.repeat)?.name || 
                        <span className="text-gray-400 italic">Não se repete</span>}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Bell className="size-4 text-yellow-600" />
                    Lembrete
                  </Label>
                  {isEditing ? (
                    <Select
                      value={displayEvent.reminder || 'none'}
                      onValueChange={(value) => updateField('reminder', value)}
                    >
                      <SelectTrigger>
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
                  ) : (
                    <p className="text-gray-700">
                      {displayEvent.reminder ? (
                        displayEvent.reminder === 'none' ? 'Nenhum' :
                        displayEvent.reminder === '15min' ? '15 minutos antes' :
                        displayEvent.reminder === '30min' ? '30 minutos antes' :
                        displayEvent.reminder === '1hour' ? '1 hora antes' :
                        displayEvent.reminder === '2hours' ? '2 horas antes' :
                        displayEvent.reminder === '1day' ? '1 dia antes' :
                        displayEvent.reminder
                      ) : (
                        <span className="text-gray-400 italic">Nenhum</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="size-4 text-gray-600" />
                  Descrição
                </Label>
                {isEditing ? (
                  <Textarea
                    value={displayEvent.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="transition-all focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{displayEvent.description}</p>
                )}
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label>Notas Adicionais</Label>
                {isEditing ? (
                  <Textarea
                    value={displayEvent.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Adicionar notas"
                    rows={2}
                    className="transition-all focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {displayEvent.notes || <span className="text-gray-400 italic">Nenhuma nota adicionada</span>}
                  </p>
                )}
              </div>

              {/* Botões de Ação */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4 border-t"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button onClick={handleSave} className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Save className="size-4" />
                      Salvar Alterações
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto gap-2">
                      <X className="size-4" />
                      Cancelar
                    </Button>
                  </motion.div>
                  {onDelete && event && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        className="w-full sm:w-auto gap-2"
                      >
                        <Trash2 className="size-4" />
                        Excluir
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o evento "{event?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}