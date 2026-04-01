/**
 * External QMS/ALM Connector Interface Definitions
 *
 * These interfaces define the contract for integrating QAtrial with
 * external quality management and application lifecycle management systems.
 * Connectors are implemented as plugins that register with the connector registry.
 */

// ── Connector lifecycle ──────────────────────────────────────────────────────

export type ConnectorStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type ConnectorType =
  | 'jira'
  | 'azure_devops'
  | 'github'
  | 'gitlab'
  | 'veeva_vault'
  | 'mastercontrol'
  | 'trackwise'
  | 'sharepoint'
  | 'confluence'
  | 'custom';

export interface ConnectorConfig {
  id: string;
  type: ConnectorType;
  name: string;
  /** Base URL of the external system */
  baseUrl: string;
  /** Authentication method */
  authType: 'api_key' | 'oauth2' | 'basic' | 'token';
  /** Status of the connection */
  status: ConnectorStatus;
  /** Last successful sync timestamp */
  lastSyncAt?: string;
  /** Error message if status is 'error' */
  error?: string;
  /** Connector-specific configuration */
  settings: Record<string, unknown>;
  /** Whether sync is enabled */
  enabled: boolean;
  /** Sync direction */
  syncDirection: 'push' | 'pull' | 'bidirectional';
  /** Mapping rules for field synchronization */
  fieldMappings: FieldMapping[];
}

// ── Field mapping ────────────────────────────────────────────────────────────

export interface FieldMapping {
  /** QAtrial field path (e.g., 'requirement.title') */
  sourceField: string;
  /** External system field path (e.g., 'issue.summary') */
  targetField: string;
  /** Transform function name (optional) */
  transform?: 'direct' | 'uppercase' | 'lowercase' | 'prefix' | 'custom';
  /** Transform parameter (e.g., prefix string) */
  transformParam?: string;
}

// ── Sync operations ──────────────────────────────────────────────────────────

export type SyncEntityType = 'requirement' | 'test' | 'defect' | 'risk' | 'capa' | 'document';

export interface SyncRecord {
  id: string;
  connectorId: string;
  /** QAtrial entity type */
  entityType: SyncEntityType;
  /** QAtrial entity ID */
  localId: string;
  /** External system entity ID */
  remoteId: string;
  /** Last sync timestamp */
  lastSyncAt: string;
  /** Sync status */
  status: 'synced' | 'pending' | 'conflict' | 'error';
  /** Direction of last sync */
  direction: 'push' | 'pull';
  /** Error details if any */
  error?: string;
}

export interface SyncResult {
  success: boolean;
  created: number;
  updated: number;
  deleted: number;
  conflicts: number;
  errors: string[];
  duration: number;
}

// ── Connector interface ──────────────────────────────────────────────────────

/**
 * Interface that all connectors must implement.
 * Each connector handles authentication, data mapping, and sync logic
 * for its specific external system.
 */
export interface Connector {
  /** Unique connector type identifier */
  type: ConnectorType;
  /** Human-readable name */
  displayName: string;
  /** Test the connection with current configuration */
  testConnection: (config: ConnectorConfig) => Promise<{ ok: boolean; error?: string }>;
  /** Push local changes to external system */
  push: (config: ConnectorConfig, entities: SyncEntity[]) => Promise<SyncResult>;
  /** Pull remote changes into QAtrial */
  pull: (config: ConnectorConfig) => Promise<SyncResult>;
  /** Get available fields from external system (for mapping UI) */
  getRemoteFields: (config: ConnectorConfig) => Promise<RemoteField[]>;
}

export interface SyncEntity {
  type: SyncEntityType;
  id: string;
  data: Record<string, unknown>;
  operation: 'create' | 'update' | 'delete';
}

export interface RemoteField {
  path: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'enum' | 'array';
  required: boolean;
  enumValues?: string[];
}

// ── Connector registry ───────────────────────────────────────────────────────

/**
 * Registry of available connector implementations.
 * Connectors register themselves here on module load.
 */
export const connectorRegistry = new Map<ConnectorType, Connector>();

export function registerConnector(connector: Connector): void {
  connectorRegistry.set(connector.type, connector);
}

export function getConnector(type: ConnectorType): Connector | undefined {
  return connectorRegistry.get(type);
}
