import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-lg bg-surface-tertiary hover:bg-surface-hover border border-border flex items-center justify-center transition-all"
      title={theme === 'light' ? t('theme.dark') : t('theme.light')}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-text-secondary" />
      ) : (
        <Sun className="w-4 h-4 text-warning" />
      )}
    </button>
  );
}
