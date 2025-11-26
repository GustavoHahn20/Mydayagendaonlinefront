import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Calendar, Lock, Mail, Sparkles, ArrowRight, Zap, User, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi, AuthResponse } from '../lib/api';

interface LoginPageProps {
  onLogin: (user: AuthResponse['user']) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        // Validações para registro
        if (!name.trim()) {
          setError('Por favor, informe seu nome');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('As senhas não coincidem');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres');
          setIsLoading(false);
          return;
        }

        const response = await authApi.register({ name, email, password });
        onLogin(response.user);
      } else {
        // Login
        const response = await authApi.login({ email, password });
        onLogin(response.user);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.status === 401) {
        setError('E-mail ou senha incorretos');
      } else if (err.status === 409) {
        setError('Este e-mail já está cadastrado');
      } else {
        setError(err.message || 'Erro ao conectar com o servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setName('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3 sm:p-4 relative overflow-y-auto safe-area-pt safe-area-pb">
      {/* Animated background elements - hidden on small screens */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10 my-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 border border-white/20"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        >
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <motion.div
              className="relative mb-3 sm:mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl relative">
                <Calendar className="size-8 sm:size-10 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1.5"
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="size-4 text-yellow-900" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl sm:text-3xl text-gray-900 mb-1 tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
                MyDay
              </h1>
              <motion.div
                className="flex items-center justify-center gap-2 mb-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Zap className="size-4 text-yellow-500" />
                <p className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Vá em frente com "MyDay"!
                </p>
                <ArrowRight className="size-4 text-indigo-600" />
              </motion.div>
              <motion.p
                className="text-gray-600 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isRegister ? 'Crie sua conta e comece a organizar' : 'Seu dia, suas regras. Organize com estilo.'}
              </motion.p>
            </motion.div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field (only for register) */}
            {isRegister && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 transition-all focus:ring-2 focus:ring-indigo-500 border-gray-200 focus:border-indigo-500"
                    required={isRegister}
                    disabled={isLoading}
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="email">E-mail</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 transition-all focus:ring-2 focus:ring-indigo-500 border-gray-200 focus:border-indigo-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label htmlFor="password">Senha</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 transition-all focus:ring-2 focus:ring-indigo-500 border-gray-200 focus:border-indigo-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Confirm password (only for register) */}
            {isRegister && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 transition-all focus:ring-2 focus:ring-indigo-500 border-gray-200 focus:border-indigo-500"
                    required={isRegister}
                    disabled={isLoading}
                  />
                </div>
              </motion.div>
            )}

            {!isRegister && (
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Lembrar-me</span>
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                  Esqueceu a senha?
                </a>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-white group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    {isRegister ? 'Criando conta...' : 'Entrando...'}
                  </>
                ) : (
                  <>
                    {isRegister ? 'Criar conta' : 'Entrar no MyDay'}
                    <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm text-gray-600">
                {isRegister ? 'Já tem uma conta?' : 'Novo por aqui?'}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                  disabled={isLoading}
                >
                  {isRegister ? 'Faça login' : 'Crie sua conta gratuita'}
                </button>
              </p>
            </motion.div>
          </form>

          {/* Feature highlights - hidden on register mode on small screens */}
          {!isRegister && (
            <motion.div
              className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl">✨</div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Personalizável</p>
                </div>
                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl">🚀</div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Moderno</p>
                </div>
                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl">💪</div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Poderoso</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.p
          className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 px-4 hidden sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          © 2025 MyDay. Organize seu tempo, conquiste seus objetivos.
        </motion.p>
      </motion.div>
    </div>
  );
}
