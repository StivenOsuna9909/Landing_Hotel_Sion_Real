import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, User, Hotel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      const success = login(username, password);
      setIsLoading(false);

      if (success) {
        toast({
          title: 'Inicio de sesión exitoso',
          description: 'Redirigiendo al dashboard...',
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: 'Error de autenticación',
          description: 'Usuario o contraseña incorrectos',
          variant: 'destructive',
        });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-elegant p-8 space-y-6">
          {/* Logo/Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Hotel className="text-primary" size={32} />
            </div>
            <h1 className="font-display text-3xl text-foreground">Hotel Sion Real</h1>
            <p className="font-body text-muted-foreground">Panel de Administración</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                <User size={16} />
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ingrese su usuario"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                <Lock size={16} />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ingrese su contraseña"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold rounded-lg py-3 font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="pt-4 border-t border-border">
            <p className="font-body text-xs text-muted-foreground text-center">
              Acceso restringido solo para administradores autorizados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

