import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { t } = useTranslation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register' && password !== confirmPassword) {
      setError(t('auth.registerError'));
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err: unknown) {
      setError(
        mode === 'login'
          ? t('auth.loginError')
          : (err instanceof Error ? err.message : null) || t('auth.registerError'),
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gradient-start to-gradient-end mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">QA</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">QAtrial</h1>
          <p className="text-sm text-text-secondary mt-1">
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-xl border border-border shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-text-secondary mb-1.5">
                  {t('auth.name')}
                </label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-tertiary"
                  placeholder="Jane Doe"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                {t('auth.email')}
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-tertiary"
                placeholder="you@company.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-tertiary"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="auth-confirm" className="block text-sm font-medium text-text-secondary mb-1.5">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  id="auth-confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-tertiary"
                  placeholder="********"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? t('auth.login') : t('auth.register')}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-accent hover:underline"
            >
              {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
