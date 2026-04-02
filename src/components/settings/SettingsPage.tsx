import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Webhook, Plug, Shield, Loader2 } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';

const ProviderSettings = lazy(() =>
  import('../ai/ProviderSettings').then((m) => ({ default: m.ProviderSettings })),
);
const WebhookSettings = lazy(() =>
  import('./WebhookSettings').then((m) => ({ default: m.WebhookSettings })),
);
const IntegrationSettings = lazy(() =>
  import('./IntegrationSettings').then((m) => ({ default: m.IntegrationSettings })),
);

type SettingsTab = 'ai' | 'webhooks' | 'integrations' | 'sso';

function TabSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-5 h-5 animate-spin text-text-tertiary" />
    </div>
  );
}

function SsoStatusPanel() {
  const { t } = useTranslation();
  const [ssoConfig, setSsoConfig] = useState<{
    enabled: boolean;
    type: string;
    providerName: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ enabled: boolean; type: string; providerName: string | null }>('/auth/sso/config')
      .then(setSsoConfig)
      .catch(() => setSsoConfig({ enabled: false, type: 'oidc', providerName: null }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <TabSpinner />;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-text-primary">{t('settings.sso')}</h3>
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              ssoConfig?.enabled
                ? 'bg-green-500/10 text-green-600'
                : 'bg-surface-secondary text-text-tertiary'
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {ssoConfig?.enabled ? t('sso.enabled') : t('sso.disabled')}
            </p>
            {ssoConfig?.enabled && ssoConfig.providerName && (
              <p className="text-xs text-text-tertiary">
                {t('sso.provider', { name: ssoConfig.providerName })} ({ssoConfig.type.toUpperCase()})
              </p>
            )}
            {!ssoConfig?.enabled && (
              <p className="text-xs text-text-tertiary mt-1">
                Configure SSO via environment variables (SSO_ENABLED, SSO_ISSUER_URL, etc.)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('ai');

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'ai', label: t('settings.aiProviders'), icon: <Bot className="w-4 h-4" /> },
    { id: 'webhooks', label: t('settings.webhooks'), icon: <Webhook className="w-4 h-4" /> },
    { id: 'integrations', label: t('settings.integrations'), icon: <Plug className="w-4 h-4" /> },
    { id: 'sso', label: t('settings.sso'), icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg font-bold text-text-primary">{t('settings.title')}</h2>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-accent border-accent'
                : 'text-text-tertiary border-transparent hover:text-text-secondary hover:border-border'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <Suspense fallback={<TabSpinner />}>
        {activeTab === 'ai' && <ProviderSettings />}
        {activeTab === 'webhooks' && <WebhookSettings />}
        {activeTab === 'integrations' && <IntegrationSettings />}
        {activeTab === 'sso' && <SsoStatusPanel />}
      </Suspense>
    </div>
  );
}
