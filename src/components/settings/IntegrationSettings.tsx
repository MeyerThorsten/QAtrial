import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Check, XCircle, RefreshCw } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';

interface JiraStatus {
  connected: boolean;
  projectKey?: string;
  baseUrl?: string;
  lastSyncAt?: string;
}

interface GithubStatus {
  connected: boolean;
  owner?: string;
  repo?: string;
  lastSyncAt?: string;
}

export function IntegrationSettings() {
  const { t } = useTranslation();

  // Jira state
  const [jiraStatus, setJiraStatus] = useState<JiraStatus>({ connected: false });
  const [jiraLoading, setJiraLoading] = useState(true);
  const [jiraSyncing, setJiraSyncing] = useState(false);
  const [jiraBaseUrl, setJiraBaseUrl] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraApiToken, setJiraApiToken] = useState('');
  const [jiraProjectKey, setJiraProjectKey] = useState('');
  const [jiraConnecting, setJiraConnecting] = useState(false);
  const [jiraError, setJiraError] = useState<string | null>(null);

  // GitHub state
  const [githubStatus, setGithubStatus] = useState<GithubStatus>({ connected: false });
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubToken, setGithubToken] = useState('');
  const [githubOwner, setGithubOwner] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubConnecting, setGithubConnecting] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);

  const loadJiraStatus = useCallback(async () => {
    try {
      const data = await apiFetch<JiraStatus>('/integrations/jira/status');
      setJiraStatus(data);
    } catch {
      setJiraStatus({ connected: false });
    } finally {
      setJiraLoading(false);
    }
  }, []);

  const loadGithubStatus = useCallback(async () => {
    try {
      const data = await apiFetch<GithubStatus>('/integrations/github/status');
      setGithubStatus(data);
    } catch {
      setGithubStatus({ connected: false });
    } finally {
      setGithubLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJiraStatus();
    loadGithubStatus();
  }, [loadJiraStatus, loadGithubStatus]);

  const connectJira = async () => {
    setJiraConnecting(true);
    setJiraError(null);
    try {
      await apiFetch('/integrations/jira/connect', {
        method: 'POST',
        body: JSON.stringify({
          baseUrl: jiraBaseUrl,
          email: jiraEmail,
          apiToken: jiraApiToken,
          projectKey: jiraProjectKey,
        }),
      });
      loadJiraStatus();
      setJiraBaseUrl('');
      setJiraEmail('');
      setJiraApiToken('');
      setJiraProjectKey('');
    } catch (err: any) {
      setJiraError(err.message || 'Connection failed');
    } finally {
      setJiraConnecting(false);
    }
  };

  const syncJira = async () => {
    setJiraSyncing(true);
    try {
      await apiFetch('/integrations/jira/sync', { method: 'POST' });
      loadJiraStatus();
    } catch (err) {
      console.error('Jira sync failed:', err);
    } finally {
      setJiraSyncing(false);
    }
  };

  const connectGithub = async () => {
    setGithubConnecting(true);
    setGithubError(null);
    try {
      await apiFetch('/integrations/github/connect', {
        method: 'POST',
        body: JSON.stringify({
          token: githubToken,
          owner: githubOwner,
          repo: githubRepo,
        }),
      });
      loadGithubStatus();
      setGithubToken('');
      setGithubOwner('');
      setGithubRepo('');
    } catch (err: any) {
      setGithubError(err.message || 'Connection failed');
    } finally {
      setGithubConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-text-primary">{t('integrations.title')}</h3>

      {/* Jira Card */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-surface-secondary border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">{t('integrations.jira')}</span>
            {jiraLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-text-tertiary" />
            ) : jiraStatus.connected ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md">
                <Check className="w-3 h-3" />
                {t('integrations.connected')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-md">
                <XCircle className="w-3 h-3" />
                {t('integrations.disconnected')}
              </span>
            )}
          </div>
          {jiraStatus.connected && (
            <button
              onClick={syncJira}
              disabled={jiraSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-accent bg-accent-subtle rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {jiraSyncing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {t('integrations.syncNow')}
            </button>
          )}
        </div>
        <div className="px-4 py-3">
          {jiraStatus.connected ? (
            <div className="space-y-1 text-sm text-text-secondary">
              <p>Project: <span className="font-medium text-text-primary">{jiraStatus.projectKey}</span></p>
              <p>URL: <span className="text-text-tertiary">{jiraStatus.baseUrl}</span></p>
              {jiraStatus.lastSyncAt && (
                <p>{t('integrations.lastSync', { date: new Date(jiraStatus.lastSyncAt).toLocaleString() })}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('integrations.baseUrl')}</label>
                <input
                  type="url"
                  value={jiraBaseUrl}
                  onChange={(e) => setJiraBaseUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://your-org.atlassian.net"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">{t('auth.email')}</label>
                  <input
                    type="email"
                    value={jiraEmail}
                    onChange={(e) => setJiraEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">{t('integrations.projectKey')}</label>
                  <input
                    type="text"
                    value={jiraProjectKey}
                    onChange={(e) => setJiraProjectKey(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="PROJ"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('integrations.apiToken')}</label>
                <input
                  type="password"
                  value={jiraApiToken}
                  onChange={(e) => setJiraApiToken(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Jira API Token"
                />
              </div>
              {jiraError && (
                <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {jiraError}
                </div>
              )}
              <button
                onClick={connectJira}
                disabled={jiraConnecting || !jiraBaseUrl || !jiraEmail || !jiraApiToken || !jiraProjectKey}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {jiraConnecting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {t('integrations.connect')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GitHub Card */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-surface-secondary border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">{t('integrations.github')}</span>
            {githubLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-text-tertiary" />
            ) : githubStatus.connected ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md">
                <Check className="w-3 h-3" />
                {t('integrations.connected')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-md">
                <XCircle className="w-3 h-3" />
                {t('integrations.disconnected')}
              </span>
            )}
          </div>
        </div>
        <div className="px-4 py-3">
          {githubStatus.connected ? (
            <div className="space-y-1 text-sm text-text-secondary">
              <p>
                Repository:{' '}
                <span className="font-medium text-text-primary">
                  {githubStatus.owner}/{githubStatus.repo}
                </span>
              </p>
              {githubStatus.lastSyncAt && (
                <p>{t('integrations.lastSync', { date: new Date(githubStatus.lastSyncAt).toLocaleString() })}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">{t('integrations.owner')}</label>
                  <input
                    type="text"
                    value={githubOwner}
                    onChange={(e) => setGithubOwner(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="octocat"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">{t('integrations.repo')}</label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="my-repo"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('integrations.token')}</label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="ghp_..."
                />
              </div>
              {githubError && (
                <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {githubError}
                </div>
              )}
              <button
                onClick={connectGithub}
                disabled={githubConnecting || !githubToken || !githubOwner || !githubRepo}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {githubConnecting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {t('integrations.connect')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
