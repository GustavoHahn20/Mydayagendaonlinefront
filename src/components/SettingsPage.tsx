import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Tag, 
  Repeat, 
  Plus, 
  Edit2, 
  Trash2,
  Save,
  X,
  Home,
  ChevronRight
} from 'lucide-react';
import { EventType, EventCategory, RepeatOption } from '../lib/types';
import { eventTypes as initialEventTypes, eventCategories as initialEventCategories, repeatOptions as initialRepeatOptions } from '../lib/mock-data';
import { motion } from 'motion/react';

interface SettingsPageProps {
  onUpdateSettings: (settings: any) => void;
}

export function SettingsPage({ onUpdateSettings }: SettingsPageProps) {
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialEventTypes);
  const [eventCategories, setEventCategories] = useState<EventCategory[]>(initialEventCategories);
  const [repeatOptions, setRepeatOptions] = useState<RepeatOption[]>(initialRepeatOptions);
  
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingRepeat, setEditingRepeat] = useState<string | null>(null);

  const [newType, setNewType] = useState({ name: '', color: '#3b82f6', icon: 'calendar' });
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6' });
  const [newRepeat, setNewRepeat] = useState({ name: '', value: '' });

  // Configurações gerais
  const [generalSettings, setGeneralSettings] = useState({
    defaultView: 'month',
    weekStartsOn: 'sunday',
    timeFormat: '24h',
    dateFormat: 'dd/mm/yyyy',
    defaultReminder: '15min',
    theme: 'light',
  });

  const updateGeneralSetting = (key: string, value: string) => {
    setGeneralSettings({ ...generalSettings, [key]: value });
  };

  const handleSaveGeneralSettings = () => {
    onUpdateSettings({ general: generalSettings });
    alert('Configurações salvas com sucesso!');
  };

  // Funções para Tipos de Evento
  const handleAddType = () => {
    if (newType.name.trim()) {
      const type: EventType = {
        id: String(Date.now()),
        ...newType,
      };
      setEventTypes([...eventTypes, type]);
      setNewType({ name: '', color: '#3b82f6', icon: 'calendar' });
    }
  };

  const handleDeleteType = (id: string) => {
    setEventTypes(eventTypes.filter((t) => t.id !== id));
  };

  const handleUpdateType = (id: string, updates: Partial<EventType>) => {
    setEventTypes(eventTypes.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    setEditingType(null);
  };

  // Funções para Categorias
  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category: EventCategory = {
        id: String(Date.now()),
        ...newCategory,
      };
      setEventCategories([...eventCategories, category]);
      setNewCategory({ name: '', color: '#3b82f6' });
    }
  };

  const handleDeleteCategory = (id: string) => {
    setEventCategories(eventCategories.filter((c) => c.id !== id));
  };

  const handleUpdateCategory = (id: string, updates: Partial<EventCategory>) => {
    setEventCategories(eventCategories.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    setEditingCategory(null);
  };

  // Funções para Opções de Repetição
  const handleAddRepeat = () => {
    if (newRepeat.name.trim() && newRepeat.value.trim()) {
      const repeat: RepeatOption = {
        id: String(Date.now()),
        ...newRepeat,
      };
      setRepeatOptions([...repeatOptions, repeat]);
      setNewRepeat({ name: '', value: '' });
    }
  };

  const handleDeleteRepeat = (id: string) => {
    setRepeatOptions(repeatOptions.filter((r) => r.id !== id));
  };

  const handleUpdateRepeat = (id: string, updates: Partial<RepeatOption>) => {
    setRepeatOptions(repeatOptions.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    setEditingRepeat(null);
  };

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
          <span className="text-gray-900 font-medium">Configurações</span>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <SettingsIcon className="size-5 sm:size-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl text-gray-900 font-semibold">Configurações</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Personalize sua experiência com a agenda</p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
            <TabsTrigger value="general" className="text-xs sm:text-sm py-2">Geral</TabsTrigger>
            <TabsTrigger value="types" className="text-xs sm:text-sm py-2">Tipos</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm py-2">Categorias</TabsTrigger>
            <TabsTrigger value="repeat" className="text-xs sm:text-sm py-2">Repetições</TabsTrigger>
          </TabsList>

          {/* Configurações Gerais */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="size-5" />
                  Configurações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-view">Visualização Padrão</Label>
                    <select
                      id="default-view"
                      value={generalSettings.defaultView}
                      onChange={(e) => updateGeneralSetting('defaultView', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="day">Dia</option>
                      <option value="week">Semana</option>
                      <option value="month">Mês</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="week-starts">Início da Semana</Label>
                    <select
                      id="week-starts"
                      value={generalSettings.weekStartsOn}
                      onChange={(e) => updateGeneralSetting('weekStartsOn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="sunday">Domingo</option>
                      <option value="monday">Segunda-feira</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time-format">Formato de Hora</Label>
                    <select
                      id="time-format"
                      value={generalSettings.timeFormat}
                      onChange={(e) => updateGeneralSetting('timeFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="12h">12 horas (AM/PM)</option>
                      <option value="24h">24 horas</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">Formato de Data</Label>
                    <select
                      id="date-format"
                      value={generalSettings.dateFormat}
                      onChange={(e) => updateGeneralSetting('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="dd/mm/yyyy">DD/MM/AAAA</option>
                      <option value="mm/dd/yyyy">MM/DD/AAAA</option>
                      <option value="yyyy-mm-dd">AAAA-MM-DD</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-reminder">Lembrete Padrão</Label>
                    <select
                      id="default-reminder"
                      value={generalSettings.defaultReminder}
                      onChange={(e) => updateGeneralSetting('defaultReminder', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="none">Nenhum</option>
                      <option value="15min">15 minutos antes</option>
                      <option value="30min">30 minutos antes</option>
                      <option value="1hour">1 hora antes</option>
                      <option value="1day">1 dia antes</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme" className="flex items-center gap-2">
                      <Palette className="size-4" />
                      Tema
                    </Label>
                    <select
                      id="theme"
                      value={generalSettings.theme}
                      onChange={(e) => updateGeneralSetting('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveGeneralSettings} className="gap-2">
                    <Save className="size-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tipos de Evento */}
          <TabsContent value="types">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="size-5" />
                  Tipos de Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lista de Tipos */}
                <div className="space-y-3">
                  {eventTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      {editingType === type.id ? (
                        <>
                          <Input
                            value={type.name}
                            onChange={(e) => handleUpdateType(type.id, { name: e.target.value })}
                            className="flex-1"
                          />
                          <Input
                            type="color"
                            value={type.color}
                            onChange={(e) => handleUpdateType(type.id, { color: e.target.value })}
                            className="w-20"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingType(null)}
                          >
                            <Save className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <div
                            className="size-4 rounded"
                            style={{ backgroundColor: type.color }}
                          />
                          <span className="flex-1">{type.name}</span>
                          <Badge style={{ backgroundColor: type.color, color: 'white' }}>
                            {type.name}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingType(type.id)}
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteType(type.id)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Adicionar Novo Tipo */}
                <div className="border-t pt-6">
                  <h3 className="text-gray-900 mb-4">Adicionar Novo Tipo</h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Nome do tipo"
                      value={newType.name}
                      onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      type="color"
                      value={newType.color}
                      onChange={(e) => setNewType({ ...newType, color: e.target.value })}
                      className="w-20"
                    />
                    <Button onClick={handleAddType} className="gap-2">
                      <Plus className="size-4" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categorias */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categorias de Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lista de Categorias */}
                <div className="space-y-3">
                  {eventCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      {editingCategory === category.id ? (
                        <>
                          <Input
                            value={category.name}
                            onChange={(e) =>
                              handleUpdateCategory(category.id, { name: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Input
                            type="color"
                            value={category.color}
                            onChange={(e) =>
                              handleUpdateCategory(category.id, { color: e.target.value })
                            }
                            className="w-20"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCategory(null)}
                          >
                            <Save className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <div
                            className="size-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="flex-1">{category.name}</span>
                          <Badge variant="outline">{category.name}</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingCategory(category.id)}
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Adicionar Nova Categoria */}
                <div className="border-t pt-6">
                  <h3 className="text-gray-900 mb-4">Adicionar Nova Categoria</h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Nome da categoria"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="w-20"
                    />
                    <Button onClick={handleAddCategory} className="gap-2">
                      <Plus className="size-4" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opções de Repetição */}
          <TabsContent value="repeat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="size-5" />
                  Opções de Repetição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lista de Opções */}
                <div className="space-y-3">
                  {repeatOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      {editingRepeat === option.id ? (
                        <>
                          <Input
                            value={option.name}
                            onChange={(e) =>
                              handleUpdateRepeat(option.id, { name: e.target.value })
                            }
                            className="flex-1"
                            placeholder="Nome da opção"
                          />
                          <Input
                            value={option.value}
                            onChange={(e) =>
                              handleUpdateRepeat(option.id, { value: e.target.value })
                            }
                            className="flex-1"
                            placeholder="Valor"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingRepeat(null)}
                          >
                            <Save className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1">{option.name}</span>
                          <Badge variant="secondary">{option.value}</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingRepeat(option.id)}
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteRepeat(option.id)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Adicionar Nova Opção */}
                <div className="border-t pt-6">
                  <h3 className="text-gray-900 mb-4">Adicionar Nova Opção de Repetição</h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Nome (ex: Quinzenalmente)"
                      value={newRepeat.name}
                      onChange={(e) => setNewRepeat({ ...newRepeat, name: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Valor (ex: biweekly)"
                      value={newRepeat.value}
                      onChange={(e) => setNewRepeat({ ...newRepeat, value: e.target.value })}
                      className="flex-1"
                    />
                    <Button onClick={handleAddRepeat} className="gap-2">
                      <Plus className="size-4" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
