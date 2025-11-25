import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Calendar, Lock, Mail, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden safe-area-pt safe-area-pb">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
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
        className="w-full max-w-md relative z-10"
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
                Seu dia, suas regras. Organize com estilo.
              </motion.p>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                />
              </div>
            </motion.div>

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
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Lembrar-me</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                Esqueceu a senha?
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-white group"
              >
                Entrar no MyDay
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm text-gray-600">
                Novo por aqui?{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                  Crie sua conta gratuita
                </a>
              </p>
            </motion.div>
          </form>

          {/* Feature highlights */}
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
        </motion.div>

        <motion.p
          className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 px-4"
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