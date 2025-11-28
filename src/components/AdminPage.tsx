import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Shield, 
  Users, 
  Calendar, 
  Settings, 
  Home, 
  ChevronRight,
  Search,
  RefreshCw,
  BarChart3,
  Activity,
  Database,
  Globe,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  activeUsers: number;
  eventsToday: number;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  eventsCount: number;
}

export function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEvents: 0,
    activeUsers: 0,
    eventsToday: 0
  });
  const [users, setUsers] = useState<UserInfo[]>([]);

  // Simular carregamento de dados (substituir por chamadas reais à API quando disponível)
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulação de dados - substituir por chamadas reais à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 15,
        totalEvents: 47,
        activeUsers: 8,
        eventsToday: 12
      });

      setUsers([
        { id: '1', name: 'Admin Principal', email: 'admin@myday.com', role: 'admin', createdAt: '2025-01-01', eventsCount: 0 },
        { id: '2', name: 'Usuário Teste', email: 'usuario@teste.com', role: 'user', createdAt: '2025-01-15', eventsCount: 5 },
        { id: '3', name: 'Maria Silva', email: 'maria@email.com', role: 'user', createdAt: '2025-02-01', eventsCount: 12 },
      ]);

      toast.success('Dados carregados com sucesso!');
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotAvailable = () => {
    toast.info('Funcionalidade em desenvolvimento', {
      description: 'Esta opção estará disponível em breve.',
    });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    color: string;
    trend?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-full -mr-8 -mt-8`} />
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="size-3" />
                  {trend}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon className="size-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-5 md:p-6 overflow-auto h-full">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center gap-2 text-sm text-gray-500"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Home className="size-4" />
          <ChevronRight className="size-3" />
          <span className="text-gray-900 font-medium">Administração</span>
        </motion.nav>

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="size-6 text-red-600" />
              <h1 className="text-xl sm:text-2xl text-gray-900 font-semibold">Painel de Administração</h1>
              <Badge variant="destructive" className="ml-2">Admin</Badge>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Gerencie usuários, eventos e configurações do sistema</p>
          </div>
          <Button 
            onClick={loadData} 
            variant="outline" 
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total de Usuários" 
            value={stats.totalUsers} 
            icon={Users} 
            color="bg-blue-500"
            trend="+3 este mês"
          />
          <StatCard 
            title="Total de Eventos" 
            value={stats.totalEvents} 
            icon={Calendar} 
            color="bg-green-500"
            trend="+12 esta semana"
          />
          <StatCard 
            title="Usuários Ativos" 
            value={stats.activeUsers} 
            icon={Activity} 
            color="bg-purple-500"
          />
          <StatCard 
            title="Eventos Hoje" 
            value={stats.eventsToday} 
            icon={Clock} 
            color="bg-orange-500"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2 gap-1">
              <Users className="size-4 hidden sm:block" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm py-2 gap-1">
              <Calendar className="size-4 hidden sm:block" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs sm:text-sm py-2 gap-1">
              <Database className="size-4 hidden sm:block" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs sm:text-sm py-2 gap-1">
              <BarChart3 className="size-4 hidden sm:block" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Usuários */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-5" />
                    Gerenciar Usuários
                  </CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      placeholder="Buscar usuário..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-8 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`size-10 rounded-full flex items-center justify-center text-white font-medium ${user.role === 'admin' ? 'bg-red-500' : 'bg-indigo-500'}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{user.name}</p>
                              {user.role === 'admin' && (
                                <Badge variant="destructive" className="text-xs">Admin</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm text-gray-600">{user.eventsCount} eventos</p>
                            <p className="text-xs text-gray-400">Desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={handleNotAvailable}>
                            Editar
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <p className="text-center text-gray-500 py-8">Nenhum usuário encontrado</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Eventos */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  Visão Geral de Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="size-5 text-green-600" />
                      <span className="font-medium text-green-800">Eventos Concluídos</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">23</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="size-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Eventos Pendentes</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">18</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="size-5 text-red-600" />
                      <span className="font-medium text-red-800">Eventos Cancelados</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">6</p>
                  </div>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="size-12 mx-auto mb-4 text-gray-300" />
                  <p>Relatórios detalhados de eventos em breve</p>
                  <Button variant="outline" className="mt-4" onClick={handleNotAvailable}>
                    Ver Todos os Eventos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sistema */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Globe className="size-5 text-indigo-600" />
                        <span className="font-medium">API Status</span>
                      </div>
                      <Badge className="bg-green-500">Online</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Última verificação: agora</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Database className="size-5 text-indigo-600" />
                        <span className="font-medium">Banco de Dados</span>
                      </div>
                      <Badge className="bg-green-500">Conectado</Badge>
                    </div>
                    <p className="text-sm text-gray-600">PostgreSQL - Supabase</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Settings className="size-5" />
                    Configurações Gerais
                  </h3>
                  <div className="space-y-4 opacity-60">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Manutenção do Sistema</p>
                        <p className="text-sm text-gray-600">Ativar modo de manutenção</p>
                      </div>
                      <Button variant="outline" size="sm" disabled onClick={handleNotAvailable}>
                        Configurar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Backup de Dados</p>
                        <p className="text-sm text-gray-600">Realizar backup manual</p>
                      </div>
                      <Button variant="outline" size="sm" disabled onClick={handleNotAvailable}>
                        Executar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Limpar Cache</p>
                        <p className="text-sm text-gray-600">Limpar cache do sistema</p>
                      </div>
                      <Button variant="outline" size="sm" disabled onClick={handleNotAvailable}>
                        Limpar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="size-5" />
                  Logs do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'info', message: 'Usuário logou no sistema', time: '2 min atrás', user: 'admin@myday.com' },
                    { type: 'success', message: 'Evento criado com sucesso', time: '15 min atrás', user: 'usuario@teste.com' },
                    { type: 'warning', message: 'Tentativa de login com senha incorreta', time: '1 hora atrás', user: 'maria@email.com' },
                    { type: 'info', message: 'Configurações atualizadas', time: '2 horas atrás', user: 'admin@myday.com' },
                    { type: 'success', message: 'Backup automático realizado', time: '6 horas atrás', user: 'sistema' },
                  ].map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        log.type === 'success' ? 'bg-green-50' :
                        log.type === 'warning' ? 'bg-yellow-50' :
                        'bg-gray-50'
                      }`}
                    >
                      {log.type === 'success' && <CheckCircle className="size-5 text-green-600 mt-0.5" />}
                      {log.type === 'warning' && <AlertTriangle className="size-5 text-yellow-600 mt-0.5" />}
                      {log.type === 'info' && <Activity className="size-5 text-blue-600 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{log.message}</p>
                        <p className="text-xs text-gray-500">{log.user} • {log.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button variant="outline" onClick={handleNotAvailable}>
                    Ver Mais Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

