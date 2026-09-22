import { DataProvider, ProviderDescriptor } from './dataProviderTypes';
import { firebaseDataProvider, FIREBASE_CAPABILITIES } from './firebaseDataProvider';
import { GOOGLE_SHEETS_DESCRIPTOR } from './googleSheetsDataProvider';
import { MYSQL_DESCRIPTOR, SUPABASE_DESCRIPTOR } from './relationalDataProvider';
import { BOOTSTRAP_CONFIG } from '../../config/bootstrapConfig';

/**
 * Firebase Production Descriptor
 */
export const FIREBASE_DESCRIPTOR: ProviderDescriptor = {
  id: 'firebase',
  name: 'Firebase (Haaply Cloud)',
  description: 'Production cloud database with Firebase Storage assets and real-time inventory.',
  capabilities: FIREBASE_CAPABILITIES,
  status: 'production',
  requiresBackendProxy: false,
};

/**
 * Registry of all supported or planned data providers and their capability profiles
 */
export const PROVIDER_REGISTRY: Record<string, ProviderDescriptor> = {
  firebase: FIREBASE_DESCRIPTOR,
  'google-sheets': GOOGLE_SHEETS_DESCRIPTOR,
  mysql: MYSQL_DESCRIPTOR,
  supabase: SUPABASE_DESCRIPTOR,
};

/**
 * Active provider instances cache
 * Only initialized/connected providers are instantiated here.
 */
const ACTIVE_PROVIDERS: Record<string, DataProvider> = {
  firebase: firebaseDataProvider,
};

export const DEFAULT_DATA_PROVIDER_ID = BOOTSTRAP_CONFIG.activeProviderId || 'firebase';

/**
 * Returns list of all registered provider descriptors
 */
export function getRegisteredProviders(): ProviderDescriptor[] {
  return Object.values(PROVIDER_REGISTRY);
}

/**
 * Resolves an active DataProvider by ID.
 * Defaults safely to the production FirebaseDataProvider if unspecified or not yet connected.
 */
export function getDataProvider(providerId?: string): DataProvider {
  const targetId = providerId || DEFAULT_DATA_PROVIDER_ID;

  if (ACTIVE_PROVIDERS[targetId]) {
    return ACTIVE_PROVIDERS[targetId];
  }

  // If a planned provider (like google-sheets or mysql) is requested without an active connection,
  // log warning and fallback to the verified production Firebase provider.
  const descriptor = PROVIDER_REGISTRY[targetId];
  if (descriptor && descriptor.status !== 'production') {
    console.warn(
      `[DataProviderRegistry] Provider '${targetId}' is registered as '${descriptor.status}' and not yet connected. Falling back to production Firebase provider.`
    );
  }

  return firebaseDataProvider;
}
