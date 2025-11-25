import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Save,
  Camera,
  Globe
} from 'lucide-react';
import { User as UserType } from '../lib/types';

interface ProfilePageProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
}

export function ProfilePage({ user, onUpdateUser }: ProfilePageProps) {
  const [profileData, setProfileData] = useState(user);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const updateProfileField = (field: keyof UserType, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const updatePasswordField = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleSaveProfile = () => {
    onUpdateUser(profileData);
    // Mostrar mensagem de sucesso
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }
    // Simular mudança de senha
    alert('Senha alterada com sucesso!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e de conta</p>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="size-24">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {getInitials(profileData.name)}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Camera className="size-4 text-gray-600" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-gray-900">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          {/* Informações Pessoais */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => updateProfileField('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="size-4" />
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => updateProfileField('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="size-4" />
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={profileData.phone || ''}
                      onChange={(e) => updateProfileField('phone', e.target.value)}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="flex items-center gap-2">
                      <Globe className="size-4" />
                      Fuso Horário
                    </Label>
                    <Input
                      id="timezone"
                      value={profileData.timezone || ''}
                      onChange={(e) => updateProfileField('timezone', e.target.value)}
                      placeholder="America/Sao_Paulo"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="size-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Informações da Conta */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-700">ID da Conta</p>
                      <p className="text-sm text-gray-600">{profileData.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-700">E-mail de Acesso</p>
                      <p className="text-sm text-gray-600">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-700">Membro desde</p>
                      <p className="text-sm text-gray-600">Janeiro de 2025</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-700">Plano</p>
                      <p className="text-sm text-gray-600">Gratuito</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Fazer Upgrade
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-gray-900 mb-4">Zona de Perigo</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                      <div>
                        <p className="text-gray-700">Desativar Conta</p>
                        <p className="text-sm text-gray-600">
                          Sua conta será temporariamente desativada
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Desativar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                      <div>
                        <p className="text-gray-700">Excluir Conta</p>
                        <p className="text-sm text-gray-600">
                          Todos os seus dados serão permanentemente apagados
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="size-5" />
                  Alterar Senha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => updatePasswordField('currentPassword', e.target.value)}
                    placeholder="Digite sua senha atual"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => updatePasswordField('newPassword', e.target.value)}
                    placeholder="Digite sua nova senha"
                  />
                  <p className="text-sm text-gray-600">
                    A senha deve ter pelo menos 6 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => updatePasswordField('confirmPassword', e.target.value)}
                    placeholder="Confirme sua nova senha"
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={handleChangePassword} className="gap-2">
                    <Lock className="size-4" />
                    Alterar Senha
                  </Button>
                </div>

                <div className="pt-6 border-t mt-6">
                  <h3 className="text-gray-900 mb-4">Autenticação de Dois Fatores</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-700">Autenticação 2FA</p>
                      <p className="text-sm text-gray-600">
                        Adicione uma camada extra de segurança
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ativar
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-gray-900 mb-4">Sessões Ativas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-700">Windows • Chrome</p>
                        <p className="text-sm text-gray-600">São Paulo, Brasil • Ativo agora</p>
                      </div>
                      <span className="text-sm text-green-600">Atual</span>
                    </div>
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
