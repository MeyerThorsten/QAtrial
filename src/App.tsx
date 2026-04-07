import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useAppMode } from './hooks/useAppMode';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './components/auth/LoginPage';

const AuditModeView = lazy(() => import('./components/audit/AuditModeView').then((m) => ({ default: m.AuditModeView })));
const SupplierPortalView = lazy(() => import('./components/suppliers/SupplierPortalView').then((m) => ({ default: m.SupplierPortalView })));

/**
 * Check if the current URL is an audit mode link: /audit/{token}
 */
function getAuditToken(): string | null {
  const path = window.location.pathname;
  const match = path.match(/^\/audit\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * Check if the current URL is a supplier portal link: /supplier/{token}
 */
function getSupplierPortalToken(): string | null {
  const path = window.location.pathname;
  const match = path.match(/^\/supplier\/(.+)$/);
  return match ? match[1] : null;
}

function AppContent() {
  const { mode } = useAppMode();
  const { isAuthenticated, isLoading } = useAuth();

  // Check for audit mode URL — this bypasses all auth
  const auditToken = getAuditToken();
  if (auditToken) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }>
        <AuditModeView token={auditToken} />
      </Suspense>
    );
  }

  // Check for supplier portal URL — this bypasses all auth
  const supplierToken = getSupplierPortalToken();
  if (supplierToken) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }>
        <SupplierPortalView token={supplierToken} />
      </Suspense>
    );
  }

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
