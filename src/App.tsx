import { AuthProvider, useAuth } from './hooks/useAuth';
import { useAppMode } from './hooks/useAppMode';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './components/auth/LoginPage';

function AppContent() {
  const { mode } = useAppMode();
  const { isAuthenticated, isLoading } = useAuth();

  // Standalone mode: show app directly (existing behavior)
  if (mode === 'standalone') {
    return <AppShell />;
  }

  // Server mode: show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  // Server mode: not authenticated -> login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Server mode: authenticated -> app
  return <AppShell />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
