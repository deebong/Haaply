/**
 * Bootstrap Configuration for Multi-Backend Storefront Platform
 * 
 * ARCHITECTURAL PRINCIPLE:
 * Resolves the database dependency loop. If active database selection is stored
 * inside the database itself, a client application cannot know which database to connect
 * to without first querying it.
 * 
 * Therefore, bootstrap parameters are declared at the application entry level
 * (environment variables, build constants, or local configuration files) rather
 * than retrieved from a remote provider.
 */

export type DataProviderId = 'firebase' | 'google-sheets' | 'mysql' | 'postgresql' | 'supabase';

export interface BootstrapConfig {
  /** Identifier of the active data provider */
  activeProviderId: DataProviderId;
  /** Current operating environment */
  environment: 'development' | 'staging' | 'production';
  /** Unique storefront identifier for multi-tenant tenancy */
  siteIdentifier: string;
  /** Configuration schema version */
  configVersion: string;
  /** Default fallback provider if active provider is unreachable */
  fallbackProviderId?: DataProviderId;
}

export const BOOTSTRAP_CONFIG: BootstrapConfig = {
  activeProviderId: 'firebase',
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  siteIdentifier: 'haaply-storefront-in',
  configVersion: '1.0.0',
  fallbackProviderId: 'firebase',
};
