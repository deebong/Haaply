import { ProviderCapabilities, ProviderDescriptor } from './dataProviderTypes';

/**
 * Capabilities of a Relational SQL / REST Backend (MySQL, PostgreSQL, Supabase)
 * Highlights strong schema integrity, advanced SQL query capabilities, and transactions.
 */
export const RELATIONAL_CAPABILITIES: ProviderCapabilities = {
  realtime: false, // true for Supabase, false for standard MySQL/Postgres without WebSocket server
  transactions: true,
  serverFiltering: true,
  advancedQueries: true,
  bulkOperations: true,
  offlineSupport: false,
  authSupported: true, // when paired with Auth service or Supabase Auth
};

export const MYSQL_DESCRIPTOR: ProviderDescriptor = {
  id: 'mysql',
  name: 'MySQL / PostgreSQL (API Layer)',
  description: 'Enterprise relational database accessed via secure backend API (Express / Cloud Run / NestJS).',
  capabilities: RELATIONAL_CAPABILITIES,
  status: 'planned',
  requiresBackendProxy: true,
};

export const SUPABASE_DESCRIPTOR: ProviderDescriptor = {
  id: 'supabase',
  name: 'Supabase (PostgreSQL + Auth)',
  description: 'PostgreSQL database with built-in row-level security (RLS) and real-time event streaming.',
  capabilities: {
    ...RELATIONAL_CAPABILITIES,
    realtime: true,
  },
  status: 'planned',
  requiresBackendProxy: false, // Uses public client key + RLS
};
