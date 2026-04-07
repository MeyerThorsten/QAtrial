import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { useThemeStore } from './store/useThemeStore'
import App from './App.tsx'

// Initialize theme from persisted state
const theme = useThemeStore.getState().theme;
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — non-critical
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-surface-secondary flex items-center justify-center"><div className="text-text-tertiary">Loading...</div></div>}>
      <App />
    </Suspense>
  </StrictMode>,
)
