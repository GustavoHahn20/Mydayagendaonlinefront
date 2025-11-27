import { useState, useEffect } from 'react';
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
  ChevronRight,
  Loader2,
  Eye,
  EyeOff,
  Power,
  PowerOff
} from 'lucide-react';
import { EventType, EventCategory, RepeatOption } from '../lib/types';
import { 
  settingsApi,
  EventTypeAPI,
  EventCategoryAPI,
  RepeatOptionAPI,
  GeneralSettingsAPI
} from '../lib/api';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface SettingsPageProps {
  onUpdateSettings: (settings: any) => void;
}

// Interface para configurações gerais locais
interface GeneralSettings {
  defaultView: string;
  weekStartsOn: string;
  timeFormat: string;
  dateFormat: string;
  defaultReminder: string;
  theme: string;
}

const defaultGeneralSettings: GeneralSettings = {
  defaultView: 'month',
  weekStartsOn: 'sunday',
  timeFormat: '24h',
  dateFormat: 'dd/mm/yyyy',
  defaultReminder: '15min',
  theme: 'light',
};

export function SettingsPage({ onUpdateSettings }: SettingsPageProps) {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [repeatOptions, setRepeatOptions] = useState<RepeatOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingRepeat, setEditingRepeat] = useState<string | null>(null);

  const [newType, setNewType] = useState({ name: '', color: '#3b82f6', icon: 'calendar' });
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6' });
  const [newRepeat, setNewRepeat] = useState({ name: '', value: '' });

  // Configurações gerais
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(defaultGeneralSettings);

  // Carregar configurações da API ao montar o componente
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await settingsApi.getAll();
      
      // Converter tipos da API para o formato local
      setEventTypes(settings.eventTypes.map(t => ({
        id: t.id,
        name: t.name,
        color: t.color,
        icon: t.icon,
        active: t.active !== false // Se não definido, considera como ativo
      })));
      
      setEventCategories(settings.eventCategories.map(c => ({
        id: c.id,
        name: c.name,
        color: c.color,
        active: c.active !== false // Se não definido, considera como ativo
      })));
      
      setRepeatOptions(settings.repeatOptions.map(r => ({
        id: r.id,
        name: r.name,
        value: r.value,
        active: r.active !== false // Se não definido, considera como ativo
      })));
      
      if (settings.generalSettings) {
        setGeneralSettings({
          defaultView: settings.generalSettings.defaultView,
          weekStartsOn: settings.generalSettings.weekStartsOn,
          timeFormat: settings.generalSettings.timeFormat,
          dateFormat: settings.generalSettings.dateFormat,
          defaultReminder: settings.generalSettings.defaultReminder,
          theme: settings.generalSettings.theme,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações', {
        description: 'Não foi possível carregar suas configurações. Usando valores padrão.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateGeneralSetting = (key: string, value: string) => {
    setGeneralSettings({ ...generalSettings, [key]: value });
  };

  const handleSaveGeneralSettings = async () => {
    setIsSaving(true);
    try {
      await settingsApi.updateGeneralSettings(generalSettings);
      onUpdateSettings({ general: generalSettings });
      toast.success('Configurações gerais salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para Tipos de Evento
  const handleAddType = async () => {
    if (newType.name.trim()) {
      setIsSaving(true);
      try {
        const createdType = await settingsApi.createEventType(newType);
        const type: EventType = {
          id: createdType.id,
          name: createdType.name,
          color: createdType.color,
          icon: createdType.icon,
          active: true,
        };
        setEventTypes([...eventTypes, type]);
        setNewType({ name: '', color: '#3b82f6', icon: 'calendar' });
        toast.success('Tipo de evento adicionado!');
      } catch (error) {
        console.error('Erro ao adicionar tipo:', error);
        toast.error('Erro ao adicionar tipo de evento');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Ativar/Inativar tipo de evento (soft delete)
  const handleToggleTypeActive = async (id: string, currentActive: boolean) => {
    setIsSaving(true);
    try {
      const newActive = !currentActive;
      await settingsApi.toggleEventTypeActive(id, newActive);
      setEventTypes(eventTypes.map((t) => (t.id === id ? { ...t, active: newActive } : t)));
      toast.success(newActive ? 'Tipo de evento ativado!' : 'Tipo de evento inativado!');
    } catch (error) {
      console.error('Erro ao alterar status do tipo:', error);
      toast.error('Erro ao alterar status do tipo de evento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateType = async (id: string, updates: Partial<EventType>) => {
    setIsSaving(true);
    try {
      await settingsApi.updateEventType(id, updates);
      setEventTypes(eventTypes.map((t) => (t.id === id ? { ...t, ...updates } : t)));
      setEditingType(null);
      toast.success('Tipo de evento atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar tipo:', error);
      toast.error('Erro ao atualizar tipo de evento');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para Categorias
  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      setIsSaving(true);
      try {
        const createdCategory = await settingsApi.createEventCategory(newCategory);
        const category: EventCategory = {
          id: createdCategory.id,
          name: createdCategory.name,
          color: createdCategory.color,
          active: true,
        };
        setEventCategories([...eventCategories, category]);
        setNewCategory({ name: '', color: '#3b82f6' });
        toast.success('Categoria adicionada!');
      } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        toast.error('Erro ao adicionar categoria');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Ativar/Inativar categoria (soft delete)
  const handleToggleCategoryActive = async (id: string, currentActive: boolean) => {
    setIsSaving(true);
    try {
      const newActive = !currentActive;
      await settingsApi.toggleEventCategoryActive(id, newActive);
      setEventCategories(eventCategories.map((c) => (c.id === id ? { ...c, active: newActive } : c)));
      toast.success(newActive ? 'Categoria ativada!' : 'Categoria inativada!');
    } catch (error) {
      console.error('Erro ao alterar status da categoria:', error);
      toast.error('Erro ao alterar status da categoria');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setIsSaving(true);
    try {
      await settingsApi.deleteEventCategory(id);
      setEventCategories(eventCategories.filter((c) => c.id !== id));
      toast.success('Categoria removida!');
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      toast.error('Erro ao remover categoria');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCategory = async (id: string, updates: Partial<EventCategory>) => {
    setIsSaving(true);
    try {
      await settingsApi.updateEventCategory(id, updates);
      setEventCategories(eventCategories.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      setEditingCategory(null);
      toast.success('Categoria atualizada!');
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast.error('Erro ao atualizar categoria');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para Opções de Repetição
  const handleAddRepeat = async () => {
    if (newRepeat.name.trim() && newRepeat.value.trim()) {
      setIsSaving(true);
      try {
        const createdOption = await settingsApi.createRepeatOption(newRepeat);
        const repeat: RepeatOption = {
          id: createdOption.id,
          name: createdOption.name,
          value: createdOption.value,
          active: true,
        };
        setRepeatOptions([...repeatOptions, repeat]);
        setNewRepeat({ name: '', value: '' });
        toast.success('Opção de repetição adicionada!');
      } catch (error) {
        console.error('Erro ao adicionar opção de repetição:', error);
        toast.error('Erro ao adicionar opção de repetição');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Ativar/Inativar opção de repetição (soft delete)
  const handleToggleRepeatActive = async (id: string, currentActive: boolean) => {
    setIsSaving(true);
    try {
      const newActive = !currentActive;
      await settingsApi.toggleRepeatOptionActive(id, newActive);
      setRepeatOptions(repeatOptions.map((r) => (r.id === id ? { ...r, active: newActive } : r)));
      toast.success(newActive ? 'Opção de repetição ativada!' : 'Opção de repetição inativada!');
    } catch (error) {
      console.error('Erro ao alterar status da opção de repetição:', error);
      toast.error('Erro ao alterar status da opção de repetição');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRepeat = async (id: string) => {
    setIsSaving(true);
    try {
      await settingsApi.deleteRepeatOption(id);
      setRepeatOptions(repeatOptions.filter((r) => r.id !== id));
      toast.success('Opção de repetição removida!');
    } catch (error) {
      console.error('Erro ao remover opção de repetição:', error);
      toast.error('Erro ao remover opção de repetição');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRepeat = async (id: string, updates: Partial<RepeatOption>) => {
    setIsSaving(true);
    try {
      await settingsApi.updateRepeatOption(id, updates);
      setRepeatOptions(repeatOptions.map((r) => (r.id === id ? { ...r, ...updates } : r)));
      setEditingRepeat(null);
      toast.success('Opção de repetição atualizada!');
    } catch (error) {
      console.error('Erro ao atualizar opção de repetição:', error);
      toast.error('Erro ao atualizar opção de repetição');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-5 md:p-6 overflow-auto h-full">
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
                  <Button onClick={handleSaveGeneralSettings} disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    {isSaving ? 'Salvando...' : 'Salvar Configurações'}
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
                  {eventTypes.map((type) => {
                    const isActive = type.active !== false;
                    return (
                      <div
                        key={type.id}
                        className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                          isActive ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
                        }`}
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
                              style={{ backgroundColor: type.color, opacity: isActive ? 1 : 0.5 }}
                            />
                            <span className={`flex-1 ${!isActive ? 'line-through text-gray-500' : ''}`}>
                              {type.name}
                            </span>
                            {!isActive && (
                              <Badge variant="outline" className="text-gray-500 border-gray-300">
                                Inativo
                              </Badge>
                            )}
                            <Badge style={{ backgroundColor: type.color, color: 'white', opacity: isActive ? 1 : 0.5 }}>
                              {type.name}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingType(type.id)}
                              title="Editar"
                            >
                              <Edit2 className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleTypeActive(type.id, isActive)}
                              title={isActive ? 'Inativar' : 'Ativar'}
                            >
                              {isActive ? (
                                <EyeOff className="size-4 text-orange-600" />
                              ) : (
                                <Eye className="size-4 text-green-600" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    );
                  })}
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
                  {eventCategories.map((category) => {
                    const isActive = category.active !== false;
                    return (
                      <div
                        key={category.id}
                        className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                          isActive ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
                        }`}
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
                              style={{ backgroundColor: category.color, opacity: isActive ? 1 : 0.5 }}
                            />
                            <span className={`flex-1 ${!isActive ? 'line-through text-gray-500' : ''}`}>
                              {category.name}
                            </span>
                            {!isActive && (
                              <Badge variant="outline" className="text-gray-500 border-gray-300">
                                Inativo
                              </Badge>
                            )}
                            <Badge variant="outline" style={{ opacity: isActive ? 1 : 0.5 }}>
                              {category.name}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCategory(category.id)}
                              title="Editar"
                            >
                              <Edit2 className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleCategoryActive(category.id, isActive)}
                              title={isActive ? 'Inativar' : 'Ativar'}
                            >
                              {isActive ? (
                                <EyeOff className="size-4 text-orange-600" />
                              ) : (
                                <Eye className="size-4 text-green-600" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    );
                  })}
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
                  {repeatOptions.map((option) => {
                    const isActive = option.active !== false;
                    return (
                      <div
                        key={option.id}
                        className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                          isActive ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
                        }`}
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
                            <Repeat className={`size-4 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
                            <span className={`flex-1 ${!isActive ? 'line-through text-gray-500' : ''}`}>
                              {option.name}
                            </span>
                            {!isActive && (
                              <Badge variant="outline" className="text-gray-500 border-gray-300">
                                Inativo
                              </Badge>
                            )}
                            <Badge variant="secondary" style={{ opacity: isActive ? 1 : 0.5 }}>
                              {option.value}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingRepeat(option.id)}
                              title="Editar"
                            >
                              <Edit2 className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleRepeatActive(option.id, isActive)}
                              title={isActive ? 'Inativar' : 'Ativar'}
                            >
                              {isActive ? (
                                <EyeOff className="size-4 text-orange-600" />
                              ) : (
                                <Eye className="size-4 text-green-600" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    );
                  })}
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
